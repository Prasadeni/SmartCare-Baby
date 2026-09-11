const MilestoneAssessment = require('../models/MilestoneAssessment');
const Baby = require('../models/Baby');
const milestones = require('../data/milestones');
const { computeDelay, groupByArea, computeSummary } = require('../utils/milestoneScoring');

// ---------- Helpers ----------
function calcAgeMonths(dob) {
  const now = new Date();
  const b = new Date(dob);
  let months = (now.getFullYear() - b.getFullYear()) * 12 + (now.getMonth() - b.getMonth());
  if (now.getDate() < b.getDate()) months -= 1;
  return months;
}

// ---------- GET /api/milestones/config?baby_age_months=9 ----------
exports.getConfig = (req, res) => {
  const age = parseInt(req.query.baby_age_months, 10);
  if (isNaN(age)) {
    return res.status(400).json({ success: false, message: 'baby_age_months query param required' });
  }

  const relevant = milestones.filter(m => m.expected_age_months <= age);

  const grouped = {};
  relevant.forEach(m => {
    if (!grouped[m.area]) grouped[m.area] = [];
    grouped[m.area].push(m);
  });

  res.json({
    success: true,
    baby_age_months: age,
    total: relevant.length,
    areas: Object.keys(grouped),
    data: grouped
  });
};

// ---------- POST /api/milestones/start ----------
exports.startAssessment = async (req, res) => {
  try {
    const { baby_id } = req.body;
    if (!baby_id) return res.status(400).json({ success: false, message: 'baby_id is required' });

    const baby = await Baby.findById(baby_id);
    if (!baby) return res.status(404).json({ success: false, message: 'Baby not found' });

    const ageMonths = calcAgeMonths(baby.dob);

    const relevant = milestones.filter(m => m.expected_age_months <= ageMonths);
    if (relevant.length === 0) {
      return res.status(400).json({ success: false, message: 'No milestones match this baby age.' });
    }

    const items = relevant.map(m => ({
      milestone_id: m.id,
      area_snapshot: m.area,
      description_snapshot: m.description,
      expected_age_months_snapshot: m.expected_age_months,
      is_critical_snapshot: m.is_critical,
      achieved: false,
      unsure: false,
      answered: false,
      is_delayed: false
    }));

    const assessment = await MilestoneAssessment.create({
      baby_id,
      assessed_by: req.user._id,
      baby_age_months: ageMonths,
      items,
      total_items: items.length,
      status: 'in_progress'
    });

    res.status(201).json({ success: true, data: assessment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---------- GET /api/milestones/:id ----------
exports.getOne = async (req, res) => {
  try {
    const a = await MilestoneAssessment.findById(req.params.id);
    if (!a) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: a });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---------- PATCH /api/milestones/:id/answer ----------
exports.saveAnswer = async (req, res) => {
  try {
    const { milestone_id, achieved, unsure } = req.body;
    if (!milestone_id || typeof achieved !== 'boolean' || typeof unsure !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'milestone_id (string), achieved (bool), unsure (bool) required'
      });
    }

    const a = await MilestoneAssessment.findById(req.params.id);
    if (!a) return res.status(404).json({ success: false, message: 'Assessment not found' });
    if (a.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Assessment already completed' });
    }

    const item = a.items.find(i => i.milestone_id === milestone_id);
    if (!item) return res.status(404).json({ success: false, message: 'Milestone not in this assessment' });

    item.achieved  = achieved;
    item.unsure    = unsure;
    item.answered  = true;
    item.is_delayed = computeDelay(item, a.baby_age_months);

    a.total_answered = a.items.filter(i => i.answered).length;

    await a.save();
    res.json({ success: true, data: a });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---------- POST /api/milestones/:id/complete ----------
exports.completeAssessment = async (req, res) => {
  try {
    const a = await MilestoneAssessment.findById(req.params.id);
    if (!a) return res.status(404).json({ success: false, message: 'Assessment not found' });

    if (a.total_answered < a.total_items) {
      return res.status(400).json({
        success: false,
        message: `Only ${a.total_answered}/${a.total_items} milestones answered.`
      });
    }

    const summary = computeSummary(a.items, a.baby_age_months);

    a.total_items     = summary.total_items;
    a.total_answered  = summary.total_answered;
    a.total_delays    = summary.total_delays;
    a.critical_delays = summary.critical_delays;
    a.summary_status  = summary.summary_status;
    a.recommendation  = summary.recommendation;
    a.status = 'completed';

    await a.save();
    res.json({ success: true, data: a });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---------- GET /api/milestones/history/:babyId ----------
exports.getHistory = async (req, res) => {
  try {
    const list = await MilestoneAssessment
      .find({ baby_id: req.params.babyId, status: 'completed' })
      .sort({ assessed_at: -1 });
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---------- GET /api/milestones/summary/:id ----------
exports.getSummary = async (req, res) => {
  try {
    const a = await MilestoneAssessment.findById(req.params.id);
    if (!a) return res.status(404).json({ success: false, message: 'Not found' });

    const areas = groupByArea(a.items);
    res.json({
      success: true,
      data: {
        assessment: a,
        areas,
        progress_percent: Math.round((a.total_answered / a.total_items) * 100)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---------- GET /api/milestones/summary/:id/view  (HTML result page) ----------
exports.viewResultHtml = async (req, res) => {
  try {
    const a = await MilestoneAssessment.findById(req.params.id);
    if (!a) return res.status(404).send('<h1>Assessment not found</h1>');

    const areas = {};
    a.items.forEach(i => {
      if (!areas[i.area_snapshot]) {
        areas[i.area_snapshot] = { total: 0, achieved: 0, delays: 0, unsure: 0, items: [] };
      }
      const g = areas[i.area_snapshot];
      g.total += 1;
      if (i.achieved) g.achieved += 1;
      if (i.is_delayed) g.delays += 1;
      if (i.unsure) g.unsure += 1;
      g.items.push(i);
    });

    const statusColor = {
      'Progressing normally': '#1f7a4d',
      'Monitor':              '#b8860b',
      'Refer':                '#c81e2b'
    }[a.summary_status] || '#7089a8';

    const statusIcon = {
      'Progressing normally': '✓',
      'Monitor':              '!',
      'Refer':                '✕'
    }[a.summary_status] || '?';

    const areaRows = Object.entries(areas).map(([name, g]) => {
      const pct = Math.round((g.achieved / g.total) * 100);
      const areaColor = g.delays > 0 ? '#c81e2b' : '#1f7a4d';
      return `
        <tr>
          <td style="padding:12px 16px;font-weight:600;">${name}</td>
          <td style="padding:12px 16px;">${g.achieved} / ${g.total} achieved</td>
          <td style="padding:12px 16px;">${g.delays > 0 ? `<span style="color:${areaColor};font-weight:700;">${g.delays} delay${g.delays > 1 ? 's' : ''}</span>` : '<span style="color:#1f7a4d;">No delays</span>'}</td>
          <td style="padding:12px 16px;">${pct}%</td>
        </tr>`;
    }).join('');

    const delayed = a.items.filter(i => i.is_delayed);
    const delayedHtml = delayed.length === 0 ? '' : `
      <div style="margin-top:24px;background:#fef2f2;border-left:4px solid #c81e2b;padding:16px 20px;border-radius:8px;">
        <h3 style="margin:0 0 12px;color:#c81e2b;font-size:16px;">Milestones Not Yet Achieved (${delayed.length})</h3>
        <ul style="margin:0;padding-left:20px;line-height:1.8;font-size:14px;color:#4a2b2b;">
          ${delayed.map(d => `<li><strong>${d.area_snapshot}</strong> — ${d.description_snapshot} <em style="color:#888;">(expected by ${d.expected_age_months_snapshot} months)</em></li>`).join('')}
        </ul>
      </div>`;

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Milestone Screening Result</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: -apple-system, 'Segoe UI', system-ui, sans-serif;
            background: #f4f6fb;
            color: #1a2540;
            padding: 40px 20px;
            line-height: 1.55;
          }
          .container { max-width: 760px; margin: 0 auto; }
          .card {
            background: #fff;
            border-radius: 24px;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(15,43,74,0.08);
          }
          h1 { font-size: 24px; color: #0f2b4a; text-align: center; margin-bottom: 4px; }
          .subtitle { text-align: center; color: #7089a8; font-size: 14px; margin-bottom: 32px; }
          .badge {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            background: ${statusColor}15;
            color: ${statusColor};
            padding: 16px 24px;
            border-radius: 16px;
            font-weight: 700;
            font-size: 18px;
            margin-bottom: 28px;
          }
          .badge-icon {
            width: 32px; height: 32px;
            border-radius: 50%;
            background: ${statusColor};
            color: #fff;
            display: flex; align-items: center; justify-content: center;
            font-size: 18px;
          }
          .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            gap: 12px;
            margin-bottom: 28px;
          }
          .stat {
            background: #f7fafd;
            border-radius: 12px;
            padding: 16px;
            text-align: center;
          }
          .stat-value { font-size: 28px; font-weight: 700; color: #0f2b4a; }
          .stat-label { font-size: 12px; color: #7089a8; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; }
          table {
            width: 100%;
            border-collapse: collapse;
            background: #fff;
            border-radius: 12px;
            overflow: hidden;
            margin-bottom: 24px;
          }
          table thead { background: #eaf2ff; }
          table th {
            text-align: left;
            padding: 12px 16px;
            font-size: 12px;
            color: #1f4e79;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          table tbody tr { border-top: 1px solid #f0f3f9; font-size: 14px; }
          .action-box {
            background: #f7fafd;
            border-left: 4px solid ${statusColor};
            padding: 16px 20px;
            border-radius: 8px;
            margin-top: 24px;
          }
          .action-box h3 { font-size: 15px; color: #0f2b4a; margin-bottom: 8px; }
          .action-box p { font-size: 14px; color: #4a5a75; }
          .meta {
            text-align: center;
            color: #7089a8;
            font-size: 12px;
            margin-top: 24px;
          }
          .footer-btn {
            display: inline-block;
            margin-top: 24px;
            padding: 12px 24px;
            border-radius: 30px;
            background: #1f4e79;
            color: #fff;
            text-decoration: none;
            font-size: 14px;
            font-weight: 600;
          }
          .footer-btn:hover { background: #0f2b4a; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <h1>Milestone Screening Result</h1>
            <p class="subtitle">Developmental Checklist — ${a.baby_age_months} months old</p>

            <div class="badge">
              <span class="badge-icon">${statusIcon}</span>
              ${a.summary_status || 'Incomplete'}
            </div>

            <div class="stats">
              <div class="stat">
                <div class="stat-value">${a.total_answered} / ${a.total_items}</div>
                <div class="stat-label">Answered</div>
              </div>
              <div class="stat">
                <div class="stat-value">${a.total_delays}</div>
                <div class="stat-label">Total Delays</div>
              </div>
              <div class="stat">
                <div class="stat-value">${a.critical_delays}</div>
                <div class="stat-label">Critical Delays</div>
              </div>
              <div class="stat">
                <div class="stat-value">${Object.keys(areas).length}</div>
                <div class="stat-label">Areas</div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Area</th>
                  <th>Progress</th>
                  <th>Delays</th>
                  <th>%</th>
                </tr>
              </thead>
              <tbody>
                ${areaRows}
              </tbody>
            </table>

            ${delayedHtml}

            <div class="action-box">
              <h3>Recommended Action</h3>
              <p>${a.recommendation || 'Complete the screening to receive a recommendation.'}</p>
            </div>

            <p class="meta">
              Baby ID: ${a.baby_id} &middot; Assessed: ${new Date(a.assessed_at).toLocaleString()}
            </p>

            <div style="text-align:center;">
              <a href="http://localhost:5173/dashboard" class="footer-btn">Back to Dashboard</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send(`<h1>Server error</h1><pre>${err.message}</pre>`);
  }
};