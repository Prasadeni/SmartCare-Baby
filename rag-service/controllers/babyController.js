const asyncHandler = require("express-async-handler");
const Baby = require("../models/Baby");

// @desc    Create a baby profile (minimal, just enough to test the assistant against)
// @route   POST /api/babies
// @access  Private
const createBaby = asyncHandler(async (req, res) => {
  const baby = await Baby.create({ ...req.body, parent: req.user._id });
  res.status(201).json(baby);
});

// @desc    List my babies
// @route   GET /api/babies
// @access  Private
const getBabies = asyncHandler(async (req, res) => {
  const babies = await Baby.find({ parent: req.user._id }).sort({ createdAt: -1 });
  res.json(babies);
});

module.exports = { createBaby, getBabies };
