/**
 * Home Routes - SmartCare Baby
 * Defines API endpoints for home dashboard content, emergency contacts, specialist lookup, and services overview
 */

const express = require('express');
const router = express.Router();

const {
  getContent,
  getEmergencyContacts,
  getSpecialists,
  getServicesOverview,
} = require('../controllers/homeController');

// GET /api/content - Fetch active educational content
router.get('/content', getContent);

// GET /api/emergency-contacts - Fetch active emergency numbers for floating Emergency button
router.get('/emergency-contacts', getEmergencyContacts);

// GET /api/specialists - Fetch active specialists for Specialist Guidance module
router.get('/specialists', getSpecialists);

// GET /api/services - Fetch 5 "Our Services" cards for Home Dashboard
router.get('/services', getServicesOverview);

module.exports = router;