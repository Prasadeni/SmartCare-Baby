const mongoose = require('mongoose');

const babySchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name:   { type: String, required: true },
  dob:    { type: Date,   required: true },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  birth_weight_kg: Number,
  birth_height_cm: Number,
  medical_notes:   String
}, { timestamps: true });

module.exports = mongoose.model('Baby', babySchema);