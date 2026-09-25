export const vaccinationSchedules = [
  { vaccineName: 'BCG', dueAgeMonths: 0, doseNumber: 1, description: 'Tuberculosis protection', preventsDiseases: 'Tuberculosis', mandatory: true },
  { vaccineName: 'Hepatitis B (1)', dueAgeMonths: 0, doseNumber: 1, description: 'Hepatitis B dose 1', preventsDiseases: 'Hepatitis B', mandatory: true },
  { vaccineName: 'OPV (1)', dueAgeMonths: 2, doseNumber: 1, description: 'Oral polio dose 1', preventsDiseases: 'Polio', mandatory: true },
  { vaccineName: 'DTaP (1)', dueAgeMonths: 2, doseNumber: 1, description: 'Diphtheria-Tetanus-Pertussis dose 1', preventsDiseases: 'Diphtheria, Tetanus, Pertussis', mandatory: true },
  { vaccineName: 'Hepatitis B (2)', dueAgeMonths: 2, doseNumber: 2, description: 'Hepatitis B dose 2', preventsDiseases: 'Hepatitis B', mandatory: true },
  { vaccineName: 'OPV (2)', dueAgeMonths: 4, doseNumber: 2, description: 'Oral polio dose 2', preventsDiseases: 'Polio', mandatory: true },
  { vaccineName: 'DTaP (2)', dueAgeMonths: 4, doseNumber: 2, description: 'Diphtheria-Tetanus-Pertussis dose 2', preventsDiseases: 'Diphtheria, Tetanus, Pertussis', mandatory: true },
  { vaccineName: 'MMR', dueAgeMonths: 9, doseNumber: 1, description: 'Measles-Mumps-Rubella', preventsDiseases: 'Measles, Mumps, Rubella', mandatory: true },
  { vaccineName: 'Varicella', dueAgeMonths: 12, doseNumber: 1, description: 'Chickenpox vaccine', preventsDiseases: 'Chickenpox', mandatory: false },
  { vaccineName: 'Hepatitis A', dueAgeMonths: 12, doseNumber: 1, description: 'Hepatitis A dose 1', preventsDiseases: 'Hepatitis A', mandatory: true },
];

// Records reference vaccine by name + baby by name
export const vaccinationRecords = [
  { babyName: 'Leo', vaccineName: 'BCG', administeredDate: '2024-03-13', administeredBy: 'Dr. Silva', batchNumber: 'BCG-001' },
  { babyName: 'Leo', vaccineName: 'Hepatitis B (1)', administeredDate: '2024-03-13', administeredBy: 'Dr. Silva', batchNumber: 'HB-001' },
  { babyName: 'Leo', vaccineName: 'OPV (1)', administeredDate: '2024-05-15', administeredBy: 'Dr. Silva', batchNumber: 'OPV-002' },
  { babyName: 'Leo', vaccineName: 'DTaP (1)', administeredDate: '2024-05-15', administeredBy: 'Dr. Silva', batchNumber: 'DT-002' },
];
