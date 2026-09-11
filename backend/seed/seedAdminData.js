/**
 * Seed Admin Dashboard data
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Alert = require('../models/Alert');
const ActivityLog = require('../models/ActivityLog');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smartCare_baby';

const alerts = [
  {
    alert_type: 'Abnormal_HR',
    severity: 'CRITICAL',
    title: 'Abnormal HR Detected',
    description: 'Patient ID: 4092 — Heart rate outside safe range for 3 consecutive readings.',
    is_resolved: false,
  },
  {
    alert_type: 'Missed_Assessment',
    severity: 'WARNING',
    title: 'Missed Assessment',
    description: 'User #3021 missed a scheduled developmental screening.',
    is_resolved: false,
  },
  {
    alert_type: 'Device_Sync_Error',
    severity: 'SYSTEM',
    title: 'Device Sync Error',
    description: 'Batch could not be synced from the remote device.',
    is_resolved: false,
  },
  {
    alert_type: 'High_Risk_Symptom',
    severity: 'CRITICAL',
    title: 'High-Risk Symptom Reported',
    description: 'Multiple critical symptoms reported in the last 24 hours.',
    is_resolved: false,
  },
];

// Generate 7 days of activity data
const generateActivityLogs = () => {
  const logs = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const dayOfWeek = date.getDay();
    // Simulate higher activity on weekdays
    const base = dayOfWeek === 0 || dayOfWeek === 6 ? 400 : 900;
    const variation = Math.floor(Math.random() * 300);
    const login_count = base + variation;
    const assessment_count = Math.floor(login_count * 0.4);

    logs.push({
      activity_date: date,
      login_count,
      assessment_count,
      new_users: Math.floor(login_count * 0.05),
      total_activity: login_count + assessment_count,
    });
  }
  return logs;
};

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('[Seed] Connected to MongoDB');

    await Alert.deleteMany({});
    await ActivityLog.deleteMany({});

    await Alert.insertMany(alerts);
    await ActivityLog.insertMany(generateActivityLogs());

    console.log(`[Seed] Inserted ${alerts.length} alerts and 7 activity logs.`);
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]:', err);
    process.exit(1);
  }
};

seedDB();