const express = require("express");
const router = express.Router();
const { getReport } = require("../controllers/reportController");
const { authenticate } = require("../middleware/auth");

router.get("/", authenticate, getReport);

module.exports = router;
