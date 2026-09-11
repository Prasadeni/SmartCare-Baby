// Total length of a full-term pregnancy in weeks
const FULL_TERM_WEEKS = 40;

// Given a stored `current_gestational_weeks` + when it was set,
// compute the current week and days (it advances with time)
function computeCurrentGestational(lmpOrWeeks, startedAt, now = new Date()) {
  // How many days have passed since the user set the weeks
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysSinceSet = Math.floor((now - new Date(startedAt)) / msPerDay);

  // Current total days = weeks*7 + days passed
  const totalDays = lmpOrWeeks * 7 + daysSinceSet;

  const weeks = Math.floor(totalDays / 7);
  const days  = totalDays % 7;

  return { weeks, days, totalDays };
}

// "1st" | "2nd" | "3rd"
function computeTrimester(weeks) {
  if (weeks < 13) return '1st';
  if (weeks < 28) return '2nd';
  return '3rd';
}

// How many days remain until 40 weeks
function computeDaysRemaining(currentTotalDays) {
  const fullTermDays = FULL_TERM_WEEKS * 7;
  return Math.max(0, fullTermDays - currentTotalDays);
}

// Progress percentage 0–100 (based on 40 weeks)
function computeProgressPercent(currentTotalDays) {
  const fullTermDays = FULL_TERM_WEEKS * 7;
  return Math.min(100, Math.round((currentTotalDays / fullTermDays) * 100));
}

// Rule engine: is the kick count concerning?
// Standard: 10 movements in 2 hours is normal.
// We compute a simple rate: kicks per hour.
function evaluateKickSession(count, durationMinutes) {
  if (durationMinutes <= 0) return { alert: false };

  const kicksPerHour = (count / durationMinutes) * 60;

  // Threshold: < 5 kicks per hour while lying down → alert
  const alert = kicksPerHour < 5;
  return { alert, kicksPerHour: Math.round(kicksPerHour * 10) / 10 };
}

// Contraction summary: how frequent, how long, are they consistent?
function analyzeContractions(contractions) {
  if (!contractions.length) {
    return { count: 0, averageDuration: 0, averageInterval: 0, status: 'No contractions logged' };
  }

  const totalDuration = contractions.reduce((s, c) => s + c.duration_seconds, 0);
  const totalInterval = contractions.reduce((s, c) => s + (c.interval_minutes || 0), 0);
  const n = contractions.length;

  const avgDuration = Math.round(totalDuration / n);
  const avgInterval = Math.round(totalInterval / n);

  // Clinical rule of thumb:
  // Active labor = contractions every 5 min, lasting 60s+
  let status = 'Early / Irregular';
  if (avgInterval <= 5 && avgDuration >= 60) status = 'Active labor pattern';
  else if (avgInterval <= 10 && avgDuration >= 45) status = 'Progressing';

  return {
    count: n,
    averageDuration: avgDuration,
    averageInterval: avgInterval,
    status
  };
}

module.exports = {
  computeCurrentGestational,
  computeTrimester,
  computeDaysRemaining,
  computeProgressPercent,
  evaluateKickSession,
  analyzeContractions
};