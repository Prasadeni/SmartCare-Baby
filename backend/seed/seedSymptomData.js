/**
 * Seed Symptom Data - Configs, Risk Thresholds, Specialty Mappings
 * Matches the SmartCare Baby Symptom Check UI
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const SymptomConfig = require('../models/SymptomConfig');
const RiskThreshold = require('../models/RiskThreshold');
const SpecialtyMapping = require('../models/SpecialtyMapping');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smartCare_baby';

const symptoms = [
  // ================= FEEDING =================
  { category: 'Feeding', symptom_text: 'Reduced appetite', icon: 'no-meals', weight: 3, is_red_flag: false },
  { category: 'Feeding', symptom_text: 'Spitting up more', icon: 'water-drop', weight: 2, is_red_flag: false },
  { category: 'Feeding', symptom_text: 'Refusing to feed', icon: 'close-circle', weight: 4, is_red_flag: true },
  { category: 'Feeding', symptom_text: 'Poor weight gain', icon: 'trending-down', weight: 3, is_red_flag: false },
  { category: 'Feeding', symptom_text: 'Vomiting after feeds', icon: 'warning', weight: 3, is_red_flag: false },

  // ================= ACTIVITY =================
  { category: 'Activity', symptom_text: 'Unusually sleepy', icon: 'moon', weight: 4, is_red_flag: true },
  { category: 'Activity', symptom_text: 'Difficulty waking up', icon: 'alarm-off', weight: 5, is_red_flag: true },
  { category: 'Activity', symptom_text: 'Less active than usual', icon: 'battery-low', weight: 3, is_red_flag: false },
  { category: 'Activity', symptom_text: 'No urine for over 6 hours', icon: 'no-water', weight: 5, is_red_flag: true },
  { category: 'Activity', symptom_text: 'Difficulty breathing', icon: 'lungs', weight: 5, is_red_flag: true },

  // ================= PHYSICAL =================
  { category: 'Physical', symptom_text: 'Fever above 38°C', icon: 'thermometer', weight: 3, is_red_flag: false },
  { category: 'Physical', symptom_text: 'Fever above 39°C', icon: 'thermometer-hot', weight: 4, is_red_flag: false },
  { category: 'Physical', symptom_text: 'Rash on body', icon: 'rash', weight: 3, is_red_flag: false },
  { category: 'Physical', symptom_text: 'Persistent cough', icon: 'cough', weight: 2, is_red_flag: false },
  { category: 'Physical', symptom_text: 'Runny nose', icon: 'nose', weight: 1, is_red_flag: false },
  { category: 'Physical', symptom_text: 'Ear discharge', icon: 'ear', weight: 3, is_red_flag: false },
  { category: 'Physical', symptom_text: 'Diarrhea (3+ times/day)', icon: 'stomach', weight: 3, is_red_flag: false },
  { category: 'Physical', symptom_text: 'Blood in stool', icon: 'blood-drop', weight: 5, is_red_flag: true },
  { category: 'Physical', symptom_text: 'Blue lips or face', icon: 'alert-octagon', weight: 5, is_red_flag: true },
  { category: 'Physical', symptom_text: 'Seizure or convulsion', icon: 'flash', weight: 5, is_red_flag: true },

  // ================= MOOD =================
  { category: 'Mood', symptom_text: 'Excessive crying', icon: 'cry', weight: 3, is_red_flag: false },
  { category: 'Mood', symptom_text: 'Fussy or irritable', icon: 'emoticon-sad', weight: 2, is_red_flag: false },
  { category: 'Mood', symptom_text: 'Inconsolable crying (2+ hours)', icon: 'cry-alert', weight: 4, is_red_flag: false },
  { category: 'Mood', symptom_text: 'Not smiling or interacting', icon: 'emoticon-neutral', weight: 3, is_red_flag: false },
  { category: 'Mood', symptom_text: 'Lethargy or unusual sleepiness', icon: 'sleep', weight: 5, is_red_flag: true },
];

const thresholds = [
  { assessment_type: 'Symptom', min_score: 0, max_score: 3, risk_level: 'Green', recommendation_text: 'Monitor at home. Symptoms appear mild. Watch for changes over 24 hours.', priority: 1 },
  { assessment_type: 'Symptom', min_score: 4, max_score: 8, risk_level: 'Yellow', recommendation_text: 'Consult a doctor within 24 hours. Symptoms require medical evaluation.', priority: 2 },
  { assessment_type: 'Symptom', min_score: 9, max_score: 999, risk_level: 'Red', recommendation_text: 'Seek emergency medical care immediately. Symptoms indicate serious risk.', priority: 3 },
];

const mappings = [
  { trigger_condition: 'Feeding', recommended_specialty: 'Pediatric Gastroenterologist', description: 'Feeding and digestion concerns', priority: 1 },
  { trigger_condition: 'Activity', recommended_specialty: 'Pediatrician', description: 'General activity and energy concerns', priority: 2 },
  { trigger_condition: 'Physical', recommended_specialty: 'Pediatrician', description: 'Physical symptoms evaluation', priority: 3 },
  { trigger_condition: 'Mood', recommended_specialty: 'Developmental Pediatrician', description: 'Behavioral and emotional concerns', priority: 4 },
  { trigger_condition: 'Motor delay', recommended_specialty: 'Pediatric Neurologist', description: 'Motor skill development', priority: 1 },
  { trigger_condition: 'Language delay', recommended_specialty: 'Speech Therapist', description: 'Speech and language', priority: 1 },
  { trigger_condition: 'Autism risk', recommended_specialty: 'Developmental Pediatrician', description: 'Autism spectrum', priority: 1 },
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('[Seed] Connected to MongoDB');

    await SymptomConfig.deleteMany({});
    await RiskThreshold.deleteMany({ assessment_type: 'Symptom' });
    await SpecialtyMapping.deleteMany({});

    await SymptomConfig.insertMany(symptoms);
    await RiskThreshold.insertMany(thresholds);
    await SpecialtyMapping.insertMany(mappings);

    console.log(`[Seed] Inserted ${symptoms.length} symptoms, ${thresholds.length} thresholds, ${mappings.length} mappings.`);
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]:', err);
    process.exit(1);
  }
};

seedDB();