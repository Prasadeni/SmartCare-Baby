/**
 * MaternalNote Model - SmartCare Baby
 * Stores personal parent reminders for doctor visits
 */

const mongoose = require('mongoose');

const maternalNoteSchema = new mongoose.Schema({
  baby_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Baby',
    required: true,
    index: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  note_text: {
    type: String,
    required: true,
    trim: true,
  },
  is_resolved: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

maternalNoteSchema.index({ baby_id: 1, createdAt: -1 });

module.exports = mongoose.models.MaternalNote || mongoose.model('MaternalNote', maternalNoteSchema);