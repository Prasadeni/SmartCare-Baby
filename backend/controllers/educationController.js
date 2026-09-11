/**
 * Education Controller - SmartCare Baby
 * Powers the Learning Center page (Education tab)
 */

const EducationalContent = require('../models/EducationalContent');

// Categories shown in the UI (Explore by Category section)
const CATEGORIES = [
  {
    key: 'Baby Development',
    title: 'Baby Development',
    description: 'Milestones, growth charts & cognitive leaps.',
    icon: 'baby',
    color: '#DBEAFE',
  },
  {
    key: 'Nutrition',
    title: 'Nutrition',
    description: 'Feeding guides, solid foods & meal plans.',
    icon: 'nutrition',
    color: '#FCE7F3',
  },
  {
    key: 'Warning Signs',
    title: 'Warning Signs',
    description: 'When to call the doctor & symptom checker.',
    icon: 'warning',
    color: '#FEE2E2',
  },
];

// @desc    Get all categories for "Explore by Category"
// @route   GET /api/education/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    // Count articles per category (optional, for badges)
    const counts = await EducationalContent.aggregate([
      { $match: { is_active: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    const countMap = {};
    counts.forEach((c) => (countMap[c._id] = c.count));

    const categories = CATEGORIES.map((c) => ({
      ...c,
      article_count: countMap[c.key] || 0,
    }));

    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    console.error('[Education Categories Error]:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Search educational content
// @route   GET /api/education/search?q=sleep
// @access  Public
const searchContent = async (req, res) => {
  try {
    const { q, category, type } = req.query;
    const filter = { is_active: true };

    if (q) {
      // Case-insensitive search in title, body, category
      filter.$or = [
        { title: new RegExp(q, 'i') },
        { body: new RegExp(q, 'i') },
        { category: new RegExp(q, 'i') },
      ];
    }

    if (category) filter.category = category;
    if (type) filter.content_type = type;

    const results = await EducationalContent.find(filter)
      .sort({ published_date: -1 })
      .limit(50);

    res.status(200).json({ success: true, count: results.length, data: results });
  } catch (error) {
    console.error('[Education Search Error]:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get recommended articles for the current user
// @route   GET /api/education/recommended
// @access  Private (or Public — just pick latest)
const getRecommended = async (req, res) => {
  try {
    // Simple logic: return the 6 most recent active articles
    // Later you can personalize based on the baby's age
    const articles = await EducationalContent.find({ is_active: true })
      .sort({ published_date: -1 })
      .limit(6);

    res.status(200).json({ success: true, count: articles.length, data: articles });
  } catch (error) {
    console.error('[Education Recommended Error]:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get single article detail (for "Read More")
// @route   GET /api/education/article/:id
// @access  Public
const getArticleById = async (req, res) => {
  try {
    const article = await EducationalContent.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    res.status(200).json({ success: true, data: article });
  } catch (error) {
    console.error('[Get Article Error]:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get articles by category (e.g. Baby Development)
// @route   GET /api/education/category/:category
// @access  Public
const getByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const articles = await EducationalContent.find({
      is_active: true,
      category: new RegExp(category, 'i'),
    }).sort({ published_date: -1 });

    res.status(200).json({ success: true, count: articles.length, data: articles });
  } catch (error) {
    console.error('[Education By Category Error]:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  getCategories,
  searchContent,
  getRecommended,
  getArticleById,
  getByCategory,
};