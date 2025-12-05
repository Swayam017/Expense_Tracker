const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const { getPaymentPage, processPayment, getPaymentStatus } = require("../controllers/paymentController");

router.get("/", getPaymentPage);

// AUTH REQUIRED ONLY HERE
router.post("/pay", authenticate, processPayment);

// NO AUTH HERE (Cashfree cannot send JWT)
router.get("/payment-status", getPaymentStatus);

module.exports = router;
