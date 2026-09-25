import express from 'express';
import Specialist from '../models/Specialist.js';
import SpecialtyMapping from '../models/SpecialtyMapping.js';
import { asyncHandler } from '../utils/helpers.js';

// ── Public list + detail router (mounted at /api/specialists) ─
export const specialistsListRouter = express.Router();

function toPublicSpecialist(s) {
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
    imageUrl: s.imageUrl,
  };
}

specialistsListRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const filter = { isActive: true };
    if (req.query.city) filter.city = new RegExp(`^${req.query.city}$`, 'i');
    if (req.query.specialty) filter.specialty = new RegExp(req.query.specialty, 'i');
    if (req.query.search) {
      const q = req.query.search;
      filter.$or = [
        { name: new RegExp(q, 'i') },
        { specialty: new RegExp(q, 'i') },
        { city: new RegExp(q, 'i') },
      ];
    }
    const list = await Specialist.find(filter).sort({ rating: -1 });
    res.json({ specialists: list.map(toPublicSpecialist) });
  })
);

specialistsListRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const s = await Specialist.findById(req.params.id);
    if (!s) return res.status(404).json({ message: 'Specialist not found' });
    res.json({ specialist: toPublicSpecialist(s) });
  })
);

// ── Mapping router (mounted at /api) ─────────────────────────
const mappingRouter = express.Router();

mappingRouter.get(
  '/specialty-mappings',
  asyncHandler(async (req, res) => {
    const mappings = await SpecialtyMapping.find({ isActive: true }).sort({ priority: 1 });
    res.json({
      mappings: mappings.map((m) => ({
        id: m._id.toString(),
        triggerCondition: m.triggerCondition,
        recommendedSpecialty: m.recommendedSpecialty,
        secondarySpecialty: m.secondarySpecialty,
        description: m.description,
        priority: m.priority,
      })),
    });
  })
);

export default mappingRouter;