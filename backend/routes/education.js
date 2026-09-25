import express from 'express';
import EducationArticle from '../models/EducationArticle.js';
import { asyncHandler } from '../utils/helpers.js';

const router = express.Router();

function toPublic(a) {
  return {
    id: a._id.toString(),
    title: a.title,
    contentType: a.contentType,
    body: a.body,
    category: a.category,
    author: a.author,
    imageUrl: a.imageUrl,
    videoUrl: a.videoUrl,
    publishedDate: a.publishedDate,
  };
}

// GET /api/education/categories
router.get(
  '/categories',
  asyncHandler(async (req, res) => {
    const cats = await EducationArticle.distinct('category', { isActive: true });
    res.json({ categories: cats.sort() });
  })
);

// GET /api/education?category=Nutrition
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const filter = { isActive: true };
    if (req.query.category) filter.category = req.query.category;
    const list = await EducationArticle.find(filter).sort({ publishedDate: -1 });
    res.json({ articles: list.map(toPublic) });
  })
);

// GET /api/education/:id
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const a = await EducationArticle.findById(req.params.id);
    if (!a || !a.isActive) return res.status(404).json({ message: 'Article not found' });
    res.json({ article: toPublic(a) });
  })
);

export default router;