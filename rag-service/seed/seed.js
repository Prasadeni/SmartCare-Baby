/**
 * Seeds a demo parent + baby + a bit of personal data (kicks, symptoms,
 * growth, milestones, an M-CHAT result, vaccination records) so the
 * assistant has something real to ground its answers in.
 *
 * Run with: npm run seed
 * Undo with: npm run seed:destroy
 */
require("dotenv").config();
const connectDB = require("../config/db");

const User = require("../models/User");
const Baby = require("../models/Baby");
const KickSession = require("../models/KickSession");
const Symptom = require("../models/Symptom");
const GrowthRecord = require("../models/GrowthRecord");
const Milestone = require("../models/Milestone");
const MChatResult = require("../models/MChatResult");
const VaccinationRecord = require("../models/VaccinationRecord");

const importData = async () => {
  await connectDB();

  console.log("Clearing existing data...");
  await Promise.all([
    User.deleteMany(),
    Baby.deleteMany(),
    KickSession.deleteMany(),
    Symptom.deleteMany(),
    GrowthRecord.deleteMany(),
    Milestone.deleteMany(),
    MChatResult.deleteMany(),
    VaccinationRecord.deleteMany(),
  ]);

  console.log("Seeding demo parent + baby...");
  const parent = await User.create({
    name: "Demo Parent",
    email: "demo@babycarerag.test",
    password: "Password123!",
  });

  const dob = new Date();
  dob.setMonth(dob.getMonth() - 8);
  const baby = await Baby.create({
    parent: parent._id,
    name: "Baby Sam",
    gender: "male",
    dateOfBirth: dob,
    birthWeightKg: 3.2,
    birthHeightCm: 49,
  });

  console.log("Seeding kick sessions, symptoms, growth, milestones, vaccinations, M-CHAT...");
  const now = Date.now();
  await KickSession.insertMany([
    { baby: baby._id, count: 12, durationSeconds: 720, startedAt: new Date(now - 2 * 86400000 - 720000), endedAt: new Date(now - 2 * 86400000) },
    { baby: baby._id, count: 9, durationSeconds: 900, startedAt: new Date(now - 1 * 86400000 - 900000), endedAt: new Date(now - 1 * 86400000) },
  ]);

  await Symptom.insertMany([
    { baby: baby._id, date: new Date(now - 5 * 86400000), type: "fever", severity: "mild", temperatureCelsius: 37.8, resolved: true },
    { baby: baby._id, date: new Date(now - 1 * 86400000), type: "rash", severity: "mild", resolved: false },
  ]);

  await GrowthRecord.insertMany([
    { baby: baby._id, date: new Date(now - 30 * 86400000), weightKg: 7.4, heightCm: 65 },
    { baby: baby._id, date: new Date(now), weightKg: 7.9, heightCm: 67 },
  ]);

  await Milestone.insertMany([
    { baby: baby._id, category: "motor", title: "Sits without support", expectedAgeMonths: 6, achieved: true },
    { baby: baby._id, category: "motor", title: "Crawls", expectedAgeMonths: 8, achieved: false },
  ]);

  await VaccinationRecord.insertMany([
    { baby: baby._id, vaccineName: "MMR", doseNumber: 1, dueDate: new Date(now - 7 * 86400000), status: "completed", administeredDate: new Date(now - 7 * 86400000) },
    { baby: baby._id, vaccineName: "DTP Booster", doseNumber: 1, dueDate: new Date(now + 60 * 86400000), status: "upcoming" },
  ]);

  await MChatResult.create({
    baby: baby._id,
    dateTaken: new Date(),
    answers: [{ questionOrder: 1, answer: "yes", isRisk: false }],
    riskScore: 1,
    riskLevel: "low",
  });

  console.log("\n✅ Seed complete.");
  console.log("Demo login -> email: demo@babycarerag.test | password: Password123!");
  console.log(`Demo baby id: ${baby._id}`);
  process.exit(0);
};

const destroyData = async () => {
  await connectDB();
  await Promise.all([
    User.deleteMany(),
    Baby.deleteMany(),
    KickSession.deleteMany(),
    Symptom.deleteMany(),
    GrowthRecord.deleteMany(),
    Milestone.deleteMany(),
    MChatResult.deleteMany(),
    VaccinationRecord.deleteMany(),
  ]);
  console.log("✅ All data destroyed.");
  process.exit(0);
};

if (process.argv.includes("--destroy")) {
  destroyData();
} else {
  importData();
}
