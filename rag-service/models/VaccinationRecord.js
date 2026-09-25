const mongoose = require("mongoose");

const vaccinationRecordSchema = new mongoose.Schema(
  {
    baby: { type: mongoose.Schema.Types.ObjectId, ref: "Baby", required: true },
    vaccineName: { type: String, required: true, trim: true },
    doseNumber: { type: Number, required: true, default: 1 },
    dueDate: { type: Date, required: true },
    administeredDate: { type: Date },
    status: {
      type: String,
      enum: ["upcoming", "due", "overdue", "completed"],
      default: "upcoming",
    },
    administeredBy: { type: String, trim: true },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

vaccinationRecordSchema.index({ baby: 1, dueDate: 1 });

module.exports = mongoose.model("VaccinationRecord", vaccinationRecordSchema);
