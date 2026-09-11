const questions = require('../data/mchatQuestions');

// Determine if a single answer is an "at-risk" response (worth 1 point)
// Reverse-scored (Q2, Q5, Q12): Yes = 1 point
// All other questions:            No  = 1 point
function isAtRisk(questionNumber, answerYes) {
  const q = questions.find(x => x.number === questionNumber);
  if (!q) throw new Error(`Invalid question number: ${questionNumber}`);

  return q.reverseScored ? answerYes === true : answerYes === false;
}

// Sum the score from an array of stored responses
function computeTotalScore(responses) {
  return responses.reduce(
    (sum, r) => sum + (r.is_at_risk_response ? 1 : 0),
    0
  );
}

// Official M-CHAT-R thresholds
function getRiskLevel(score) {
  if (score <= 2)  return 'Low';
  if (score <= 7)  return 'Medium';
  return 'High';
}

// Official action plan text per score band
function getActionPlan(score) {
  if (score <= 2) {
    return 'Low likelihood for autism. No follow-up needed. ' +
           'Refer as needed if developmental surveillance raises concerns. ' +
           'Rescreen at 24 months if the child is younger than 2 years old.';
  }
  if (score <= 7) {
    return 'Moderate likelihood for autism. Administer the M-CHAT-R Follow-Up ' +
           'items that correspond to the elevated responses. If 2 or more items ' +
           'continue to indicate elevated likelihood, refer immediately for ' +
           '(a) early intervention and (b) diagnostic evaluation.';
  }
  return 'High likelihood for autism. The child has screened positive. ' +
         'Bypass follow-up and refer immediately for (a) early intervention ' +
         'and (b) diagnostic evaluation.';
}

// Follow-up interview is only triggered for Medium band (3–7)
function shouldFollowUp(score) {
  return score >= 3 && score <= 7;
}

module.exports = {
  isAtRisk,
  computeTotalScore,
  getRiskLevel,
  getActionPlan,
  shouldFollowUp
};