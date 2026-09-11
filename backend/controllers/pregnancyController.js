const Pregnancy = require('../models/Pregnancy');
const {
  computeCurrentGestational,
  computeTrimester,
  computeDaysRemaining,
  computeProgressPercent,
  evaluateKickSession,
  analyzeContractions
} = require('../utils/pregnancyCalculations');

// Build the full "timeline" view for a pregnancy (used by GET endpoints)
function buildPregnancyView(pregnancy) {
  const { weeks, days, totalDays } = computeCurrentGestational(
    pregnancy.current_gestational_weeks,
    pregnancy.started_at
  );

  return {
    _id: pregnancy._id,
    user_id: pregnancy.user_id,
    entered_weeks: pregnancy.current_gestational_weeks,
    started_at: pregnancy.started_at,
    is_current: pregnancy.is_current,

    // live-computed
    current_week: weeks,
    current_days: days,
    trimester: computeTrimester(weeks),
    days_remaining: computeDaysRemaining(totalDays),
    progress_percent: computeProgressPercent(totalDays),

    // counts for the UI
    kick_session_count: pregnancy.kick_sessions.length,
    weight_log_count:   pregnancy.weight_logs.length,
    contraction_count:  pregnancy.contractions.length,

    created_at: pregnancy.created_at,
    updated_at: pregnancy.updated_at
  };
}

// ---------- POST /api/pregnancy/start ----------
// Body: { weeks }
exports.startPregnancy = async (req, res) => {
  try {
    const { weeks } = req.body;
    if (typeof weeks !== 'number' || weeks < 0 || weeks > 45) {
      return res.status(400).json({
        success: false,
        message: 'weeks (number 0–45) is required'
      });
    }

    // Mark any existing pregnancies as not current
    await Pregnancy.updateMany(
      { user_id: req.user._id, is_current: true },
      { $set: { is_current: false } }
    );

    const pregnancy = await Pregnancy.create({
      user_id: req.user._id,
      current_gestational_weeks: weeks,
      started_at: new Date(),
      is_current: true
    });

    res.status(201).json({
      success: true,
      data: buildPregnancyView(pregnancy)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---------- GET /api/pregnancy/current ----------
exports.getCurrent = async (req, res) => {
  try {
    const pregnancy = await Pregnancy.findOne({
      user_id: req.user._id,
      is_current: true
    });

    if (!pregnancy) {
      return res.status(404).json({
        success: false,
        message: 'No active pregnancy found'
      });
    }

    res.json({ success: true, data: buildPregnancyView(pregnancy) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---------- GET /api/pregnancy/:id ----------
exports.getOne = async (req, res) => {
  try {
    const pregnancy = await Pregnancy.findById(req.params.id);
    if (!pregnancy) {
      return res.status(404).json({ success: false, message: 'Pregnancy not found' });
    }
    res.json({ success: true, data: buildPregnancyView(pregnancy) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---------- PATCH /api/pregnancy/:id ----------
// Body: { weeks }  — user updates the week (e.g., next checkup)
exports.updateWeeks = async (req, res) => {
  try {
    const { weeks } = req.body;
    if (typeof weeks !== 'number' || weeks < 0 || weeks > 45) {
      return res.status(400).json({
        success: false,
        message: 'weeks (number 0–45) is required'
      });
    }

    const pregnancy = await Pregnancy.findById(req.params.id);
    if (!pregnancy) {
      return res.status(404).json({ success: false, message: 'Pregnancy not found' });
    }

    pregnancy.current_gestational_weeks = weeks;
    pregnancy.started_at = new Date();  // restart the clock for week advancement
    await pregnancy.save();

    res.json({ success: true, data: buildPregnancyView(pregnancy) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---------- POST /api/pregnancy/:id/kick ----------
// Body: { count, duration_minutes, notes? }
exports.logKick = async (req, res) => {
  try {
    const { count, duration_minutes, notes } = req.body;
    if (typeof count !== 'number' || typeof duration_minutes !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'count (number) and duration_minutes (number) are required'
      });
    }

    const pregnancy = await Pregnancy.findById(req.params.id);
    if (!pregnancy) return res.status(404).json({ success: false, message: 'Not found' });

    const { alert } = evaluateKickSession(count, duration_minutes);

    pregnancy.kick_sessions.push({
      timestamp: new Date(),
      count,
      duration_minutes,
      alert_triggered: alert,
      notes
    });

    await pregnancy.save();

    const saved = pregnancy.kick_sessions[pregnancy.kick_sessions.length - 1];
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---------- GET /api/pregnancy/:id/kicks ----------
exports.getKicks = async (req, res) => {
  try {
    const pregnancy = await Pregnancy.findById(req.params.id);
    if (!pregnancy) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: pregnancy.kick_sessions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---------- POST /api/pregnancy/:id/weight ----------
// Body: { weight_kg, notes? }
exports.logWeight = async (req, res) => {
  try {
    const { weight_kg, notes } = req.body;
    if (typeof weight_kg !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'weight_kg (number) is required'
      });
    }

    const pregnancy = await Pregnancy.findById(req.params.id);
    if (!pregnancy) return res.status(404).json({ success: false, message: 'Not found' });

    // Auto-compute the current gestational week
    const { weeks } = computeCurrentGestational(
      pregnancy.current_gestational_weeks,
      pregnancy.started_at
    );

    pregnancy.weight_logs.push({
      log_date: new Date(),
      weight_kg,
      gestational_weeks: weeks,
      notes
    });

    await pregnancy.save();

    const saved = pregnancy.weight_logs[pregnancy.weight_logs.length - 1];
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---------- GET /api/pregnancy/:id/weights ----------
exports.getWeights = async (req, res) => {
  try {
    const pregnancy = await Pregnancy.findById(req.params.id);
    if (!pregnancy) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: pregnancy.weight_logs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---------- POST /api/pregnancy/:id/contraction ----------
// Body: { start_time, end_time, intensity, notes? }
exports.logContraction = async (req, res) => {
  try {
    const { start_time, end_time, intensity, notes } = req.body;
    if (!start_time || !end_time) {
      return res.status(400).json({
        success: false,
        message: 'start_time and end_time are required'
      });
    }

    const pregnancy = await Pregnancy.findById(req.params.id);
    if (!pregnancy) return res.status(404).json({ success: false, message: 'Not found' });

    const start = new Date(start_time);
    const end   = new Date(end_time);
    const duration_seconds = Math.round((end - start) / 1000);

    if (duration_seconds <= 0) {
      return res.status(400).json({
        success: false,
        message: 'end_time must be after start_time'
      });
    }

    // Compute interval since previous contraction (if any)
    let interval_minutes = 0;
    if (pregnancy.contractions.length > 0) {
      const prev = pregnancy.contractions[pregnancy.contractions.length - 1];
      interval_minutes = Math.round((start - new Date(prev.start_time)) / 60000);
    }

    pregnancy.contractions.push({
      start_time: start,
      end_time: end,
      duration_seconds,
      interval_minutes,
      intensity: intensity || 'Mild',
      notes
    });

    await pregnancy.save();

    const saved = pregnancy.contractions[pregnancy.contractions.length - 1];
    res.status(201).json({
      success: true,
      data: saved,
      analysis: analyzeContractions(pregnancy.contractions)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---------- GET /api/pregnancy/:id/contractions ----------
exports.getContractions = async (req, res) => {
  try {
    const pregnancy = await Pregnancy.findById(req.params.id);
    if (!pregnancy) return res.status(404).json({ success: false, message: 'Not found' });

    res.json({
      success: true,
      data: pregnancy.contractions,
      analysis: analyzeContractions(pregnancy.contractions)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};