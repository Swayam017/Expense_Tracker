const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const ForgotPassword = require("../models/ForgotPasswordRequest");

// ------------------ CREATE RESET LINK ------------------
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email required" });

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).json({ message: "User not found" });

  const request = await ForgotPassword.create({ UserId: user.id });

  const resetLink = `http://localhost:3000/password/reset/${request.id}`;

  console.log("RESET LINK:", resetLink);

  res.json({ message: "Reset link generated", resetLink });
});

// ------------------ LOAD RESET PAGE ------------------
router.get("/reset/:id", async (req, res) => {
  const record = await ForgotPassword.findOne({
    where: { id: req.params.id, isActive: true }
  });

  if (!record) return res.status(400).send("Invalid or expired link");

  res.sendFile("reset-password.html", { root: "public" });
});

// ------------------ UPDATE PASSWORD ------------------
router.post("/reset/:id", async (req, res) => {
  const { password } = req.body;

  const record = await ForgotPassword.findOne({
    where: { id: req.params.id, isActive: true }
  });

  if (!record) return res.status(400).json({ message: "Invalid or expired link" });

  const user = await User.findByPk(record.UserId);
  user.password = await bcrypt.hash(password, 10);
  await user.save();

  record.isActive = false;
  await record.save();

  res.json({ message: "Password updated successfully" });
});

module.exports = router;
