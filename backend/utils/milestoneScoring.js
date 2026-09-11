// Rule: a milestone is delayed if
//   - not achieved
//   - not marked "unsure"
//   - its expected age <= baby's current age
function computeDelay(item, babyAgeMonths) {
  if (item.unsure)   return false;
  if (item.achieved) return false;
  return item.expected_age_months_snapshot <= babyAgeMonths;
}

// Group items by area for the "Summary Preview" panel
function groupByArea(items) {
  const groups = {};
  items.forEach(i => {
    if (!groups[i.area_snapshot]) {
      groups[i.area_snapshot] = { total: 0, answered: 0, achieved: 0, delays: 0 };
    }
    const g = groups[i.area_snapshot];
    g.total += 1;
    if (i.answered)  g.answered  += 1;
    if (i.achieved)  g.achieved  += 1;
    if (i.is_delayed) g.delays   += 1;
  });
  return groups;
}

// Summary computation on complete
function computeSummary(items, babyAgeMonths) {
  const totalItems    = items.length;
  const totalAnswered = items.filter(i => i.answered).length;
  const delays        = items.filter(i => i.is_delayed);
  const criticalDelays = delays.filter(i => i.is_critical_snapshot).length;

  let status = 'Progressing normally';
  let recommendation = 'No developmental delays detected at this age. Continue routine monitoring.';

  if (criticalDelays >= 1 || delays.length >= 3) {
    status = 'Refer';
    recommendation = 'Multiple developmental delays detected. Please consult a pediatrician or developmental specialist for a comprehensive evaluation.';
  } else if (delays.length >= 1) {
    status = 'Monitor';
    recommendation = 'One or two milestones are not yet achieved at the expected age. Continue monitoring for 4–6 weeks; if still delayed, consult your pediatrician.';
  }

  return {
    total_items: totalItems,
    total_answered: totalAnswered,
    total_delays: delays.length,
    critical_delays: criticalDelays,
    summary_status: status,
    recommendation
  };
}

module.exports = { computeDelay, groupByArea, computeSummary };