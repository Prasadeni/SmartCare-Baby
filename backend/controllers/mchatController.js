const MchatAssessment = require('../models/MchatAssessment');
const Baby = require('../models/Baby');
const questions = require('../data/mchatQuestions');
const {
  isAtRisk,
  computeTotalScore,
  getRiskLevel,
  getActionPlan,
  shouldFollowUp
} = require('../utils/mchatScoring');

// GET /api/mchat/questions
// Returns the 20 questions (hides internal reverseScored flag from client)
exports.getQuestions = (req, res) => {
  const publicQuestions = questions.map(q => ({
    number: q.number,
    text: q.text,
    hint: q.hint
  }));

  res.json({
    success: true,
    count: publicQuestions.length,
    data: publicQuestions
  });
};

// POST /api/mchat/start
// Body: { baby_id }
exports.startAssessment = async (req, res) => {
  try {
    const { baby_id } = req.body;

    if (!baby_id) {
      return res.status(400).json({ success: false, message: 'baby_id is required' });
    }

    const baby = await Baby.findById(baby_id);
    if (!baby) {
      return res.status(404).json({ success: false, message: 'Baby not found' });
    }

    // Compute age in months
    const now = new Date();
    const dob = new Date(baby.dob);
    let ageMonths = (now.getFullYear() - dob.getFullYear()) * 12
                  + (now.getMonth() - dob.getMonth());
    if (now.getDate() < dob.getDate()) ageMonths -= 1;

    // Warn (don't block) if outside the validated range
    let ageWarning = null;
    if (ageMonths < 16) {
      ageWarning = 'Child is younger than 16 months. M-CHAT-R is not validated for this age.';
    } else if (ageMonths > 30) {
      ageWarning = 'Child is older than 30 months. M-CHAT-R is not validated for this age.';
    }

    const assessment = await MchatAssessment.create({
      baby_id,
      assessed_by: req.user._id,
      baby_age_months: ageMonths,
      status: 'in_progress',
      current_question: 1,
      responses: []
    });

    res.status(201).json({
      success: true,
      data: assessment,
      ageWarning
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/mchat/:id/answer
// Body: { question_number, response_bool }
exports.saveAnswer = async (req, res) => {
  try {
    const { question_number, response_bool } = req.body;

    if (typeof question_number !== 'number' || typeof response_bool !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'question_number (number) and response_bool (boolean) are required'
      });
    }

    const assessment = await MchatAssessment.findById(req.params.id);
    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }
    if (assessment.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Assessment already completed' });
    }

    const q = questions.find(x => x.number === question_number);
    if (!q) {
      return res.status(400).json({ success: false, message: 'Invalid question number' });
    }

    const atRisk = isAtRisk(question_number, response_bool);

    const newResponse = {
      question_number,
      question_text: q.text,
      response_bool,
      is_at_risk_response: atRisk,
      reverse_scored: q.reverseScored
    };

    // Replace existing answer if the user went back and changed it
    const idx = assessment.responses.findIndex(r => r.question_number === question_number);
    if (idx >= 0) assessment.responses[idx] = newResponse;
    else assessment.responses.push(newResponse);

    assessment.current_question = Math.min(question_number + 1, 20);

    await assessment.save();

    res.json({ success: true, data: assessment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/mchat/:id/complete
exports.completeAssessment = async (req, res) => {
  try {
    const assessment = await MchatAssessment.findById(req.params.id);
    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    if (assessment.responses.length < 20) {
      return res.status(400).json({
        success: false,
        message: `Only ${assessment.responses.length}/20 questions answered.`
      });
    }

    const totalScore = computeTotalScore(assessment.responses);

    assessment.total_risk_score = totalScore;
    assessment.risk_level       = getRiskLevel(totalScore);
    assessment.follow_up_needed = shouldFollowUp(totalScore);
    assessment.action_plan      = getActionPlan(totalScore);
    assessment.status           = 'completed';
    assessment.current_question = 20;

    await assessment.save();

    res.json({ success: true, data: assessment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/mchat/history/:babyId
exports.getHistory = async (req, res) => {
  try {
    const list = await MchatAssessment
      .find({ baby_id: req.params.babyId, status: 'completed' })
      .sort({ assessed_at: -1 });

    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/mchat/:id  (fetch one — supports resume)
exports.getOne = async (req, res) => {
  try {
    const a = await MchatAssessment.findById(req.params.id);
    if (!a) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }
    res.json({ success: true, data: a });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};