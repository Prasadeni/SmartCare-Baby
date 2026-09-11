/**
 * Clinic Model - SmartCare Baby
 * Stores nearby clinic/hospital info for the map section
 */

const mongoose = require('mongoose');

const clinicSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  status: {
    type: String,
    enum: ['OPEN', 'CLOSED'],
    default: 'CLOSED',
  },
  distance_km: { type: Number, default: 0 },
  drive_time_min: { type: Number, default: 0 },
  address: { type: String, required: true },
  phone: { type: String, default: '' },
  latitude: { type: Number },
  longitude: { type: Number },
  map_url: { type: String, default: '' },
  is_active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.models.Clinic || mongoose.model('Clinic', clinicSchema);