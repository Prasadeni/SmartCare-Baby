/**
 * Seed Milestones and Vaccinations
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const MilestoneConfig = require('../models/MilestoneConfig');
const VaccinationSchedule = require('../models/VaccinationSchedule');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smartCare_baby';

const milestones = [
  { area: 'Gross Motor', description: 'Rolls over in both directions', expected_age_months: 6, is_critical: false },
  { area: 'Gross Motor', description: 'Sits without support', expected_age_months: 6, is_critical: true },
  { area: 'Fine Motor', description: 'Reaches for toys with both hands', expected_age_months: 6, is_critical: false },
  { area: 'Language', description: 'Babbles consonant sounds (ba-ba, da-da)', expected_age_months: 6, is_critical: true },
  { area: 'Cognitive', description: 'Looks at self in mirror', expected_age_months: 6, is_critical: false },
  { area: 'Social', description: 'Smiles at familiar faces', expected_age_months: 6, is_critical: false },
  { area: 'Self-Help', description: 'Brings objects to mouth', expected_age_months: 6, is_critical: false },
  { area: 'Hearing/Vision', description: 'Turns head toward sounds', expected_age_months: 6, is_critical: false },
  { area: 'Gross Motor', description: 'Stands with support', expected_age_months: 9, is_critical: false },
  { area: 'Language', description: 'Says mama/dada (non-specific)', expected_age_months: 9, is_critical: false },
  { area: 'Gross Motor', description: 'Walks holding onto furniture', expected_age_months: 12, is_critical: false },
  { area: 'Language', description: 'Says first word', expected_age_months: 12, is_critical: true },
];

const vaccines = [
  // Birth
  { vaccine_name: 'BCG', due_age_months: 0, dose_number: 1, prevents_diseases: 'Tuberculosis' },
  { vaccine_name: 'HepB', due_age_months: 0, dose_number: 1, prevents_diseases: 'Hepatitis B' },

  // 2 Months
  { vaccine_name: 'DTaP', due_age_months: 2, dose_number: 1, prevents_diseases: 'Diphtheria, Tetanus, Pertussis' },
  { vaccine_name: 'RV', due_age_months: 2, dose_number: 1, prevents_diseases: 'Rotavirus' },
  { vaccine_name: 'Hib', due_age_months: 2, dose_number: 1, prevents_diseases: 'Haemophilus influenzae type b' },
  { vaccine_name: 'PCV13', due_age_months: 2, dose_number: 1, prevents_diseases: 'Pneumococcal' },

  // 4 Months
  { vaccine_name: 'DTaP', due_age_months: 4, dose_number: 2, prevents_diseases: 'Diphtheria, Tetanus, Pertussis' },
  { vaccine_name: 'RV', due_age_months: 4, dose_number: 2, prevents_diseases: 'Rotavirus' },
  { vaccine_name: 'Hib', due_age_months: 4, dose_number: 2, prevents_diseases: 'Hib' },
  { vaccine_name: 'PCV13', due_age_months: 4, dose_number: 2, prevents_diseases: 'Pneumococcal' },

  // 6 Months
  { vaccine_name: 'DTaP', due_age_months: 6, dose_number: 3, prevents_diseases: 'Diphtheria, Tetanus, Pertussis' },
  { vaccine_name: 'PCV13', due_age_months: 6, dose_number: 3, prevents_diseases: 'Pneumococcal' },
  { vaccine_name: 'Flu', due_age_months: 6, dose_number: 1, prevents_diseases: 'Influenza' },

  // 12 Months
  { vaccine_name: 'MMR', due_age_months: 12, dose_number: 1, prevents_diseases: 'Measles, Mumps, Rubella' },
  { vaccine_name: 'Varicella', due_age_months: 12, dose_number: 1, prevents_diseases: 'Chickenpox' },
  { vaccine_name: 'PCV13', due_age_months: 12, dose_number: 4, prevents_diseases: 'Pneumococcal' },

  // 18 Months
  { vaccine_name: 'DTaP', due_age_months: 18, dose_number: 4, prevents_diseases: 'Diphtheria, Tetanus, Pertussis' },
  { vaccine_name: 'HepA', due_age_months: 18, dose_number: 1, prevents_diseases: 'Hepatitis A' },
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('[Seed] Connected to MongoDB');

    await MilestoneConfig.deleteMany({});
    await VaccinationSchedule.deleteMany({});

    await MilestoneConfig.insertMany(milestones);
    await VaccinationSchedule.insertMany(vaccines);

    console.log(`[Seed] Inserted ${milestones.length} milestones and ${vaccines.length} vaccines.`);
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]:', err);
    process.exit(1);
  }
};

seedDB();