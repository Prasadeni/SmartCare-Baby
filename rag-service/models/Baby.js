const mongoose = require("mongoose");

const babySchema = new mongoose.Schema(
  {
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    dateOfBirth: { type: Date, required: true },
    birthWeightKg: { type: Number },
    birthHeightCm: { type: Number },
    bloodGroup: { type: String, trim: true },
    profileImageUrl: { type: String, trim: true },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

// Convenience virtual: age in months (approximate)
babySchema.virtual("ageInMonths").get(function () {
  const now = new Date();
  const dob = this.dateOfBirth;
  return (
    (now.getFullYear() - dob.getFullYear()) * 12 +
    (now.getMonth() - dob.getMonth())
  );
});

babySchema.set("toJSON", { virtuals: true });
babySchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Baby", babySchema);
