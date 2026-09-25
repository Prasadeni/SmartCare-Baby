// backend/seed/seed.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

import User from '../models/User.js';
import Baby from '../models/Baby.js';
import SymptomConfig from '../models/SymptomConfig.js';
import MilestoneConfig from '../models/MilestoneConfig.js';
import MchatQuestion from '../models/MchatQuestion.js';
import GrowthRecord from '../models/GrowthRecord.js';
import VaccinationSchedule from '../models/VaccinationSchedule.js';
import VaccinationRecord from '../models/VaccinationRecord.js';
import Specialist from '../models/Specialist.js';
import SpecialtyMapping from '../models/SpecialtyMapping.js';
import EducationArticle from '../models/EducationArticle.js';
import EmergencyContact from '../models/EmergencyContact.js';
import RiskThreshold from '../models/RiskThreshold.js';

import { demoUsers, demoBabies, demoPassword } from './data/users.js';
import { symptoms } from './data/symptoms.js';
import { milestones } from './data/milestones.js';
import { mchatQuestions } from './data/mchat.js';
import { growthRecords } from './data/growth.js';
import { vaccinationSchedules, vaccinationRecords } from './data/vaccinations.js';
import { specialists, specialtyMappings } from './data/specialists.js';
import { emergencyContacts } from './data/emergency-contacts.js';
import { riskThresholds } from './data/risk-thresholds.js';
import { educationArticles } from './data/education.js';

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('🌱 Seeding database…\n');

  // Users — NON-DESTRUCTIVE. Only creates seed users if missing.
// Never deletes existing accounts (so your registered accounts persist).
const passwordHash = await bcrypt.hash(demoPassword, 10);
const createdUsers = {};
let usersCreated = 0;
let usersSkipped = 0;
for (const u of demoUsers) {
  let user = await User.findOne({ email: u.email.toLowerCase() });
  if (!user) {
    user = await User.create({ ...u, email: u.email.toLowerCase(), passwordHash });
    usersCreated++;
  } else {
    usersSkipped++;
  }
  createdUsers[u.email] = user;
}
console.log(`  ✅ Users: ${usersCreated} created, ${usersSkipped} already existed (kept)`);

  // ── Babies ─────────────────────────────────────────────────
  await Baby.deleteMany({});
  const createdBabies = {};
  for (const b of demoBabies) {
    const { ownerEmail, ...babyData } = b;
    const owner = createdUsers[ownerEmail];
    if (!owner) continue;
    const baby = await Baby.create({
      ...babyData,
      dob: new Date(babyData.dob),
      userId: owner._id,
    });
    createdBabies[babyData.name] = baby;
  }
  console.log(`  ✅ ${Object.keys(createdBabies).length} babies`);

  // ── Symptoms ───────────────────────────────────────────────
  await SymptomConfig.deleteMany({});
  await SymptomConfig.insertMany(symptoms);
  console.log(`  ✅ ${symptoms.length} symptom configs`);

  // ── Milestones ─────────────────────────────────────────────
  await MilestoneConfig.deleteMany({});
  await MilestoneConfig.insertMany(milestones);
  console.log(`  ✅ ${milestones.length} milestone configs`);

  // ── M-CHAT ─────────────────────────────────────────────────
  await MchatQuestion.deleteMany({});
  await MchatQuestion.insertMany(mchatQuestions);
  console.log(`  ✅ ${mchatQuestions.length} M-CHAT questions`);

  // ── Growth records ─────────────────────────────────────────
  await GrowthRecord.deleteMany({});
  let growthCount = 0;
  for (const g of growthRecords) {
    const { babyName, ...rest } = g;
    const baby = createdBabies[babyName];
    if (!baby) continue;
    await GrowthRecord.create({
      ...rest,
      babyId: baby._id,
      recordedAt: new Date(rest.recordedAt),
    });
    growthCount++;
  }
  console.log(`  ✅ ${growthCount} growth records`);

  // ── Vaccinations ───────────────────────────────────────────
  await VaccinationSchedule.deleteMany({});
  await VaccinationRecord.deleteMany({});
  const createdVaccines = {};
  for (const v of vaccinationSchedules) {
    const schedule = await VaccinationSchedule.create(v);
    createdVaccines[v.vaccineName] = schedule;
  }
  let vaxRecordCount = 0;
  for (const r of vaccinationRecords) {
    const baby = createdBabies[r.babyName];
    const vax = createdVaccines[r.vaccineName];
    if (!baby || !vax) continue;
    await VaccinationRecord.create({
      babyId: baby._id,
      vaccineScheduleId: vax._id,
      administeredDate: new Date(r.administeredDate),
      administeredBy: r.administeredBy,
      batchNumber: r.batchNumber,
    });
    vaxRecordCount++;
  }
  console.log(`  ✅ ${vaccinationSchedules.length} vaccines + ${vaxRecordCount} records`);

  // ── Specialists ────────────────────────────────────────────
  await Specialist.deleteMany({});
  await SpecialtyMapping.deleteMany({});
  await Specialist.insertMany(specialists);
  await SpecialtyMapping.insertMany(specialtyMappings);
  console.log(`  ✅ ${specialists.length} specialists + ${specialtyMappings.length} mappings`);

  // ── Education ──────────────────────────────────────────────
  await EducationArticle.deleteMany({});
  await EducationArticle.insertMany(
    educationArticles.map((a) => ({ ...a, publishedDate: new Date(a.publishedDate) }))
  );
  console.log(`  ✅ ${educationArticles.length} articles`);

  // ── Emergency Contacts ─────────────────────────────────────
  await EmergencyContact.deleteMany({});
  await EmergencyContact.insertMany(emergencyContacts);
  console.log(`  ✅ ${emergencyContacts.length} emergency contacts`);

  // ── Risk Thresholds ────────────────────────────────────────
  await RiskThreshold.deleteMany({});
  await RiskThreshold.insertMany(riskThresholds);
  console.log(`  ✅ ${riskThresholds.length} risk thresholds`);

  console.log('\n✅ Seed complete\n');
  console.log('  Demo logins (password: password123)');
  console.log('    mother@test.com    → PregnantMother');
  console.log('    caregiver@test.com → Caregiver');
  console.log('    admin@test.com     → Admin');

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});