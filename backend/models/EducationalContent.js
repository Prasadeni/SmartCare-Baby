/**
 * EducationalContent Model - SmartCare Baby
 * Stores articles, video guides, infographics, and care resources for home dashboard
 */

const mongoose = require('mongoose');

const educationalContentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  content_type: {
    type: String,
    enum: ['Article', 'Video', 'Infographic', 'Guide'],
    default: 'Article',
    required: true,
  },
  body: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    trim: true,
    default: 'General Health',
  },
  author: {
    type: String,
    trim: true,
    default: 'SmartCare Health Team',
  },
  image_url: {
    type: String,
    trim: true,
    default: '',
  },
  video_url: {
    type: String,
    trim: true,
    default: '',
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  published_date: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

educationalContentSchema.index({ is_active: 1, published_date: -1 });

const EducationalContent = mongoose.models.EducationalContent || mongoose.model('EducationalContent', educationalContentSchema);

module.exports = EducationalContent;