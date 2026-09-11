/**
 * Seed Specialists + Clinics for the Consult page
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Specialist = require('../models/Specialist');
const Clinic = require('../models/Clinic');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smartCare_baby';

const specialists = [
  {
    name: 'Dr. Emily Chen',
    specialty: 'Pediatric Gastroenterologist',
    phone: '+94 77 111 2001',
    email: 'emily.chen@smartcare.lk',
    hospital_affiliation: 'Sunrise Medical Center',
    street: '123 Healthway Dr',
    city: 'Colombo',
    state: 'Western Province',
    country: 'Sri Lanka',
    latitude: 6.9271,
    longitude: 79.8612,
    avatar_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200',
    rating: 4.9,
    reviews_count: 120,
    distance_km: 2.4,
    bio: 'Specializes in pediatric digestive health, feeding difficulties, and nutritional guidance.',
    is_active: true,
  },
  {
    name: 'Dr. Mark Lee',
    specialty: 'General Pediatrics & Nutrition',
    phone: '+94 77 111 2002',
    email: 'mark.lee@smartcare.lk',
    hospital_affiliation: 'Oak Tree Clinic',
    street: '45 Oak Avenue',
    city: 'Colombo',
    state: 'Western Province',
    country: 'Sri Lanka',
    latitude: 6.9180,
    longitude: 79.8550,
    avatar_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200',
    rating: 4.8,
    reviews_count: 85,
    distance_km: 3.1,
    bio: 'Pediatrician with 12+ years of experience in infant nutrition and preventive care.',
    is_active: true,
  },
  {
    name: 'Dr. Priya Sharma',
    specialty: 'Consultant Neonatologist',
    phone: '+94 77 111 2003',
    email: 'priya.sharma@smartcare.lk',
    hospital_affiliation: 'Asiri Surgical Hospital',
    street: 'Kirula Road',
    city: 'Colombo',
    state: 'Western Province',
    country: 'Sri Lanka',
    latitude: 6.8914,
    longitude: 79.8762,
    avatar_url: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200',
    rating: 4.9,
    reviews_count: 210,
    distance_km: 4.8,
    bio: 'Specialist in newborn care, premature infants, and neonatal development.',
    is_active: true,
  },
  {
    name: 'Dr. Sarah Jenkins',
    specialty: 'Developmental Pediatrician',
    phone: '+94 77 111 2004',
    email: 'sarah.jenkins@smartcare.lk',
    hospital_affiliation: 'Lady Ridgeway Children\'s Hospital',
    street: 'Kynsey Road',
    city: 'Colombo',
    state: 'Western Province',
    country: 'Sri Lanka',
    latitude: 6.9175,
    longitude: 79.8711,
    avatar_url: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=200',
    rating: 5.0,
    reviews_count: 156,
    distance_km: 3.7,
    bio: 'Focuses on early childhood development, autism screening, and behavioral assessments.',
    is_active: true,
  },
];

const clinics = [
  {
    name: 'Sunrise Medical Center',
    status: 'CLOSED',
    distance_km: 2.4,
    drive_time_min: 10,
    address: '123 Healthway Dr, Suite 200',
    phone: '+94 11 269 1111',
    latitude: 6.9271,
    longitude: 79.8612,
    is_active: true,
  },
  {
    name: 'Oak Tree Clinic',
    status: 'OPEN',
    distance_km: 3.1,
    drive_time_min: 12,
    address: '45 Oak Avenue, Colombo 07',
    phone: '+94 11 269 2222',
    latitude: 6.9180,
    longitude: 79.8550,
    is_active: true,
  },
  {
    name: 'Asiri Surgical Hospital',
    status: 'OPEN',
    distance_km: 4.8,
    drive_time_min: 15,
    address: 'Kirula Road, Colombo 05',
    phone: '+94 11 452 3300',
    latitude: 6.8914,
    longitude: 79.8762,
    is_active: true,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('[Seed] Connected to MongoDB');

    await Specialist.deleteMany({});
    await Clinic.deleteMany({});

    await Specialist.insertMany(specialists);
    await Clinic.insertMany(clinics);

    console.log(`[Seed] Inserted ${specialists.length} specialists and ${clinics.length} clinics.`);
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]:', err);
    process.exit(1);
  }
};

seedDB();