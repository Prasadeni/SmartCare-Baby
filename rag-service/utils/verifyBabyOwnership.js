const Baby = require("../models/Baby");

// Throws if the baby doesn't exist or doesn't belong to this parent.
// Used by nested-resource controllers (growth, symptoms, vaccinations, etc.)
// so one parent can never read or write another parent's baby data.
const verifyBabyOwnership = async (babyId, parentId) => {
  const baby = await Baby.findOne({ _id: babyId, parent: parentId });
  if (!baby) {
    const error = new Error("Baby profile not found or not authorized");
    error.statusCode = 404;
    throw error;
  }
  return baby;
};

module.exports = verifyBabyOwnership;
