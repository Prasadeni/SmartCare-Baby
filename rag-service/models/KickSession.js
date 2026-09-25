const mongoose = require("mongoose");

const kickSessionSchema = new mongoose.Schema(
  {
    baby: { type: mongoose.Schema.Types.ObjectId, ref: "Baby", required: true },
    count: { type: Number, required: true, min: 0 },
    durationSeconds: { type: Number, required: true, min: 0 },
    // Optional: timestamp of each individual kick within the session,
    // useful later for spacing/pattern analysis. Frontend doesn't send
    // this yet, but the field is ready for when it does.
    kickTimestamps: [{ type: Date }],
    startedAt: { type: Date, required: true },
    endedAt: { type: Date, required: true },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

kickSessionSchema.index({ baby: 1, startedAt: -1 });

module.exports = mongoose.model("KickSession", kickSessionSchema);
