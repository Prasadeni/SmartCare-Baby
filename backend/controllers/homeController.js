/**
 * Home Controller - SmartCare Baby
 * Serves dashboard data: educational content, emergency contacts, specialists, and service modules
 */

const EducationalContent = require('../models/EducationalContent');
const EmergencyContact = require('../models/EmergencyContact');
const Specialist = require('../models/Specialist');

// Static definitions for the 5 "Our Services" modules shown on the Home Dashboard UI
const OUR_SERVICES_DATA = [
  {
    id: 'symptoms-tracker',
    title: 'Baby Symptoms Tracker',
    description: 'A questionnaire-based tool where parents can answer questions about their baby\'s symptoms, receive results, and access relevant specialist guidance.',
    icon: 'medical-bag',
    route: '/trackers/symptoms',
    bg_color: '#EEF6FF',
    badge: 'Interactive',
  },
  {
    id: 'milestone-tracker',
    title: 'Milestone Tracker',
    description: 'Helps parents monitor their baby\'s developmental progress using M-CHAT-R screening and a milestone tracker.',
    icon: 'check-circle',
    route: '/trackers/milestones',
    bg_color: '#FDF2F8',
    badge: 'M-CHAT-R',
  },
  {
    id: 'pregnancy-tracker',
    title: 'Pregnancy Tracker',
    description: 'Provides useful pregnancy tracking tools, including a Kick Counter, Contraction Timer, and Weight Tracker.',
    icon: 'pregnant-woman',
    route: '/trackers/pregnancy',
    bg_color: '#F0F9FF',
    badge: 'Maternal Care',
  },
  {
    id: 'growth-tracker',
    title: 'Baby Growth Tracker',
    description: 'Allows parents to monitor their baby\'s weight, height, and BMI over time.',
    icon: 'chart-line',
    route: '/trackers/growth',
    bg_color: '#FAF5FF',
    badge: 'Growth Metrics',
  },
  {
    id: 'specialist-guidance',
    title: 'Specialist Guidance',
    description: 'Helps users find suitable specialists through a search bar, Nearby Search toggle, and detailed doctor profiles.',
    icon: 'user-md',
    route: '/specialists',
    bg_color: '#EFF6FF',
    badge: 'Expert Network',
  },
];

// @desc    Fetch all active educational content
// @route   GET /api/content
// @access  Public
const getContent = async (req, res) => {
  try {
    const { type, category } = req.query;
    const filter = { is_active: true };

    if (type) filter.content_type = type;
    if (category) filter.category = category;

    const contentList = await EducationalContent.find(filter).sort({ published_date: -1 });

    res.status(200).json({
      success: true,
      count: contentList.length,
      data: contentList,
    });
  } catch (error) {
    console.error('[Get Content Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch educational content',
      error: error.message,
    });
  }
};

// @desc    Fetch all active emergency numbers (for floating Emergency button)
// @route   GET /api/emergency-contacts
// @access  Public
const getEmergencyContacts = async (req, res) => {
  try {
    const contacts = await EmergencyContact.find({ is_active: true }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    console.error('[Get Emergency Contacts Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch emergency contacts',
      error: error.message,
    });
  }
};

// @desc    Fetch all active specialists (for Specialist Guidance card)
// @route   GET /api/specialists
// @access  Public
const getSpecialists = async (req, res) => {
  try {
    const { city, specialty, search } = req.query;
    const filter = { is_active: true };

    if (city) filter.city = new RegExp(city, 'i');
    if (specialty) filter.specialty = new RegExp(specialty, 'i');
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { specialty: new RegExp(search, 'i') },
        { hospital_affiliation: new RegExp(search, 'i') },
      ];
    }

    const specialists = await Specialist.find(filter).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: specialists.length,
      data: specialists,
    });
  } catch (error) {
    console.error('[Get Specialists Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch specialists',
      error: error.message,
    });
  }
};

// @desc    Fetch 5 "Our Services" feature cards for Home Dashboard
// @route   GET /api/services
// @access  Public
const getServicesOverview = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      count: OUR_SERVICES_DATA.length,
      data: OUR_SERVICES_DATA,
    });
  } catch (error) {
    console.error('[Get Services Overview Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services overview',
      error: error.message,
    });
  }
};

module.exports = {
  getContent,
  getEmergencyContacts,
  getSpecialists,
  getServicesOverview,
};