const mongoose = require("mongoose");

const milestoneSchema = new mongoose.Schema(
  {
    baby: { type: mongoose.Schema.Types.ObjectId, ref: "Baby", required: true },
    category: {
      type: String,
      enum: ["motor", "cognitive", "language", "social", "other"],
      required: true,
    },
    title: { type: String, required: true, trim: true },
    expectedAgeMonths: { type: Number, required: true },
    achieved: { type: Boolean, default: false },
    achievedDate: { type: Date },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Milestone", milestoneSchema);
