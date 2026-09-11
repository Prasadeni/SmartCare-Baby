/**
 * Education Routes - SmartCare Baby
 */

const express = require('express');
const router = express.Router();

const {
  getCategories,
  searchContent,
  getRecommended,
  getArticleById,
  getByCategory,
} = require('../controllers/educationController');

// IMPORTANT: specific routes before :id routes
router.get('/education/categories', getCategories);
router.get('/education/search', searchContent);
router.get('/education/recommended', getRecommended);
router.get('/education/category/:category', getByCategory);
router.get('/education/article/:id', getArticleById);

module.exports = router;