const mongoose = require("mongoose");

const growthRecordSchema = new mongoose.Schema(
  {
    baby: { type: mongoose.Schema.Types.ObjectId, ref: "Baby", required: true },
    date: { type: Date, required: true, default: Date.now },
    weightKg: { type: Number, required: true },
    heightCm: { type: Number, required: true },
    headCircumferenceCm: { type: Number },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

growthRecordSchema.index({ baby: 1, date: 1 });

module.exports = mongoose.model("GrowthRecord", growthRecordSchema);
