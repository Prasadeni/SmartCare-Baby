const express = require("express");
const { createBaby, getBabies } = require("../controllers/babyController");
const { protect } = require("../middleware/auth");
const assistantRoutes = require("../rag/assistantRoutes");

const router = express.Router();

router.use(protect);

router.route("/").post(createBaby).get(getBabies);

// The actual point of this project: POST /api/babies/:babyId/assistant/ask
router.use("/:babyId/assistant", assistantRoutes);

module.exports = router;
