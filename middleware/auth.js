const jwt = require("jsonwebtoken");
const User = require("../models/User");

const secretKey = process.env.JWT_SECRET;

// ================= AUTHENTICATE =================
exports.authenticate = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({ error: "Token missing" });
    }

    // Remove "Bearer " if present
    if (token.startsWith("Bearer ")) {
      token = token.slice(7);
    }

    // Verify token
    const decoded = jwt.verify(token, secretKey);

    // 🔥 FIX: Sequelize → Mongoose
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Attach user to request
    req.user = user;

    next();

  } catch (err) {
    console.error("AUTH ERROR:", err.message);
    return res.status(401).json({ error: "Invalid token" });
  }
};


// ================= PREMIUM CHECK =================
exports.isPremium = (req, res, next) => {
  if (!req.user || !req.user.isPremium) {
    return res.status(403).json({ error: "Not a Premium User" });
  }
  next();
};