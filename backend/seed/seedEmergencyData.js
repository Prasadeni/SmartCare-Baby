/**
 * Seed Emergency data — contacts + facilities
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const EmergencyContact = require('../models/EmergencyContact');
const EmergencyFacility = require('../models/EmergencyFacility');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smartCare_baby';

const contacts = [
  // Primary call 911 banner
  {
    service_name: 'Call 911',
    phone_number: '911',
    description: 'For immediate, life-threatening medical emergencies.',
    category: 'Primary',
    icon: 'phone_in_talk',
    color: '#BA1A1A',
    is_24hr: true,
    is_active: true,
  },
  // Quick-action cards
  {
    service_name: 'Nearest Hospital',
    phone_number: '+94 11 269 3711',
    description: 'Connect with the closest ER or urgent care center.',
    category: 'Hospital',
    icon: 'local_hospital',
    color: '#2E6BE6',
    is_24hr: true,
    is_active: true,
  },
  {
    service_name: 'Pediatrician',
    phone_number: '+94 77 111 2004',
    description: 'Contact Dr. Sarah Jenkins (On-Call).',
    category: 'Pediatrician',
    icon: 'medical_services',
    color: '#D6336C',
    is_24hr: true,
    is_active: true,
  },
  {
    service_name: 'Poison Control',
    phone_number: '1-800-222-1222',
    description: '24/7 expert advice for potential poisonings.',
    category: 'Poison_Control',
    icon: 'warning',
    color: '#6B7280',
    is_24hr: true,
    is_active: true,
  },
];

const facilities = [
  {
    name: "City Children's Hospital ER",
    type: 'Hospital',
    address: '1.2 miles away • 123 Care Ave, Medical District',
    distance_km: 1.9,
    phone: '+94 11 269 3711',
    is_open_now: true,
    open_hours: '24/7',
    image_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400',
    latitude: 6.9271,
    longitude: 79.8612,
    is_active: true,
  },
  {
    name: 'Northside Pediatric Urgent Care',
    type: 'Urgent_Care',
    address: '3.5 miles away • 456 Health Pkwy, Northside',
    distance_km: 5.6,
    phone: '+94 11 269 5500',
    is_open_now: true,
    open_hours: '24/7',
    image_url: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400',
    latitude: 6.9400,
    longitude: 79.8700,
    is_active: true,
  },
  {
    name: "St. Mary's Children's Emergency",
    type: 'Hospital',
    address: '4.1 miles away • 789 Elm St, Downtown',
    distance_km: 6.6,
    phone: '+94 11 269 8800',
    is_open_now: false,
    open_hours: '8am - 10pm',
    image_url: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400',
    latitude: 6.9100,
    longitude: 79.8500,
    is_active: true,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('[Seed] Connected to MongoDB');

    await EmergencyContact.deleteMany({});
    await EmergencyFacility.deleteMany({});

    await EmergencyContact.insertMany(contacts);
    await EmergencyFacility.insertMany(facilities);

    console.log(`[Seed] Inserted ${contacts.length} emergency contacts and ${facilities.length} facilities.`);
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]:', err);
    process.exit(1);
  }
};

seedDB();