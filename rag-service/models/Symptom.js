const mongoose = require("mongoose");

const symptomSchema = new mongoose.Schema(
  {
    baby: { type: mongoose.Schema.Types.ObjectId, ref: "Baby", required: true },
    date: { type: Date, required: true, default: Date.now },
    type: {
      type: String,
      enum: [
        "fever",
        "cough",
        "rash",
        "vomiting",
        "diarrhea",
        "poor_feeding",
        "irritability",
        "breathing_difficulty",
        "other",
      ],
      required: true,
    },
    severity: {
      type: String,
      enum: ["mild", "moderate", "severe"],
      default: "mild",
    },
    temperatureCelsius: { type: Number },
    description: { type: String, trim: true },
    resolved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Symptom", symptomSchema);
