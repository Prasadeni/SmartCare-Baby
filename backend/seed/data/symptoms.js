export const symptoms = [
  { category: 'Fever & Infection', symptomText: 'Fever above 38°C (100.4°F)', weight: 5, isRedFlag: false, guidanceText: 'Monitor temperature every 4 hours.' },
  { category: 'General & Behavioral', symptomText: 'Unusually lethargic or unresponsive', weight: 8, isRedFlag: true, guidanceText: 'Seek emergency care immediately.' },
  { category: 'General & Behavioral', symptomText: 'No urine for over 6 hours', weight: 8, isRedFlag: true, guidanceText: 'Sign of dehydration — urgent care needed.' },
  { category: 'Gastrointestinal', symptomText: 'Persistent diarrhea', weight: 3, isRedFlag: false, guidanceText: 'Watch for dehydration.' },
  { category: 'Gastrointestinal', symptomText: 'Frequent vomiting', weight: 4, isRedFlag: false, guidanceText: 'Keep hydrated with small sips.' },
  { category: 'Respiratory', symptomText: 'Persistent cough', weight: 2, isRedFlag: false, guidanceText: 'Monitor breathing.' },
  { category: 'Respiratory', symptomText: 'Fast or labored breathing', weight: 7, isRedFlag: true, guidanceText: 'Emergency — seek help now.' },
  { category: 'General & Behavioral', symptomText: 'New rash or skin change', weight: 2, isRedFlag: false, guidanceText: 'Take a photo and monitor spread.' },
  { category: 'General & Behavioral', symptomText: 'Extreme fussiness or irritability', weight: 3, isRedFlag: false, guidanceText: 'Check for other symptoms.' },
  { category: 'Neurological', symptomText: 'Seizure or convulsion', weight: 10, isRedFlag: true, guidanceText: 'Call emergency services immediately.' },
];
