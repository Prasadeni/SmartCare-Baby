// backend/routes/admin.js
import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Baby from '../models/Baby.js';
import SymptomConfig from '../models/SymptomConfig.js';
import SymptomAssessment from '../models/SymptomAssessment.js';
import MilestoneConfig from '../models/MilestoneConfig.js';
import MilestoneAssessment from '../models/MilestoneAssessment.js';
import MchatAssessment from '../models/MchatAssessment.js';
import Specialist from '../models/Specialist.js';
import EducationArticle from '../models/EducationArticle.js';
import EmergencyContact from '../models/EmergencyContact.js';
import RiskThreshold from '../models/RiskThreshold.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { asyncHandler } from '../utils/helpers.js';

const router = express.Router();
router.use(requireAuth, requireAdmin);

// ════════════════════════════════════════════════════════════
// ANALYTICS
// ════════════════════════════════════════════════════════════
router.get(
  '/analytics',
  asyncHandler(async (req, res) => {
    const [
      totalUsers,
      totalBabies,
      adminCount,
      caregiverCount,
      motherCount,
      symptomConfigCount,
      milestoneConfigCount,
      specialistCount,
      educationCount,
      emergencyCount,
      riskCount,
      symptomAssessmentCount,
      milestoneAssessmentCount,
      mchatAssessmentCount,
      redSymptomCount,
      highMchatCount,
      recentUsers,
    ] = await Promise.all([
      User.countDocuments(),
      Baby.countDocuments(),
      User.countDocuments({ role: 'Admin' }),
      User.countDocuments({ role: 'Caregiver' }),
      User.countDocuments({ role: 'PregnantMother' }),
      SymptomConfig.countDocuments(),
      MilestoneConfig.countDocuments(),
      Specialist.countDocuments(),
      EducationArticle.countDocuments(),
      EmergencyContact.countDocuments(),
      RiskThreshold.countDocuments(),
      SymptomAssessment.countDocuments(),
      MilestoneAssessment.countDocuments(),
      MchatAssessment.countDocuments(),
      SymptomAssessment.countDocuments({ riskLevel: 'Red' }),
      MchatAssessment.countDocuments({ riskLevel: 'High' }),
      User.find().sort({ createdAt: -1 }).limit(5).select('fullName email role createdAt'),
    ]);

    res.json({
      totalUsers,
      totalBabies,
      totalSpecialists: specialistCount,
      usersByRole: {
        admins: adminCount,
        caregivers: caregiverCount,
        mothers: motherCount,
      },
      contentCounts: {
        symptoms: symptomConfigCount,
        milestones: milestoneConfigCount,
        specialists: specialistCount,
        education: educationCount,
        emergency: emergencyCount,
        risks: riskCount,
      },
      totalAssessments:
        symptomAssessmentCount + milestoneAssessmentCount + mchatAssessmentCount,
      symptomAssessments: symptomAssessmentCount,
      milestoneAssessments: milestoneAssessmentCount,
      mchatAssessments: mchatAssessmentCount,
      highRiskAlerts: redSymptomCount + highMchatCount,
      redSymptomCount,
      highMchatCount,
      recentUsers: recentUsers.map((u) => ({
        id: u._id.toString(),
        fullName: u.fullName,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt,
      })),
    });
  })
);

// ════════════════════════════════════════════════════════════
// USERS
// ════════════════════════════════════════════════════════════
function shapeUser(u) {
  return {
    id: u._id.toString(),
    email: u.email,
    fullName: u.fullName,
    role: u.role,
    phone: u.phone,
    city: u.city,
    country: u.country,
    isActive: u.isActive,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  };
}

// GET /api/admin/users?role=&search=&status=active|inactive|all
router.get(
  '/users',
  asyncHandler(async (req, res) => {
    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.status === 'active') filter.isActive = { $ne: false };
    if (req.query.status === 'inactive') filter.isActive = false;
    if (req.query.search) {
      const q = req.query.search;
      filter.$or = [{ fullName: new RegExp(q, 'i') }, { email: new RegExp(q, 'i') }];
    }
    const users = await User.find(filter).sort({ createdAt: -1 }).limit(200);
    res.json({ users: users.map(shapeUser) });
  })
);

// PUT /api/admin/users/:id — edit user fields
router.put(
  '/users/:id',
  asyncHandler(async (req, res) => {
    const target = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ message: 'User not found' });

    // Prevent removing the last active admin
    if (target.role === 'Admin' && req.body.role && req.body.role !== 'Admin') {
      const activeAdmins = await User.countDocuments({
        role: 'Admin',
        isActive: { $ne: false },
      });
      if (activeAdmins <= 1) {
        return res.status(400).json({
          message: 'Cannot change the role of the last active admin',
        });
      }
    }

    const allowed = ['fullName', 'phone', 'city', 'country', 'role'];
    allowed.forEach((f) => {
      if (req.body[f] !== undefined) target[f] = req.body[f];
    });

    await target.save();
    res.json({ user: shapeUser(target) });
  })
);

// POST /api/admin/users/:id/deactivate — soft delete
router.post(
  '/users/:id/deactivate',
  asyncHandler(async (req, res) => {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot deactivate your own account' });
    }
    const target = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ message: 'User not found' });

    if (target.role === 'Admin') {
      const activeAdmins = await User.countDocuments({
        role: 'Admin',
        isActive: { $ne: false },
      });
      if (activeAdmins <= 1) {
        return res.status(400).json({ message: 'Cannot deactivate the last active admin' });
      }
    }

    target.isActive = false;
    await target.save();
    res.json({ user: shapeUser(target) });
  })
);

// POST /api/admin/users/:id/reactivate
router.post(
  '/users/:id/reactivate',
  asyncHandler(async (req, res) => {
    const target = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ message: 'User not found' });
    target.isActive = true;
    await target.save();
    res.json({ user: shapeUser(target) });
  })
);

// ════════════════════════════════════════════════════════════
// SYMPTOMS
// ════════════════════════════════════════════════════════════
function shapeSymptom(s) {
  return {
    id: s._id.toString(),
    category: s.category,
    symptomText: s.symptomText,
    weight: s.weight,
    isRedFlag: s.isRedFlag,
    ageMinMonths: s.ageMinMonths,
    ageMaxMonths: s.ageMaxMonths,
    guidanceText: s.guidanceText,
    isActive: s.isActive,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
  };
}

router.get(
  '/symptoms',
  asyncHandler(async (req, res) => {
    const items = await SymptomConfig.find().sort({ category: 1, symptomText: 1 });
    res.json({ items: items.map(shapeSymptom) });
  })
);

router.post(
  '/symptoms',
  asyncHandler(async (req, res) => {
    const created = await SymptomConfig.create({
      category: req.body.category,
      symptomText: req.body.symptomText,
      weight: Number(req.body.weight) || 1,
      isRedFlag: !!req.body.isRedFlag,
      guidanceText: req.body.guidanceText || '',
      ageMinMonths: Number(req.body.ageMinMonths) || 0,
      ageMaxMonths: Number(req.body.ageMaxMonths) || 60,
      isActive: req.body.isActive !== false,
    });
    res.status(201).json({ item: shapeSymptom(created) });
  })
);

router.put(
  '/symptoms/:id',
  asyncHandler(async (req, res) => {
    const updated = await SymptomConfig.findByIdAndUpdate(
      req.params.id,
      {
        category: req.body.category,
        symptomText: req.body.symptomText,
        weight: Number(req.body.weight) || 1,
        isRedFlag: !!req.body.isRedFlag,
        guidanceText: req.body.guidanceText || '',
        isActive: req.body.isActive !== false,
      },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Symptom not found' });
    res.json({ item: shapeSymptom(updated) });
  })
);

router.delete(
  '/symptoms/:id',
  asyncHandler(async (req, res) => {
    const deleted = await SymptomConfig.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Symptom not found' });
    res.json({ success: true });
  })
);

// ════════════════════════════════════════════════════════════
// MILESTONES
// ════════════════════════════════════════════════════════════
function shapeMilestone(m) {
  return {
    id: m._id.toString(),
    area: m.area,
    description: m.description,
    expectedAgeMonths: m.expectedAgeMonths,
    isCritical: m.isCritical,
    isActive: m.isActive,
    createdAt: m.createdAt,
    updatedAt: m.updatedAt,
  };
}

router.get(
  '/milestones',
  asyncHandler(async (req, res) => {
    const items = await MilestoneConfig.find().sort({ area: 1, expectedAgeMonths: 1 });
    res.json({ items: items.map(shapeMilestone) });
  })
);

router.post(
  '/milestones',
  asyncHandler(async (req, res) => {
    const created = await MilestoneConfig.create({
      area: req.body.area,
      description: req.body.description,
      expectedAgeMonths: Number(req.body.expectedAgeMonths) || 0,
      isCritical: !!req.body.isCritical,
      isActive: req.body.isActive !== false,
    });
    res.status(201).json({ item: shapeMilestone(created) });
  })
);

router.put(
  '/milestones/:id',
  asyncHandler(async (req, res) => {
    const updated = await MilestoneConfig.findByIdAndUpdate(
      req.params.id,
      {
        area: req.body.area,
        description: req.body.description,
        expectedAgeMonths: Number(req.body.expectedAgeMonths) || 0,
        isCritical: !!req.body.isCritical,
        isActive: req.body.isActive !== false,
      },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Milestone not found' });
    res.json({ item: shapeMilestone(updated) });
  })
);

router.delete(
  '/milestones/:id',
  asyncHandler(async (req, res) => {
    const deleted = await MilestoneConfig.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Milestone not found' });
    res.json({ success: true });
  })
);

// ════════════════════════════════════════════════════════════
// SPECIALISTS
// ════════════════════════════════════════════════════════════
function shapeSpecialist(s) {
  return {
    id: s._id.toString(),
    name: s.name,
    specialty: s.specialty,
    phone: s.phone,
    email: s.email,
    hospitalAffiliation: s.hospitalAffiliation,
    city: s.city,
    country: s.country,
    bio: s.bio,
    rating: s.rating,
    reviews: s.reviews,
    fee: s.fee,
    availableDays: s.availableDays,
    echannelingUrl: s.echannelingUrl,
    isActive: s.isActive,
    createdAt: s.createdAt,
  };
}

router.get(
  '/specialists',
  asyncHandler(async (req, res) => {
    const items = await Specialist.find().sort({ createdAt: -1 });
    res.json({ items: items.map(shapeSpecialist) });
  })
);

router.post(
  '/specialists',
  asyncHandler(async (req, res) => {
    const created = await Specialist.create({
      name: req.body.name,
      specialty: req.body.specialty,
      phone: req.body.phone,
      email: req.body.email || null,
      hospitalAffiliation: req.body.hospitalAffiliation || null,
      city: req.body.city,
      country: req.body.country || 'Sri Lanka',
      bio: req.body.bio || '',
      rating: Number(req.body.rating) || 0,
      reviews: Number(req.body.reviews) || 0,
      fee: req.body.fee || null,
      availableDays: Array.isArray(req.body.availableDays) ? req.body.availableDays : [],
      echannelingUrl: req.body.echannelingUrl || null,
      isActive: req.body.isActive !== false,
    });
    res.status(201).json({ item: shapeSpecialist(created) });
  })
);

router.put(
  '/specialists/:id',
  asyncHandler(async (req, res) => {
    const updated = await Specialist.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        specialty: req.body.specialty,
        phone: req.body.phone,
        email: req.body.email || null,
        hospitalAffiliation: req.body.hospitalAffiliation || null,
        city: req.body.city,
        country: req.body.country || 'Sri Lanka',
        bio: req.body.bio || '',
        rating: Number(req.body.rating) || 0,
        reviews: Number(req.body.reviews) || 0,
        fee: req.body.fee || null,
        availableDays: Array.isArray(req.body.availableDays) ? req.body.availableDays : [],
        echannelingUrl: req.body.echannelingUrl || null,
        isActive: req.body.isActive !== false,
      },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Specialist not found' });
    res.json({ item: shapeSpecialist(updated) });
  })
);

router.delete(
  '/specialists/:id',
  asyncHandler(async (req, res) => {
    const deleted = await Specialist.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Specialist not found' });
    res.json({ success: true });
  })
);

// ════════════════════════════════════════════════════════════
// EDUCATION
// ════════════════════════════════════════════════════════════
function shapeEducation(a) {
  return {
    id: a._id.toString(),
    title: a.title,
    contentType: a.contentType,
    body: a.body,
    category: a.category,
    author: a.author,
    publishedDate: a.publishedDate
      ? a.publishedDate.toISOString().split('T')[0]
      : null,
    imageUrl: a.imageUrl,
    isActive: a.isActive,
    createdAt: a.createdAt,
  };
}

router.get(
  '/education',
  asyncHandler(async (req, res) => {
    const items = await EducationArticle.find().sort({ publishedDate: -1 });
    res.json({ items: items.map(shapeEducation) });
  })
);

router.post(
  '/education',
  asyncHandler(async (req, res) => {
    const created = await EducationArticle.create({
      title: req.body.title,
      contentType: req.body.contentType || 'Article',
      body: req.body.body,
      category: req.body.category,
      author: req.body.author || 'SmartCare Team',
      publishedDate: req.body.publishedDate ? new Date(req.body.publishedDate) : new Date(),
      imageUrl: req.body.imageUrl || null,
      isActive: req.body.isActive !== false,
    });
    res.status(201).json({ item: shapeEducation(created) });
  })
);

router.put(
  '/education/:id',
  asyncHandler(async (req, res) => {
    const patch = {
      title: req.body.title,
      contentType: req.body.contentType || 'Article',
      body: req.body.body,
      category: req.body.category,
      author: req.body.author || 'SmartCare Team',
      imageUrl: req.body.imageUrl || null,
      isActive: req.body.isActive !== false,
    };
    if (req.body.publishedDate) patch.publishedDate = new Date(req.body.publishedDate);

    const updated = await EducationArticle.findByIdAndUpdate(req.params.id, patch, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: 'Article not found' });
    res.json({ item: shapeEducation(updated) });
  })
);

router.delete(
  '/education/:id',
  asyncHandler(async (req, res) => {
    const deleted = await EducationArticle.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Article not found' });
    res.json({ success: true });
  })
);

// ════════════════════════════════════════════════════════════
// EMERGENCY CONTACTS
// ════════════════════════════════════════════════════════════
function shapeEmergency(e) {
  return {
    id: e._id.toString(),
    name: e.name,
    category: e.category,
    phone: e.phone,
    alternatePhone: e.alternatePhone,
    address: e.address,
    city: e.city,
    description: e.description,
    isNational: e.isNational,
    isActive: e.isActive,
    sortOrder: e.sortOrder,
    createdAt: e.createdAt,
  };
}

router.get(
  '/emergency-contacts',
  asyncHandler(async (req, res) => {
    const items = await EmergencyContact.find().sort({ sortOrder: 1, name: 1 });
    res.json({ items: items.map(shapeEmergency) });
  })
);

router.post(
  '/emergency-contacts',
  asyncHandler(async (req, res) => {
    const created = await EmergencyContact.create({
      name: req.body.name,
      category: req.body.category || 'Other',
      phone: req.body.phone,
      alternatePhone: req.body.alternatePhone || '',
      address: req.body.address || '',
      city: req.body.city || '',
      description: req.body.description || '',
      isNational: !!req.body.isNational,
      isActive: req.body.isActive !== false,
      sortOrder: Number(req.body.sortOrder) || 0,
    });
    res.status(201).json({ item: shapeEmergency(created) });
  })
);

router.put(
  '/emergency-contacts/:id',
  asyncHandler(async (req, res) => {
    const updated = await EmergencyContact.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        category: req.body.category || 'Other',
        phone: req.body.phone,
        alternatePhone: req.body.alternatePhone || '',
        address: req.body.address || '',
        city: req.body.city || '',
        description: req.body.description || '',
        isNational: !!req.body.isNational,
        isActive: req.body.isActive !== false,
        sortOrder: Number(req.body.sortOrder) || 0,
      },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Contact not found' });
    res.json({ item: shapeEmergency(updated) });
  })
);

router.delete(
  '/emergency-contacts/:id',
  asyncHandler(async (req, res) => {
    const deleted = await EmergencyContact.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Contact not found' });
    res.json({ success: true });
  })
);

// ════════════════════════════════════════════════════════════
// RISK THRESHOLDS
// ════════════════════════════════════════════════════════════
function shapeRisk(r) {
  return {
    id: r._id.toString(),
    name: r.name,
    assessmentType: r.assessmentType,
    riskLevel: r.riskLevel,
    minScore: r.minScore,
    maxScore: r.maxScore,
    color: r.color,
    description: r.description,
    recommendationText: r.recommendationText,
    actionRequired: r.actionRequired,
    notifyCaregiver: r.notifyCaregiver,
    escalateToAdmin: r.escalateToAdmin,
    isActive: r.isActive,
    sortOrder: r.sortOrder,
    createdAt: r.createdAt,
  };
}

router.get(
  '/risk-thresholds',
  asyncHandler(async (req, res) => {
    const items = await RiskThreshold.find().sort({ sortOrder: 1, minScore: 1 });
    res.json({ items: items.map(shapeRisk) });
  })
);

router.post(
  '/risk-thresholds',
  asyncHandler(async (req, res) => {
    const created = await RiskThreshold.create({
      name: req.body.name,
      riskLevel: req.body.riskLevel,
      minScore: Number(req.body.minScore) || 0,
      maxScore: Number(req.body.maxScore) || 0,
      color: req.body.color || '',
      description: req.body.description || '',
      recommendationText: req.body.recommendationText || '',
      actionRequired: req.body.actionRequired || '',
      notifyCaregiver: req.body.notifyCaregiver !== false,
      escalateToAdmin: !!req.body.escalateToAdmin,
      isActive: req.body.isActive !== false,
      sortOrder: Number(req.body.sortOrder) || 0,
    });
    res.status(201).json({ item: shapeRisk(created) });
  })
);

router.put(
  '/risk-thresholds/:id',
  asyncHandler(async (req, res) => {
    const updated = await RiskThreshold.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        riskLevel: req.body.riskLevel,
        minScore: Number(req.body.minScore) || 0,
        maxScore: Number(req.body.maxScore) || 0,
        color: req.body.color || '',
        description: req.body.description || '',
        recommendationText: req.body.recommendationText || '',
        actionRequired: req.body.actionRequired || '',
        notifyCaregiver: req.body.notifyCaregiver !== false,
        escalateToAdmin: !!req.body.escalateToAdmin,
        isActive: req.body.isActive !== false,
        sortOrder: Number(req.body.sortOrder) || 0,
      },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Threshold not found' });
    res.json({ item: shapeRisk(updated) });
  })
);

router.delete(
  '/risk-thresholds/:id',
  asyncHandler(async (req, res) => {
    const deleted = await RiskThreshold.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Threshold not found' });
    res.json({ success: true });
  })
);

// ════════════════════════════════════════════════════════════
// ASSESSMENTS (read-only)
// Orphaned rows (baby or user deleted) are silently skipped.
// ════════════════════════════════════════════════════════════
router.get(
  '/assessments/symptoms',
  asyncHandler(async (req, res) => {
    const items = await SymptomAssessment.find()
      .populate('babyId', 'name')
      .populate('assessedBy', 'fullName')
      .sort({ assessedAt: -1 })
      .limit(200);

    res.json({
      items: items
        .filter((a) => a.babyId && a.assessedBy)
        .map((a) => ({
          id: a._id.toString(),
          babyName: a.babyId.name,
          assessedByName: a.assessedBy.fullName,
          assessedAt: a.assessedAt,
          totalScore: a.totalScore,
          riskLevel: a.riskLevel,
          emergencyAlert: a.emergencyAlert,
        })),
    });
  })
);

router.get(
  '/assessments/milestones',
  asyncHandler(async (req, res) => {
    const items = await MilestoneAssessment.find()
      .populate('babyId', 'name')
      .populate('assessedBy', 'fullName')
      .sort({ assessedAt: -1 })
      .limit(200);

    res.json({
      items: items
        .filter((a) => a.babyId && a.assessedBy)
        .map((a) => ({
          id: a._id.toString(),
          babyName: a.babyId.name,
          assessedByName: a.assessedBy.fullName,
          assessedAt: a.assessedAt,
          totalDelays: a.totalDelays,
          percentAchieved: a.percentAchieved,
        })),
    });
  })
);

router.get(
  '/assessments/mchat',
  asyncHandler(async (req, res) => {
    const items = await MchatAssessment.find()
      .populate('babyId', 'name')
      .populate('assessedBy', 'fullName')
      .sort({ assessedAt: -1 })
      .limit(200);

    res.json({
      items: items
        .filter((a) => a.babyId && a.assessedBy)
        .map((a) => ({
          id: a._id.toString(),
          babyName: a.babyId.name,
          assessedByName: a.assessedBy.fullName,
          assessedAt: a.assessedAt,
          totalRiskScore: a.totalRiskScore,
          riskLevel: a.riskLevel,
        })),
    });
  })
);

// ════════════════════════════════════════════════════════════
// SETTINGS — admin profile + password
// ════════════════════════════════════════════════════════════
router.get(
  '/settings/profile',
  asyncHandler(async (req, res) => {
    const u = req.user;
    res.json({
      profile: {
        id: u._id.toString(),
        email: u.email,
        fullName: u.fullName,
        phone: u.phone || '',
        city: u.city || '',
        country: u.country || 'Sri Lanka',
        role: u.role,
        createdAt: u.createdAt,
      },
    });
  })
);

router.put(
  '/settings/profile',
  asyncHandler(async (req, res) => {
    const { fullName, phone, city, country } = req.body;
    if (fullName) req.user.fullName = fullName;
    if (phone !== undefined) req.user.phone = phone;
    if (city) req.user.city = city;
    if (country) req.user.country = country;
    await req.user.save();
    res.json({
      profile: {
        id: req.user._id.toString(),
        email: req.user.email,
        fullName: req.user.fullName,
        phone: req.user.phone || '',
        city: req.user.city || '',
        country: req.user.country || 'Sri Lanka',
        role: req.user.role,
      },
    });
  })
);

router.put(
  '/settings/password',
  asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters' });
    }
    const ok = await bcrypt.compare(currentPassword, req.user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    req.user.passwordHash = await bcrypt.hash(newPassword, 10);
    await req.user.save();
    res.json({ success: true });
  })
);

export default router;