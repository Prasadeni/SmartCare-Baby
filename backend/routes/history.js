// backend/routes/history.js
import express from 'express';
import Baby from '../models/Baby.js';
import SymptomAssessment from '../models/SymptomAssessment.js';
import MilestoneAssessment from '../models/MilestoneAssessment.js';
import MchatAssessment from '../models/MchatAssessment.js';
import GrowthRecord from '../models/GrowthRecord.js';
import VaccinationRecord from '../models/VaccinationRecord.js';
import VaccinationSchedule from '../models/VaccinationSchedule.js';
import BabyNote from '../models/BabyNote.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/helpers.js';

const router = express.Router();
router.use(requireAuth);

// ════════════════════════════════════════════════════════════
// GET /api/history?babyId=xxx
// Aggregates all events for a baby into a single timeline.
// If babyId is omitted, returns events for all owned babies.
// ════════════════════════════════════════════════════════════
router.get(
  '/',
  asyncHandler(async (req, res) => {
    // Determine which babies to include
    let babyFilter;
    if (req.query.babyId) {
      const baby = await Baby.findById(req.query.babyId);
      if (!baby) return res.status(404).json({ message: 'Baby not found' });
      if (baby.userId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Forbidden' });
      }
      babyFilter = [baby._id];
    } else {
      const babies = await Baby.find({ userId: req.user._id }).select('_id');
      babyFilter = babies.map((b) => b._id);
    }

    if (babyFilter.length === 0) {
      return res.json({ events: [], doctorPreview: null, notes: [] });
    }

    const babyMatch = { $in: babyFilter };

    // Fetch all sources in parallel
    const [
      symptomAssessments,
      milestoneAssessments,
      mchatAssessments,
      growthRecords,
      vaccinationRecords,
      vaccinationSchedules,
    ] = await Promise.all([
      SymptomAssessment.find({ babyId: babyMatch }).sort({ assessedAt: -1 }).limit(50),
      MilestoneAssessment.find({ babyId: babyMatch }).sort({ assessedAt: -1 }).limit(50),
      MchatAssessment.find({ babyId: babyMatch }).sort({ assessedAt: -1 }).limit(50),
      GrowthRecord.find({ babyId: babyMatch }).sort({ recordedAt: -1 }).limit(50),
      VaccinationRecord.find({ babyId: babyMatch }).sort({ administeredDate: -1 }).limit(50),
      VaccinationSchedule.find(),
    ]);

    const scheduleById = Object.fromEntries(
      vaccinationSchedules.map((s) => [s._id.toString(), s])
    );

    // Normalize to timeline events
    const events = [];

    symptomAssessments.forEach((a) =>
      events.push({
        id: a._id.toString(),
        type: 'symptom',
        label: 'Symptom Assessment',
        date: a.assessedAt,
        description: `Score ${a.totalScore} • Risk level: ${a.riskLevel}`,
        tags: [a.riskLevel.toLowerCase()],
        riskLevel: a.riskLevel,
      })
    );

    milestoneAssessments.forEach((a) =>
      events.push({
        id: a._id.toString(),
        type: 'milestone',
        label: 'Developmental Screening',
        date: a.assessedAt,
        description: `${a.percentAchieved}% achieved • ${a.totalDelays} delay(s) detected`,
        tags: ['milestones'],
      })
    );

    mchatAssessments.forEach((a) =>
      events.push({
        id: a._id.toString(),
        type: 'mchat',
        label: 'M-CHAT-R Screening',
        date: a.assessedAt,
        description: `Score ${a.totalRiskScore}/20 • Risk level: ${a.riskLevel}`,
        tags: ['autism screening', a.riskLevel.toLowerCase()],
        riskLevel: a.riskLevel,
      })
    );

    growthRecords.forEach((r) =>
      events.push({
        id: r._id.toString(),
        type: 'growth',
        label: 'Growth Record',
        date: r.recordedAt,
        description: `${r.weightKg} kg • ${r.heightCm} cm • ${r.headCircumferenceCm} cm head`,
        tags: ['growth'],
      })
    );

    vaccinationRecords.forEach((r) => {
      const schedule = scheduleById[r.vaccineScheduleId?.toString()];
      events.push({
        id: r._id.toString(),
        type: 'vaccination',
        label: schedule ? `Vaccination: ${schedule.vaccineName}` : 'Vaccination',
        date: r.administeredDate,
        description: schedule?.preventsDiseases
          ? `Prevents ${schedule.preventsDiseases}`
          : 'Vaccine administered',
        tags: ['vaccination'],
      });
    });

    // Sort chronologically, newest first
    events.sort((a, b) => new Date(b.date) - new Date(a.date));

    // ── Doctor Preview: summary from latest data ─────────────
    const latestGrowth = growthRecords[0] || null;
    const recentSymptom = symptomAssessments.find(
      (a) => a.riskLevel !== 'Green'
    ) || symptomAssessments[0] || null;

    const doctorPreview = {
      currentWeight: latestGrowth ? `${latestGrowth.weightKg} kg` : '—',
      currentHeight: latestGrowth ? `${latestGrowth.heightCm} cm` : '—',
      currentHead: latestGrowth ? `${latestGrowth.headCircumferenceCm} cm` : '—',
      recentSymptom: recentSymptom
        ? `Score ${recentSymptom.totalScore} (${recentSymptom.riskLevel})`
        : 'None',
      recentIllnessDate: recentSymptom ? recentSymptom.assessedAt : null,
      latestMchat: mchatAssessments[0]
        ? `${mchatAssessments[0].riskLevel} (${mchatAssessments[0].totalRiskScore}/20)`
        : 'Not screened',
    };

    // ── Notes for this baby (or all if no babyId) ────────────
    const notes = await BabyNote.find({
      userId: req.user._id,
      ...(req.query.babyId ? { babyId: req.query.babyId } : {}),
    })
      .sort({ createdAt: -1 })
      .limit(30);

    res.json({
      events,
      doctorPreview,
      notes: notes.map((n) => ({
        id: n._id.toString(),
        content: n.content,
        category: n.category,
        babyId: n.babyId ? n.babyId.toString() : null,
        createdAt: n.createdAt,
      })),
    });
  })
);

// ════════════════════════════════════════════════════════════
// POST /api/history/notes
// ════════════════════════════════════════════════════════════
router.post(
  '/notes',
  asyncHandler(async (req, res) => {
    const { content, category = 'General', babyId = null } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Note content is required' });
    }

    const note = await BabyNote.create({
      userId: req.user._id,
      babyId: babyId || null,
      content: content.trim(),
      category,
    });

    res.status(201).json({
      note: {
        id: note._id.toString(),
        content: note.content,
        category: note.category,
        babyId: note.babyId ? note.babyId.toString() : null,
        createdAt: note.createdAt,
      },
    });
  })
);

// ════════════════════════════════════════════════════════════
// DELETE /api/history/notes/:id
// ════════════════════════════════════════════════════════════
router.delete(
  '/notes/:id',
  asyncHandler(async (req, res) => {
    const note = await BabyNote.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    if (note.userId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await note.deleteOne();
    res.json({ success: true });
  })
);

export default router;