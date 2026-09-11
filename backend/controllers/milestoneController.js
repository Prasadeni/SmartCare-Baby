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