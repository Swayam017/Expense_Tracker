const express = require("express");
const router = express.Router();
const { User, Expense } = require("../models");
const Sequelize = require("sequelize");

// Middlewares
const { authenticate, isPremium } = require("../middleware/auth");

// ⭐ PREMIUM LEADERBOARD ROUTE
router.get("/leaderboard", authenticate, isPremium, async (req, res) => {
  try {
    const leaderboard = await User.findAll({
      attributes: ["id", "username", "totalSpent"],
      order: [["totalSpent", "DESC"]]
    });

    res.json({ success: true, leaderboard });

  } catch (err) {
    console.error("LEADERBOARD ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


module.exports = router;
