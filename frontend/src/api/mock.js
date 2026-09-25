// src/api/mock.js
// ────────────────────────────────────────────────────────────────
// In-memory mock backend. Delete this file when real API is live.
// ────────────────────────────────────────────────────────────────

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

function uid(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function nowIso() {
  return new Date().toISOString();
}

// ────────────────────────────────────────────────────────────────
// SEED DATA
// ────────────────────────────────────────────────────────────────
const DB = {
  users: [
    { id: 'u_mother_1', email: 'mother@test.com', password: 'password123', fullName: 'Chamodi Perera', role: 'PregnantMother', phone: '+94 77 123 4567', city: 'Colombo', country: 'Sri Lanka', createdAt: nowIso() },
    { id: 'u_caregiver_1', email: 'caregiver@test.com', password: 'password123', fullName: 'Sarah Fernando', role: 'Caregiver', phone: '+94 71 555 8899', city: 'Kandy', country: 'Sri Lanka', createdAt: nowIso() },
    { id: 'u_admin_1', email: 'admin@test.com', password: 'password123', fullName: 'Dr. Sarah Jenkins', role: 'Admin', phone: null, city: 'Colombo', country: 'Sri Lanka', createdAt: nowIso() },
  ],

  babies: [
    { id: 'b_leo', userId: 'u_mother_1', name: 'Leo', dob: '2024-03-12', gender: 'male', birthWeightKg: 3.2, birthHeightCm: 50.0, bloodGroup: 'O+', createdAt: nowIso() },
    { id: 'b_mia', userId: 'u_caregiver_1', name: 'Mia', dob: '2023-09-01', gender: 'female', birthWeightKg: 2.9, birthHeightCm: 48.5, bloodGroup: 'A+', createdAt: nowIso() },
    { id: 'b_kai', userId: 'u_caregiver_1', name: 'Kai', dob: '2022-05-20', gender: 'male', birthWeightKg: 3.5, birthHeightCm: 51.2, bloodGroup: 'B+', createdAt: nowIso() },
  ],

  pregnancies: [
    { id: 'p_mother_1', userId: 'u_mother_1', expectedDueDate: '2025-06-15', currentGestationalAgeWeeks: 22, isCurrentPregnancy: true, lmpDate: '2024-09-08', createdAt: nowIso() },
  ],

  growthRecords: [
    { id: 'g_leo_1', babyId: 'b_leo', recordedAt: '2024-03-12', babyAgeMonths: 0, weightKg: 3.2, heightCm: 50.0, headCircumferenceCm: 34.5, weightPercentile: 50, heightPercentile: 50, headPercentile: 50 },
    { id: 'g_leo_2', babyId: 'b_leo', recordedAt: '2024-06-12', babyAgeMonths: 3, weightKg: 5.8, heightCm: 60.0, headCircumferenceCm: 40.0, weightPercentile: 55, heightPercentile: 62, headPercentile: 50 },
    { id: 'g_leo_3', babyId: 'b_leo', recordedAt: '2024-09-12', babyAgeMonths: 6, weightKg: 7.8, heightCm: 66.5, headCircumferenceCm: 43.0, weightPercentile: 60, heightPercentile: 65, headPercentile: 55 },
    { id: 'g_mia_1', babyId: 'b_mia', recordedAt: '2023-09-01', babyAgeMonths: 0, weightKg: 2.9, heightCm: 48.5, headCircumferenceCm: 33.8, weightPercentile: 30, heightPercentile: 35, headPercentile: 40 },
    { id: 'g_mia_2', babyId: 'b_mia', recordedAt: '2024-03-01', babyAgeMonths: 6, weightKg: 7.4, heightCm: 65.0, headCircumferenceCm: 42.5, weightPercentile: 45, heightPercentile: 50, headPercentile: 50 },
    { id: 'g_kai_1', babyId: 'b_kai', recordedAt: '2022-05-20', babyAgeMonths: 0, weightKg: 3.5, heightCm: 51.2, headCircumferenceCm: 35.0, weightPercentile: 60, heightPercentile: 55, headPercentile: 60 },
    { id: 'g_kai_2', babyId: 'b_kai', recordedAt: '2023-05-20', babyAgeMonths: 12, weightKg: 10.2, heightCm: 76.0, headCircumferenceCm: 46.5, weightPercentile: 65, heightPercentile: 60, headPercentile: 60 },
  ],

  vaccinationSchedules: [
    { id: 'vs_bcg', vaccineName: 'BCG', dueAgeMonths: 0, doseNumber: 1, description: 'Tuberculosis protection', preventsDiseases: 'Tuberculosis', mandatory: true },
    { id: 'vs_hepb_1', vaccineName: 'Hepatitis B (1)', dueAgeMonths: 0, doseNumber: 1, description: 'Hepatitis B dose 1', preventsDiseases: 'Hepatitis B', mandatory: true },
    { id: 'vs_opv_1', vaccineName: 'OPV (1)', dueAgeMonths: 2, doseNumber: 1, description: 'Oral polio dose 1', preventsDiseases: 'Polio', mandatory: true },
    { id: 'vs_dtap_1', vaccineName: 'DTaP (1)', dueAgeMonths: 2, doseNumber: 1, description: 'Diphtheria-Tetanus-Pertussis dose 1', preventsDiseases: 'Diphtheria, Tetanus, Pertussis', mandatory: true },
    { id: 'vs_hepb_2', vaccineName: 'Hepatitis B (2)', dueAgeMonths: 2, doseNumber: 2, description: 'Hepatitis B dose 2', preventsDiseases: 'Hepatitis B', mandatory: true },
    { id: 'vs_opv_2', vaccineName: 'OPV (2)', dueAgeMonths: 4, doseNumber: 2, description: 'Oral polio dose 2', preventsDiseases: 'Polio', mandatory: true },
    { id: 'vs_dtap_2', vaccineName: 'DTaP (2)', dueAgeMonths: 4, doseNumber: 2, description: 'Diphtheria-Tetanus-Pertussis dose 2', preventsDiseases: 'Diphtheria, Tetanus, Pertussis', mandatory: true },
    { id: 'vs_mmr', vaccineName: 'MMR', dueAgeMonths: 9, doseNumber: 1, description: 'Measles-Mumps-Rubella', preventsDiseases: 'Measles, Mumps, Rubella', mandatory: true },
    { id: 'vs_varicella', vaccineName: 'Varicella', dueAgeMonths: 12, doseNumber: 1, description: 'Chickenpox vaccine', preventsDiseases: 'Chickenpox', mandatory: false },
    { id: 'vs_hepa', vaccineName: 'Hepatitis A', dueAgeMonths: 12, doseNumber: 1, description: 'Hepatitis A dose 1', preventsDiseases: 'Hepatitis A', mandatory: true },
  ],

  vaccinationRecords: [
    { id: 'vr_leo_1', babyId: 'b_leo', vaccineScheduleId: 'vs_bcg', administeredDate: '2024-03-13', administeredBy: 'Dr. Silva', batchNumber: 'BCG-001', notes: null },
    { id: 'vr_leo_2', babyId: 'b_leo', vaccineScheduleId: 'vs_hepb_1', administeredDate: '2024-03-13', administeredBy: 'Dr. Silva', batchNumber: 'HB-001', notes: null },
    { id: 'vr_leo_3', babyId: 'b_leo', vaccineScheduleId: 'vs_opv_1', administeredDate: '2024-05-15', administeredBy: 'Dr. Silva', batchNumber: 'OPV-002', notes: null },
    { id: 'vr_leo_4', babyId: 'b_leo', vaccineScheduleId: 'vs_dtap_1', administeredDate: '2024-05-15', administeredBy: 'Dr. Silva', batchNumber: 'DT-002', notes: null },
  ],

  chatSessions: [],
  chatMessages: {},
};

// ────────────────────────────────────────────────────────────────
// STATIC CONFIG DATA
// ────────────────────────────────────────────────────────────────
const SYMPTOM_CONFIGS = [
  { id: 's_fever', category: 'Fever & Infection', symptomText: 'Fever above 38°C (100.4°F)', weight: 5, isRedFlag: false, guidanceText: 'Monitor temperature every 4 hours.' },
  { id: 's_lethargy', category: 'General & Behavioral', symptomText: 'Unusually lethargic or unresponsive', weight: 8, isRedFlag: true, guidanceText: 'Seek emergency care immediately.' },
  { id: 's_no_urine', category: 'General & Behavioral', symptomText: 'No urine for over 6 hours', weight: 8, isRedFlag: true, guidanceText: 'Sign of dehydration — urgent care needed.' },
  { id: 's_diarrhea', category: 'Gastrointestinal', symptomText: 'Persistent diarrhea', weight: 3, isRedFlag: false, guidanceText: 'Watch for dehydration.' },
  { id: 's_vomiting', category: 'Gastrointestinal', symptomText: 'Frequent vomiting', weight: 4, isRedFlag: false, guidanceText: 'Keep hydrated with small sips.' },
  { id: 's_cough', category: 'Respiratory', symptomText: 'Persistent cough', weight: 2, isRedFlag: false, guidanceText: 'Monitor breathing.' },
  { id: 's_breath_fast', category: 'Respiratory', symptomText: 'Fast or labored breathing', weight: 7, isRedFlag: true, guidanceText: 'Emergency — seek help now.' },
  { id: 's_rash', category: 'General & Behavioral', symptomText: 'New rash or skin change', weight: 2, isRedFlag: false, guidanceText: 'Take a photo and monitor spread.' },
  { id: 's_irritable', category: 'General & Behavioral', symptomText: 'Extreme fussiness or irritability', weight: 3, isRedFlag: false, guidanceText: 'Check for other symptoms.' },
  { id: 's_seizure', category: 'Neurological', symptomText: 'Seizure or convulsion', weight: 10, isRedFlag: true, guidanceText: 'Call emergency services immediately.' },
];

const MILESTONE_CONFIGS = [
  { id: 'm1', area: 'Gross Motor', description: 'Sits without support', expectedAgeMonths: 8, isCritical: false },
  { id: 'm2', area: 'Gross Motor', description: 'Pulls to stand', expectedAgeMonths: 10, isCritical: false },
  { id: 'm3', area: 'Gross Motor', description: 'Crawls on hands and knees', expectedAgeMonths: 9, isCritical: false },
  { id: 'm4', area: 'Fine Motor', description: 'Grasps small objects with thumb and finger', expectedAgeMonths: 9, isCritical: false },
  { id: 'm5', area: 'Fine Motor', description: 'Transfers objects between hands', expectedAgeMonths: 7, isCritical: false },
  { id: 'm6', area: 'Language', description: 'Babbles with varied intonation', expectedAgeMonths: 6, isCritical: false },
  { id: 'm7', area: 'Language', description: 'Responds to own name', expectedAgeMonths: 9, isCritical: false },
  { id: 'm8', area: 'Language', description: 'Says "mama" or "dada"', expectedAgeMonths: 12, isCritical: false },
  { id: 'm9', area: 'Cognitive', description: 'Looks for hidden objects', expectedAgeMonths: 9, isCritical: false },
  { id: 'm10', area: 'Cognitive', description: 'Explores objects by shaking, banging', expectedAgeMonths: 8, isCritical: false },
  { id: 'm11', area: 'Social', description: 'Smiles back at familiar faces', expectedAgeMonths: 3, isCritical: false },
  { id: 'm12', area: 'Social', description: 'Shows stranger anxiety', expectedAgeMonths: 9, isCritical: false },
  { id: 'm13', area: 'Self-Help', description: 'Feeds self with fingers', expectedAgeMonths: 9, isCritical: false },
  { id: 'm14', area: 'Self-Help', description: 'Holds own bottle', expectedAgeMonths: 8, isCritical: false },
  { id: 'm15', area: 'Hearing/Vision', description: 'Turns to look at sounds', expectedAgeMonths: 4, isCritical: true },
  { id: 'm16', area: 'Hearing/Vision', description: 'Follows moving objects with eyes', expectedAgeMonths: 3, isCritical: true },
];

const MCHAT_QUESTIONS = [
  { number: 1, text: 'Does your child enjoy being swung, bounced on your knee, etc.?', isReverseScored: false },
  { number: 2, text: 'Does your child take an interest in other children?', isReverseScored: true },
  { number: 3, text: 'Does your child like climbing on things?', isReverseScored: false },
  { number: 4, text: 'Does your child enjoy playing peek-a-boo or hide-and-seek?', isReverseScored: false },
  { number: 5, text: 'Does your child ever pretend, for example, to talk on the phone?', isReverseScored: true },
  { number: 6, text: 'Does your child ever use their index finger to point, to ask for something?', isReverseScored: false },
  { number: 7, text: 'Does your child ever use their index finger to point, to show interest?', isReverseScored: false },
  { number: 8, text: 'Does your child ever bring objects to you to show you something?', isReverseScored: false },
  { number: 9, text: 'Does your child look you in the eye for more than a second or two?', isReverseScored: false },
  { number: 10, text: 'Does your child respond to their name when you call?', isReverseScored: false },
  { number: 11, text: 'When you smile at your child, do they smile back?', isReverseScored: false },
  { number: 12, text: 'Does your child get upset by everyday noises?', isReverseScored: true },
  { number: 13, text: 'Does your child walk?', isReverseScored: false },
  { number: 14, text: 'Does your child look at you when something is new or unfamiliar?', isReverseScored: false },
  { number: 15, text: 'Does your child imitate you, e.g., wave bye-bye?', isReverseScored: false },
  { number: 16, text: 'Does your child look at things you are looking at?', isReverseScored: false },
  { number: 17, text: 'Does your child try to get you to notice them?', isReverseScored: false },
  { number: 18, text: 'Does your child understand simple instructions without gestures?', isReverseScored: false },
  { number: 19, text: 'Does your child look at your face to check your reaction?', isReverseScored: false },
  { number: 20, text: 'Does your child like movement activities?', isReverseScored: false },
];

// ────────────────────────────────────────────────────────────────
// SPECIALISTS + EDUCATION STATIC DATA
// ────────────────────────────────────────────────────────────────
const SPECIALISTS = [
  {
    id: 'sp_emily',
    name: 'Dr. Emily Chen',
    specialty: 'Pediatric Gastroenterologist',
    phone: '+94 11 234 5678',
    email: 'emily.chen@sunrise.lk',
    hospitalAffiliation: 'Sunrise Medical Center',
    city: 'Colombo',
    country: 'Sri Lanka',
    bio: 'Senior pediatric gastroenterologist with 15+ years of experience in child nutrition and digestive health.',
    rating: 4.9,
    reviews: 120,
    fee: 'LKR 3,500',
    availableDays: ['Mon', 'Wed', 'Fri'],
    image: null,
  },
  {
    id: 'sp_mark',
    name: 'Dr. Mark Lee',
    specialty: 'General Pediatrics',
    phone: '+94 81 234 5678',
    email: 'mark.lee@oaktree.lk',
    hospitalAffiliation: 'Oak Tree Clinic',
    city: 'Kandy',
    country: 'Sri Lanka',
    bio: 'General pediatrician with special interest in preventive care and childhood nutrition.',
    rating: 4.8,
    reviews: 85,
    fee: 'LKR 2,500',
    availableDays: ['Tue', 'Thu', 'Sat'],
    image: null,
  },
  {
    id: 'sp_priya',
    name: 'Dr. Priya Ratnayake',
    specialty: 'Developmental Pediatrician',
    phone: '+94 11 555 7788',
    email: 'priya.r@childdev.lk',
    hospitalAffiliation: 'Lady Ridgeway Hospital',
    city: 'Colombo',
    country: 'Sri Lanka',
    bio: 'Specialist in developmental delays, autism spectrum disorder, and early intervention programs.',
    rating: 4.9,
    reviews: 200,
    fee: 'LKR 4,000',
    availableDays: ['Mon', 'Tue', 'Thu'],
    image: null,
  },
  {
    id: 'sp_kumar',
    name: 'Dr. Anil Kumar',
    specialty: 'Pediatric Pulmonologist',
    phone: '+94 11 777 9900',
    email: 'anil.k@pulmo.lk',
    hospitalAffiliation: 'National Hospital Colombo',
    city: 'Colombo',
    country: 'Sri Lanka',
    bio: 'Respiratory specialist focused on childhood asthma, recurring infections, and chronic cough.',
    rating: 4.7,
    reviews: 65,
    fee: 'LKR 3,800',
    availableDays: ['Wed', 'Fri'],
    image: null,
  },
  {
    id: 'sp_nisha',
    name: 'Dr. Nisha Fernando',
    specialty: 'Speech-Language Pathologist',
    phone: '+94 11 333 4455',
    email: 'nisha.f@speech.lk',
    hospitalAffiliation: 'Asiri Central Hospital',
    city: 'Colombo',
    country: 'Sri Lanka',
    bio: 'Specialist in early speech, language, and communication delays for children under 5.',
    rating: 4.8,
    reviews: 92,
    fee: 'LKR 3,200',
    availableDays: ['Mon', 'Wed', 'Fri', 'Sat'],
    image: null,
  },
];

const SPECIALTY_MAPPINGS = [
  { id: 'sm1', triggerCondition: 'Motor delay', recommendedSpecialty: 'Pediatric Neurologist', secondarySpecialty: 'Pediatric Physiotherapist', description: 'Delays in gross or fine motor milestones', priority: 1 },
  { id: 'sm2', triggerCondition: 'Speech delay', recommendedSpecialty: 'Speech-Language Pathologist', secondarySpecialty: 'Developmental Pediatrician', description: 'Delayed speech or language milestones', priority: 1 },
  { id: 'sm3', triggerCondition: 'Autism risk (Medium/High)', recommendedSpecialty: 'Developmental Pediatrician', secondarySpecialty: 'Child Psychologist', description: 'Elevated M-CHAT-R score', priority: 1 },
  { id: 'sm4', triggerCondition: 'Respiratory distress', recommendedSpecialty: 'Pediatric Pulmonologist', secondarySpecialty: 'Pediatrician', description: 'Persistent respiratory symptoms', priority: 2 },
  { id: 'sm5', triggerCondition: 'Gastrointestinal issues', recommendedSpecialty: 'Pediatric Gastroenterologist', secondarySpecialty: 'Pediatrician', description: 'Persistent diarrhea, vomiting', priority: 2 },
];

const EDUCATION = [
  {
    id: 'ed_1',
    title: 'Newborn Sleep Patterns: What to Expect',
    contentType: 'Article',
    body: 'Newborns sleep 14–17 hours a day, but in short stretches of 2–4 hours. Here\'s how to help them develop healthy sleep habits from day one...\n\nAround 3 months, many babies begin consolidating sleep. Watch for drowsy cues like yawning, rubbing eyes, or fussing. Put them down drowsy but awake to encourage self-soothing.\n\nIf your baby is consistently waking more than every 2 hours past 4 months, talk to your pediatrician.',
    category: 'Newborn Care',
    author: 'SmartCare Team',
    publishedDate: '2024-09-15',
    imageUrl: null,
    isActive: true,
  },
  {
    id: 'ed_2',
    title: 'Introducing Solid Foods: A Step-by-Step Guide',
    contentType: 'Guide',
    body: 'Starting solids around 6 months is a major milestone. Begin with single-ingredient purees, one at a time, spaced 3–5 days apart to watch for allergies.\n\nGood first foods: iron-fortified cereal, sweet potato, avocado, banana, and pureed peas.\n\nSigns of readiness: sitting with support, good head control, interest in food, and loss of the tongue-thrust reflex.',
    category: 'Nutrition',
    author: 'Dr. Emily Chen',
    publishedDate: '2024-09-10',
    imageUrl: null,
    isActive: true,
  },
  {
    id: 'ed_3',
    title: 'Understanding M-CHAT-R Screening Results',
    contentType: 'Article',
    body: 'The Modified Checklist for Autism in Toddlers (M-CHAT-R) is a screening tool, not a diagnosis. Scores fall into Low, Medium, or High risk categories.\n\nA high score does NOT mean your child has autism. It means further evaluation is recommended.\n\nAlways discuss results with a developmental pediatrician.',
    category: 'Development',
    author: 'Dr. Priya Ratnayake',
    publishedDate: '2024-09-05',
    imageUrl: null,
    isActive: true,
  },
  {
    id: 'ed_4',
    title: 'Baby-Proofing Your Home: A Complete Checklist',
    contentType: 'Guide',
    body: 'Once your baby starts crawling, the whole house becomes a hazard. Here\'s a room-by-room safety checklist.\n\nKitchen: Lock lower cabinets, keep sharp objects in high drawers, use stove guards.\n\nLiving room: Secure TV/furniture to walls, cover electrical outlets, remove coffee table corners.\n\nStairs: Install gates at top and bottom, keep stairs clear of toys.',
    category: 'Safety',
    author: 'SmartCare Team',
    publishedDate: '2024-08-28',
    imageUrl: null,
    isActive: true,
  },
  {
    id: 'ed_5',
    title: 'Postpartum Recovery: What\'s Normal',
    contentType: 'Article',
    body: 'The first 6 weeks after birth are the "fourth trimester." Expect bleeding for 2–6 weeks, mood swings, sore breasts, and fatigue.\n\nWhen to call your doctor: fever over 38°C, heavy bleeding (soaking a pad in 1 hour), severe headaches, chest pain, or feelings of harming yourself or the baby.',
    category: 'Maternal Health',
    author: 'Dr. Emily Chen',
    publishedDate: '2024-08-20',
    imageUrl: null,
    isActive: true,
  },
];

const BOT_REPLIES = [
  { keywords: ['sleep', 'nap', 'bedtime'], reply: 'Newborns sleep 14–17 hours a day in 2–4 hour stretches. Try putting your baby down drowsy but awake, keep the room dark and cool, and establish a consistent bedtime routine. If sleep is severely disrupted past 4 months, mention it to your pediatrician.' },
  { keywords: ['fever', 'temperature', 'hot'], reply: 'For babies under 3 months, any fever above 38°C (100.4°F) needs immediate medical attention. For older babies, monitor hydration, keep them comfortable, and call your doctor if the fever lasts more than 3 days or is above 39°C.' },
  { keywords: ['milestone', 'crawl', 'walk', 'sit'], reply: 'Every baby develops at their own pace. Most babies sit by 8 months, crawl by 9 months, and walk by 12–15 months. If you have concerns about a specific milestone, use our Milestone Tracker and consider a developmental pediatrician consult.' },
  { keywords: ['autism', 'mchat', 'm-chat'], reply: 'The M-CHAT-R is a screening tool, not a diagnosis. A high score means further evaluation is recommended — not that your child has autism. Our app can administer the full 20-question screening. Speak with a developmental pediatrician for any concerns.' },
  { keywords: ['food', 'eat', 'solid', 'feed'], reply: 'Around 6 months, look for signs of readiness: good head control, sitting with support, and interest in food. Start with single-ingredient purees like sweet potato, avocado, or iron-fortified cereal. Introduce one new food every 3–5 days to watch for allergies.' },
  { keywords: ['vaccine', 'vaccination', 'immunization'], reply: 'Vaccines protect your baby from serious diseases. Check the Vaccination Schedule page for your baby\'s personalized timeline. If you miss a dose, don\'t worry — your pediatrician can catch up.' },
  { keywords: ['pregnan', 'kick', 'contraction'], reply: 'For pregnancy tracking, use the Kick Counter to monitor fetal movements (aim for 10 kicks in 2 hours) and the Contraction Timer. If you notice fewer kicks or regular contractions before 37 weeks, contact your healthcare provider immediately.' },
];

function generateBotReply(message) {
  const lower = (message || '').toLowerCase();
  for (const { keywords, reply } of BOT_REPLIES) {
    if (keywords.some((k) => lower.includes(k))) return reply;
  }
  return "I'm still learning! For specific medical concerns, please consult a pediatric specialist. You can also browse our Education articles for common questions.";
}

// ────────────────────────────────────────────────────────────────
// TOKEN + AUTH HELPERS
// ────────────────────────────────────────────────────────────────
const TOKENS = new Map();

function issueToken(userId) {
  const token = `mock_jwt_${userId}_${Date.now()}`;
  TOKENS.set(token, userId);
  return token;
}

function userFromAuthHeader(headers = {}) {
  const auth = headers.Authorization || headers.authorization;
  if (!auth) return null;
  const token = auth.replace('Bearer ', '');
  const userId = TOKENS.get(token);
  if (!userId) return null;
  return DB.users.find((u) => u.id === userId) || null;
}

function publicUser(user) {
  if (!user) return null;
  const { password, ...rest } = user;
  const babies = DB.babies.filter((b) => b.userId === user.id);
  const hasActivePregnancy = DB.pregnancies.some(
    (p) => p.userId === user.id && p.isCurrentPregnancy
  );
  return { ...rest, hasBabies: babies.length > 0, hasActivePregnancy };
}

// ────────────────────────────────────────────────────────────────
// UTILITIES
// ────────────────────────────────────────────────────────────────
function routeMatch(method, url, pattern) {
  const m = method.toUpperCase();
  const parts = pattern.split('/').filter(Boolean);
  const urlParts = url.split('?')[0].split('/').filter(Boolean);
  if (parts.length !== urlParts.length) return null;
  const params = {};
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].startsWith(':')) params[parts[i].slice(1)] = urlParts[i];
    else if (parts[i] !== urlParts[i]) return null;
  }
  return { params };
}

function jsonResponse(config, data, status = 200) {
  return Promise.resolve({ data, status, statusText: 'OK', headers: {}, config, request: {} });
}

function errorResponse(config, status, message) {
  const err = new Error(message);
  err.response = { data: { message }, status, statusText: 'Error', headers: {}, config };
  err.config = config;
  return Promise.reject(err);
}

// ────────────────────────────────────────────────────────────────
// MAIN ADAPTER
// ────────────────────────────────────────────────────────────────
export async function mockAdapter(config) {
  await delay(300);

  const method = (config.method || 'get').toUpperCase();
  const url = config.url || '';
  const body = config.data ? JSON.parse(config.data) : {};
  const headers = config.headers || {};

  // ── AUTH ─────────────────────────────────────────────────────
  if (method === 'POST' && url === '/auth/register') {
    const { email, password, fullName, role, phone, city, country } = body;
    if (!email || !password || !fullName || !role) return errorResponse(config, 400, 'Missing required fields');
    if (DB.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) return errorResponse(config, 409, 'Email already registered');
    const user = { id: uid('u'), email, password, fullName, role, phone: phone || null, city: city || 'Colombo', country: country || 'Sri Lanka', createdAt: nowIso() };
    DB.users.push(user);
    const token = issueToken(user.id);
    return jsonResponse(config, { token, user: publicUser(user) }, 201);
  }

  if (method === 'POST' && url === '/auth/login') {
    const { email, password } = body;
    const user = DB.users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase());
    if (!user || user.password !== password) return errorResponse(config, 401, 'Invalid email or password');
    const token = issueToken(user.id);
    return jsonResponse(config, { token, user: publicUser(user) });
  }

  if (method === 'GET' && url === '/auth/me') {
    const user = userFromAuthHeader(headers);
    if (!user) return errorResponse(config, 401, 'Unauthorized');
    return jsonResponse(config, { user: publicUser(user) });
  }

  if (method === 'POST' && url === '/auth/logout') {
    const auth = headers.Authorization || headers.authorization;
    if (auth) TOKENS.delete(auth.replace('Bearer ', ''));
    return jsonResponse(config, { success: true });
  }

  if (method === 'POST' && url === '/auth/forgot-password') {
    return jsonResponse(config, { success: true });
  }

  // ── USERS ────────────────────────────────────────────────────
  if (method === 'GET' && url === '/users/me') {
    const user = userFromAuthHeader(headers);
    if (!user) return errorResponse(config, 401, 'Unauthorized');
    return jsonResponse(config, { user: publicUser(user) });
  }

  if (method === 'PUT' && url === '/users/me') {
    const user = userFromAuthHeader(headers);
    if (!user) return errorResponse(config, 401, 'Unauthorized');
    Object.assign(user, { fullName: body.fullName ?? user.fullName, phone: body.phone ?? user.phone, city: body.city ?? user.city, country: body.country ?? user.country });
    return jsonResponse(config, { user: publicUser(user) });
  }

  // ── BABIES ───────────────────────────────────────────────────
  if (method === 'GET' && url === '/babies') {
    const user = userFromAuthHeader(headers);
    if (!user) return errorResponse(config, 401, 'Unauthorized');
    const babies = DB.babies.filter((b) => b.userId === user.id);
    return jsonResponse(config, { babies });
  }

  if (method === 'POST' && url === '/babies') {
    const user = userFromAuthHeader(headers);
    if (!user) return errorResponse(config, 401, 'Unauthorized');
    const baby = {
      id: uid('b'), userId: user.id, name: body.name, dob: body.dob,
      gender: body.gender || 'other',
      birthWeightKg: Number(body.birthWeightKg) || 0,
      birthHeightCm: Number(body.birthHeightCm) || 0,
      bloodGroup: body.bloodGroup || 'Unknown',
      createdAt: nowIso(),
    };
    DB.babies.push(baby);
    return jsonResponse(config, { baby }, 201);
  }

  {
    const m = routeMatch(method, url, '/babies/:id');
    if (m) {
      const user = userFromAuthHeader(headers);
      if (!user) return errorResponse(config, 401, 'Unauthorized');
      const baby = DB.babies.find((b) => b.id === m.params.id);
      if (!baby) return errorResponse(config, 404, 'Baby not found');
      if (baby.userId !== user.id && user.role !== 'Admin') return errorResponse(config, 403, 'Forbidden');
      if (method === 'GET') return jsonResponse(config, { baby });
      if (method === 'PUT') {
        Object.assign(baby, {
          name: body.name ?? baby.name, dob: body.dob ?? baby.dob,
          gender: body.gender ?? baby.gender,
          birthWeightKg: body.birthWeightKg != null ? Number(body.birthWeightKg) : baby.birthWeightKg,
          birthHeightCm: body.birthHeightCm != null ? Number(body.birthHeightCm) : baby.birthHeightCm,
          bloodGroup: body.bloodGroup ?? baby.bloodGroup,
        });
        return jsonResponse(config, { baby });
      }
      if (method === 'DELETE') {
        DB.babies = DB.babies.filter((b) => b.id !== baby.id);
        return jsonResponse(config, { success: true });
      }
    }
  }

  // ── PREGNANCY ────────────────────────────────────────────────
  if (method === 'GET' && url === '/pregnancy/tracker') {
    const user = userFromAuthHeader(headers);
    if (!user) return errorResponse(config, 401, 'Unauthorized');
    const pregnancy = DB.pregnancies.find((p) => p.userId === user.id && p.isCurrentPregnancy) || null;
    return jsonResponse(config, { pregnancy });
  }

  if (method === 'POST' && url === '/pregnancy/tracker') {
    const user = userFromAuthHeader(headers);
    if (!user) return errorResponse(config, 401, 'Unauthorized');
    DB.pregnancies = DB.pregnancies.filter((p) => !(p.userId === user.id && p.isCurrentPregnancy));
    const pregnancy = {
      id: uid('p'), userId: user.id,
      expectedDueDate: body.expectedDueDate,
      lmpDate: body.lmpDate || null,
      currentGestationalAgeWeeks: body.currentGestationalAgeWeeks || 0,
      isCurrentPregnancy: true, createdAt: nowIso(),
    };
    DB.pregnancies.push(pregnancy);
    return jsonResponse(config, { pregnancy }, 201);
  }

  // ── PREGNANCY SUB-LOGS ───────────────────────────────────────
  if (method === 'GET' && url === '/pregnancy/kicks') {
    const user = userFromAuthHeader(headers);
    if (!user) return errorResponse(config, 401, 'Unauthorized');
    const preg = DB.pregnancies.find((p) => p.userId === user.id && p.isCurrentPregnancy);
    return jsonResponse(config, { kicks: preg?.kicks || [] });
  }

  if (method === 'POST' && url === '/pregnancy/kicks') {
    const user = userFromAuthHeader(headers);
    if (!user) return errorResponse(config, 401, 'Unauthorized');
    const preg = DB.pregnancies.find((p) => p.userId === user.id && p.isCurrentPregnancy);
    if (!preg) return errorResponse(config, 404, 'No active pregnancy');
    const kick = { id: uid('k'), pregnancyTrackerId: preg.id, timestamp: nowIso(), durationMinutes: Number(body.durationMinutes) || 0, count: Number(body.count) || 0, alertTriggered: (Number(body.count) || 0) < 10 && (Number(body.durationMinutes) || 0) >= 120, notes: body.notes || null };
    preg.kicks = preg.kicks || [];
    preg.kicks.unshift(kick);
    return jsonResponse(config, { kick }, 201);
  }

  if (method === 'GET' && url === '/pregnancy/contractions') {
    const user = userFromAuthHeader(headers);
    if (!user) return errorResponse(config, 401, 'Unauthorized');
    const preg = DB.pregnancies.find((p) => p.userId === user.id && p.isCurrentPregnancy);
    return jsonResponse(config, { contractions: preg?.contractions || [] });
  }

  if (method === 'POST' && url === '/pregnancy/contractions') {
    const user = userFromAuthHeader(headers);
    if (!user) return errorResponse(config, 401, 'Unauthorized');
    const preg = DB.pregnancies.find((p) => p.userId === user.id && p.isCurrentPregnancy);
    if (!preg) return errorResponse(config, 404, 'No active pregnancy');
    const contraction = { id: uid('c'), pregnancyTrackerId: preg.id, startTime: body.startTime || nowIso(), endTime: body.endTime || nowIso(), durationSeconds: Number(body.durationSeconds) || 0, intervalMinutes: Number(body.intervalMinutes) || 0, intensity: body.intensity || 'Mild', notes: body.notes || null };
    preg.contractions = preg.contractions || [];
    preg.contractions.unshift(contraction);
    return jsonResponse(config, { contraction }, 201);
  }

  if (method === 'GET' && url === '/pregnancy/weight-logs') {
    const user = userFromAuthHeader(headers);
    if (!user) return errorResponse(config, 401, 'Unauthorized');
    const preg = DB.pregnancies.find((p) => p.userId === user.id && p.isCurrentPregnancy);
    return jsonResponse(config, { weightLogs: preg?.weightLogs || [] });
  }

  if (method === 'POST' && url === '/pregnancy/weight-logs') {
    const user = userFromAuthHeader(headers);
    if (!user) return errorResponse(config, 401, 'Unauthorized');
    const preg = DB.pregnancies.find((p) => p.userId === user.id && p.isCurrentPregnancy);
    if (!preg) return errorResponse(config, 404, 'No active pregnancy');
    const weightLog = { id: uid('w'), pregnancyTrackerId: preg.id, logDate: body.logDate || nowIso().split('T')[0], weightKg: Number(body.weightKg) || 0, gestationalAgeWeeks: Number(body.gestationalAgeWeeks) || 0, notes: body.notes || null };
    preg.weightLogs = preg.weightLogs || [];
    preg.weightLogs.unshift(weightLog);
    return jsonResponse(config, { weightLog }, 201);
  }

  // ── SYMPTOM CONFIGS ──────────────────────────────────────────
  if (method === 'GET' && url === '/symptoms/configs') {
    return jsonResponse(config, { configs: SYMPTOM_CONFIGS });
  }

  // ── MILESTONE CONFIGS ────────────────────────────────────────
  if (method === 'GET' && url.startsWith('/milestones/configs')) {
    const params = Object.fromEntries(new URLSearchParams(url.split('?')[1] || ''));
    const configs = params.area ? MILESTONE_CONFIGS.filter((m) => m.area === params.area) : MILESTONE_CONFIGS;
    return jsonResponse(config, { configs });
  }

  // ── M-CHAT QUESTIONS ─────────────────────────────────────────
  if (method === 'GET' && url === '/mchat/questions') {
    return jsonResponse(config, { questions: MCHAT_QUESTIONS });
  }

  // ── SYMPTOM ASSESSMENTS ──────────────────────────────────────
  if (method === 'POST' && url === '/assessments/symptoms') {
    const user = userFromAuthHeader(headers);
    if (!user) return errorResponse(config, 401, 'Unauthorized');
    const { babyId, answers = [] } = body;
    let totalScore = 0;
    const redFlagsTriggered = [];
    const detailedAnswers = answers.map((a) => {
      const cfg = SYMPTOM_CONFIGS.find((c) => c.id === a.configId);
      if (!cfg) return null;
      if (a.present) {
        totalScore += cfg.weight;
        if (cfg.isRedFlag) redFlagsTriggered.push(cfg.symptomText);
      }
      return { ...cfg, present: a.present };
    }).filter(Boolean);
    let riskLevel = 'Green';
    if (redFlagsTriggered.length > 0) riskLevel = 'Red';
    else if (totalScore >= 8) riskLevel = 'Red';
    else if (totalScore >= 4) riskLevel = 'Yellow';
    const recommendations = {
      Green: 'Monitor at home. Symptoms appear mild. Keep your baby hydrated and observe for 24 hours.',
      Yellow: 'Consult a pediatrician within 24 hours. Symptoms warrant professional review.',
      Red: 'Seek immediate medical care. Red-flag symptoms or high score detected.',
    };
    const assessment = { id: uid('sa'), babyId, assessedBy: user.id, assessedAt: nowIso(), totalScore, riskLevel, emergencyAlert: riskLevel === 'Red', triggeringRedFlags: redFlagsTriggered, recommendationText: recommendations[riskLevel], answers: detailedAnswers };
    return jsonResponse(config, { assessment }, 201);
  }

  if (method === 'GET' && url.startsWith('/assessments/symptoms')) {
    const user = userFromAuthHeader(headers);
    if (!user) return errorResponse(config, 401, 'Unauthorized');
    return jsonResponse(config, { assessments: [] });
  }

  // ── MILESTONE ASSESSMENTS ────────────────────────────────────
  if (method === 'POST' && url === '/assessments/milestones') {
    const user = userFromAuthHeader(headers);
    if (!user) return errorResponse(config, 401, 'Unauthorized');
    const { babyId, items = [] } = body;
    const notAchieved = items.filter((i) => i.achieved === false).length;
    const totalItems = items.length;
    const percentAchieved = totalItems > 0 ? Math.round(((totalItems - notAchieved) / totalItems) * 100) : 0;
    const assessment = { id: uid('ma'), babyId, assessedBy: user.id, assessedAt: nowIso(), totalDelays: notAchieved, percentAchieved, items };
    return jsonResponse(config, { assessment }, 201);
  }

  // ── M-CHAT ASSESSMENTS ───────────────────────────────────────
  if (method === 'POST' && url === '/assessments/mchat') {
    const user = userFromAuthHeader(headers);
    if (!user) return errorResponse(config, 401, 'Unauthorized');
    const { babyId, answers = [] } = body;
    const REVERSE = [2, 5, 12];
    let riskScore = 0;
    answers.forEach((a) => {
      const isReverse = REVERSE.includes(a.questionNumber);
      if (isReverse && a.response === true) riskScore += 1;
      if (!isReverse && a.response === false) riskScore += 1;
    });
    let riskLevel = 'Low';
    if (riskScore >= 8) riskLevel = 'High';
    else if (riskScore >= 3) riskLevel = 'Medium';
    const actionPlans = {
      Low: 'Low likelihood of autism based on this screening. Continue routine monitoring and discuss at your next pediatrician visit.',
      Medium: 'Follow-up recommended. Discuss these results with your pediatrician and consider developmental screening.',
      High: 'Immediate specialist consultation recommended. Please contact a developmental pediatrician for full evaluation.',
    };
    const assessment = { id: uid('mc'), babyId, assessedBy: user.id, assessedAt: nowIso(), totalRiskScore: riskScore, riskLevel, followUpNeeded: riskLevel !== 'Low', actionPlan: actionPlans[riskLevel] };
    return jsonResponse(config, { assessment }, 201);
  }

  // ── GROWTH RECORDS ───────────────────────────────────────────
  if (method === 'GET' && url.startsWith('/growth')) {
    const user = userFromAuthHeader(headers);
    if (!user) return errorResponse(config, 401, 'Unauthorized');
    const params = Object.fromEntries(new URLSearchParams(url.split('?')[1] || ''));
    let records = DB.growthRecords;
    if (params.babyId) {
      records = records.filter((r) => r.babyId === params.babyId);
    } else {
      const ownedIds = DB.babies.filter((b) => b.userId === user.id).map((b) => b.id);
      records = records.filter((r) => ownedIds.includes(r.babyId));
    }
    records = [...records].sort((a, b) => a.babyAgeMonths - b.babyAgeMonths);
    return jsonResponse(config, { records });
  }

  if (method === 'POST' && url === '/growth') {
    const user = userFromAuthHeader(headers);
    if (!user) return errorResponse(config, 401, 'Unauthorized');
    const baby = DB.babies.find((b) => b.id === body.babyId);
    if (!baby) return errorResponse(config, 404, 'Baby not found');
    if (baby.userId !== user.id) return errorResponse(config, 403, 'Forbidden');

    const recordedAt = body.recordedAt || nowIso();
    const dob = new Date(baby.dob);
    const rec = new Date(recordedAt);
    let ageMonths = (rec.getFullYear() - dob.getFullYear()) * 12 + (rec.getMonth() - dob.getMonth());
    if (rec.getDate() < dob.getDate()) ageMonths -= 1;
    if (ageMonths < 0) ageMonths = 0;

    const weightPercentile = Math.min(99, Math.max(1, Math.round(50 + (Number(body.weightKg) - 3.3) * 8)));
    const heightPercentile = Math.min(99, Math.max(1, Math.round(50 + (Number(body.heightCm) - 50) * 1.5)));
    const headPercentile = Math.min(99, Math.max(1, Math.round(50 + (Number(body.headCircumferenceCm) - 34) * 2)));

    const record = {
      id: uid('g'), babyId: body.babyId, recordedAt, babyAgeMonths: ageMonths,
      weightKg: Number(body.weightKg), heightCm: Number(body.heightCm),
      headCircumferenceCm: Number(body.headCircumferenceCm) || 0,
      weightPercentile, heightPercentile, headPercentile,
      notes: body.notes || null,
    };
    DB.growthRecords.push(record);
    return jsonResponse(config, { record }, 201);
  }

  // ── VACCINATIONS ─────────────────────────────────────────────
  if (method === 'GET' && url === '/vaccinations/schedule') {
    const schedules = [...DB.vaccinationSchedules].sort((a, b) => a.dueAgeMonths - b.dueAgeMonths);
    return jsonResponse(config, { schedules });
  }

  if (method === 'GET' && url.startsWith('/vaccinations/records')) {
    const user = userFromAuthHeader(headers);
    if (!user) return errorResponse(config, 401, 'Unauthorized');
    const params = Object.fromEntries(new URLSearchParams(url.split('?')[1] || ''));
    let records = DB.vaccinationRecords;
    if (params.babyId) {
      records = records.filter((r) => r.babyId === params.babyId);
    } else {
      const ownedIds = DB.babies.filter((b) => b.userId === user.id).map((b) => b.id);
      records = records.filter((r) => ownedIds.includes(r.babyId));
    }
    return jsonResponse(config, { records });
  }

  if (method === 'POST' && url === '/vaccinations/records') {
    const user = userFromAuthHeader(headers);
    if (!user) return errorResponse(config, 401, 'Unauthorized');
    const record = {
      id: uid('vr'), babyId: body.babyId, vaccineScheduleId: body.vaccineScheduleId,
      administeredDate: body.administeredDate || nowIso().split('T')[0],
      administeredBy: body.administeredBy || null,
      batchNumber: body.batchNumber || null,
      notes: body.notes || null,
    };
    DB.vaccinationRecords.push(record);
    return jsonResponse(config, { record }, 201);
  }

  // ── SPECIALISTS ──────────────────────────────────────────────
  if (method === 'GET' && url === '/specialty-mappings') {
    return jsonResponse(config, { mappings: SPECIALTY_MAPPINGS });
  }

  if (method === 'GET' && url.startsWith('/specialists')) {
    const params = Object.fromEntries(new URLSearchParams(url.split('?')[1] || ''));

    const idMatch = url.match(/^\/specialists\/([^/?]+)/);
    if (idMatch) {
      const id = idMatch[1];
      const specialist = SPECIALISTS.find((s) => s.id === id);
      if (!specialist) return errorResponse(config, 404, 'Specialist not found');
      return jsonResponse(config, { specialist });
    }

    let list = [...SPECIALISTS];
    if (params.city) list = list.filter((s) => s.city.toLowerCase() === params.city.toLowerCase());
    if (params.specialty) list = list.filter((s) => s.specialty.toLowerCase().includes(params.specialty.toLowerCase()));
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter((s) =>
        s.name.toLowerCase().includes(q) ||
        s.specialty.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q)
      );
    }
    return jsonResponse(config, { specialists: list });
  }

  // ── CHAT ─────────────────────────────────────────────────────
  if (method === 'GET' && url === '/chat/sessions') {
    const user = userFromAuthHeader(headers);
    if (!user) return errorResponse(config, 401, 'Unauthorized');
    const sessions = DB.chatSessions.filter((s) => s.userId === user.id);
    return jsonResponse(config, { sessions });
  }

  if (method === 'POST' && url === '/chat/sessions') {
    const user = userFromAuthHeader(headers);
    if (!user) return errorResponse(config, 401, 'Unauthorized');
    const session = {
      id: uid('cs'), userId: user.id,
      startedAt: nowIso(), endedAt: null, sessionStatus: 'Active',
    };
    DB.chatSessions.push(session);
    DB.chatMessages[session.id] = [
      { id: uid('cm'), chatSessionId: session.id, sender: 'Bot', message: "Hi! I'm SmartCare AI. Ask me anything about your baby's health, milestones, or pregnancy. 💙", sentAt: nowIso() },
    ];
    return jsonResponse(config, { session }, 201);
  }

  {
    const m = routeMatch(method, url.split('?')[0], '/chat/sessions/:id/messages');
    if (m) {
      const user = userFromAuthHeader(headers);
      if (!user) return errorResponse(config, 401, 'Unauthorized');
      const sessionId = m.params.id;
      const session = DB.chatSessions.find((s) => s.id === sessionId);
      if (!session || session.userId !== user.id) return errorResponse(config, 404, 'Session not found');

      if (method === 'GET') {
        return jsonResponse(config, { messages: DB.chatMessages[sessionId] || [] });
      }

      if (method === 'POST') {
        const userMsg = { id: uid('cm'), chatSessionId: sessionId, sender: 'User', message: body.message || '', sentAt: nowIso() };
        DB.chatMessages[sessionId].push(userMsg);

        const botText = generateBotReply(body.message || '');
        const botMsg = { id: uid('cm'), chatSessionId: sessionId, sender: 'Bot', message: botText, sentAt: nowIso() };
        DB.chatMessages[sessionId].push(botMsg);

        return jsonResponse(config, { userMessage: userMsg, botMessage: botMsg }, 201);
      }
    }
  }

  // ── EDUCATION ────────────────────────────────────────────────
  if (method === 'GET' && url === '/education/categories') {
    return jsonResponse(config, {
      categories: ['Newborn Care', 'Nutrition', 'Development', 'Safety', 'Maternal Health'],
    });
  }

  if (method === 'GET' && url.startsWith('/education')) {
    const idMatch = url.match(/^\/education\/([^/?]+)/);
    if (idMatch) {
      const id = idMatch[1];
      const article = EDUCATION.find((a) => a.id === id);
      if (!article) return errorResponse(config, 404, 'Article not found');
      return jsonResponse(config, { article });
    }

    const params = Object.fromEntries(new URLSearchParams(url.split('?')[1] || ''));
    let list = [...EDUCATION].filter((a) => a.isActive);
    if (params.category) list = list.filter((a) => a.category === params.category);
    list.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
    return jsonResponse(config, { articles: list });
  }

  // ── FALLBACK ─────────────────────────────────────────────────
  return errorResponse(config, 404, `Mock: no route for ${method} ${url}`);
}

// ────────────────────────────────────────────────────────────────
if (import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.info(
    '%c[Mock API] Demo logins (password: password123)',
    'color:#17648d;font-weight:bold',
    '\n  Mother    → mother@test.com\n  Caregiver → caregiver@test.com\n  Admin     → admin@test.com'
  );
}