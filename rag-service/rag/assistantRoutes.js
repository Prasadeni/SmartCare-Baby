const express = require("express");
const { askGeneric } = require("./assistantGenericController");

const router = express.Router();
router.post("/ask", askGeneric);

module.exports = router;