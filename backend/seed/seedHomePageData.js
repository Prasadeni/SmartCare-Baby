/**
 * Seed Script - SmartCare Baby Home Page Data
 * Populates MongoDB with sample records for Educational Content, Emergency Contacts, and Specialists.
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const EducationalContent = require('../models/EducationalContent');
const EmergencyContact = require('../models/EmergencyContact');
const Specialist = require('../models/Specialist');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smartCare_baby';

const sampleContent = [
  {
    title: 'Smarter Care for Every Little Milestone',
    content_type: 'Guide',
    body: 'Experience peace of mind with our gentle, intuitive platform designed to track your baby\'s development, health metrics, and precious moments, providing expert guidance every step of the way.',
    category: 'Maternal & Child Health',
    author: 'SmartCare Health Team',
    image_url: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=800',
    is_active: true,
    published_date: new Date('2026-01-15'),
  },
  {
    title: 'Understanding M-CHAT-R Screening for Early Milestones',
    content_type: 'Article',
    body: 'M-CHAT-R is a validated 20-question screening tool designed to assess risk for Autism Spectrum Disorder in toddlers between 16 and 30 months of age.',
    category: 'Milestone Tracking',
    author: 'Dr. Sarah Jenkins',
    image_url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=800',
    is_active: true,
    published_date: new Date('2026-02-10'),
  },
  {
    title: 'Essential Nutrition Guide for Expectant Mothers',
    content_type: 'Guide',
    body: 'Comprehensive guide covering key nutrients, folic acid requirements, hydration, and safe physical exercises during all three trimesters.',
    category: 'Pregnancy Care',
    author: 'Dr. Michael Chang',
    image_url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=800',
    is_active: true,
    published_date: new Date('2026-03-01'),
  },
];

const sampleEmergencyContacts = [
  {
    service_name: 'National Emergency Ambulance Service (1990)',
    phone_number: '1990',
    description: 'Toll-free 24/7 emergency medical response and rapid ambulance dispatch.',
    country: 'Sri Lanka',
    city: 'Nationwide',
    is_24hr: true,
    is_active: true,
  },
  {
    service_name: '24/7 Maternal & Pediatric Doctor on Call',
    phone_number: '+94 11 269 1111',
    description: 'Immediate tele-consultation with qualified pediatricians and obstetricians for urgent non-critical queries.',
    country: 'Sri Lanka',
    city: 'Colombo',
    is_24hr: true,
    is_active: true,
  },
  {
    service_name: 'Lady Ridgeway Children\'s Hospital Emergency Line',
    phone_number: '+94 11 269 3711',
    description: 'Direct emergency desk at premier pediatric hospital for acute infant trauma and severe medical symptoms.',
    country: 'Sri Lanka',
    city: 'Colombo',
    is_24hr: true,
    is_active: true,
  },
];

const sampleSpecialists = [
  {
    name: 'Dr. Sarah Jenkins',
    specialty: 'Lead Consultant Pediatrician',
    phone: '+94 77 123 4567',
    email: 'dr.jenkins@smartcarebaby.org',
    hospital_affiliation: 'Lady Ridgeway Children\'s Hospital',
    street: 'Kynsey Road',
    city: 'Colombo',
    state: 'Western Province',
    country: 'Sri Lanka',
    latitude: 6.9175,
    longitude: 79.8711,
    is_active: true,
  },
  {
    name: 'Dr. Michael Chang',
    specialty: 'Obstetrician & Gynecologist',
    phone: '+94 77 234 5678',
    email: 'dr.chang@smartcarebaby.org',
    hospital_affiliation: 'Castle Street Hospital for Women',
    street: 'Castle Street',
    city: 'Colombo',
    state: 'Western Province',
    country: 'Sri Lanka',
    latitude: 6.9112,
    longitude: 79.8794,
    is_active: true,
  },
  {
    name: 'Dr. Priya Sharma',
    specialty: 'Consultant Neonatologist',
    phone: '+94 77 345 6789',
    email: 'dr.sharma@smartcarebaby.org',
    hospital_affiliation: 'Asiri Surgical Hospital',
    street: 'Kirula Road',
    city: 'Colombo',
    state: 'Western Province',
    country: 'Sri Lanka',
    latitude: 6.8914,
    longitude: 79.8762,
    is_active: true,
  },
];

const seedDB = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('[Seed] Connected to MongoDB successfully.');

    console.log('[Seed] Cleaning old home page collections...');
    await EducationalContent.deleteMany({});
    await EmergencyContact.deleteMany({});
    await Specialist.deleteMany({});

    console.log('[Seed] Inserting Educational Content...');
    const insertedContent = await EducationalContent.insertMany(sampleContent);
    console.log(`[Seed] Inserted ${insertedContent.length} Educational Content items.`);

    console.log('[Seed] Inserting Emergency Contacts...');
    const insertedContacts = await EmergencyContact.insertMany(sampleEmergencyContacts);
    console.log(`[Seed] Inserted ${insertedContacts.length} Emergency Contacts.`);

    console.log('[Seed] Inserting Specialists...');
    const insertedSpecialists = await Specialist.insertMany(sampleSpecialists);
    console.log(`[Seed] Inserted ${insertedSpecialists.length} Specialists.`);

    console.log('\n==================================================');
    console.log(' SMARTCARE BABY HOME PAGE SEED DATA COMPLETED! ');
    console.log('==================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDB();