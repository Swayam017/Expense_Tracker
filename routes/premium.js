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
      attributes: [
        "id",
        "name",
        [
          Sequelize.fn("SUM", Sequelize.col("expenses.amount")),
          "totalSpent"
        ]
      ],
      include: [
        {
          model: Expense,
          attributes: [] // do not return full expense list
        }
      ],
      group: ["User.id"],               // group by user
      order: [[Sequelize.literal("totalSpent"), "DESC"]] // highest spender first
    });

    res.json({ success: true, leaderboard });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
