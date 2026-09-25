// backend/seed/data/risk-thresholds.js
export const riskThresholds = [
  { name: 'Low Risk — Monitor at Home', riskLevel: 'Green', minScore: 0, maxScore: 3, color: '#10b981', description: 'Mild symptoms', recommendationText: 'Monitor at home. Keep your baby hydrated and observe for 24 hours.', actionRequired: '', notifyCaregiver: true, escalateToAdmin: false, sortOrder: 1 },
  { name: 'Medium Risk — Consult Doctor', riskLevel: 'Yellow', minScore: 4, maxScore: 7, color: '#f59e0b', description: 'Symptoms warrant review', recommendationText: 'Consult a pediatrician within 24 hours.', actionRequired: 'Follow up in 24h', notifyCaregiver: true, escalateToAdmin: false, sortOrder: 2 },
  { name: 'High Risk — Immediate Care', riskLevel: 'Red', minScore: 8, maxScore: 999, color: '#dc2626', description: 'Red-flag symptoms detected', recommendationText: 'Seek immediate medical care.', actionRequired: 'Emergency response', notifyCaregiver: true, escalateToAdmin: true, sortOrder: 3 },
];