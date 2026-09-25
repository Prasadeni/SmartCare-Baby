// src/utils/constants.js
export const ROLES = {
  CAREGIVER: 'Caregiver',
  PREGNANT_MOTHER: 'PregnantMother',
  ADMIN: 'Admin',
};

export const RISK_LEVELS = {
  GREEN: 'Green',
  YELLOW: 'Yellow',
  RED: 'Red',
};

export const MCHAT_RISK = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
};

export const SYMPTOM_CATEGORIES = [
  'General & Behavioral',
  'Respiratory',
  'Gastrointestinal',
  'Neurological',
  'Fever & Infection',
];

export const MILESTONE_AREAS = [
  'Gross Motor',
  'Fine Motor',
  'Language',
  'Cognitive',
  'Social',
  'Self-Help',
  'Hearing/Vision',
];

export const GENDERS = ['male', 'female', 'other'];

export const BLOOD_GROUPS = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown',
];

export const STORAGE_KEYS = {
  TOKEN: 'smartcare_token',
  USER: 'smartcare_user',
};