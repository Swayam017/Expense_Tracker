const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;
const  User = require("../models/User");

exports.authenticate = async (req, res, next) => {
  try {
    let token = req.header("Authorization");   // 🔹 use let

    if (!token) {
      return res.status(401).json({ error: "Token missing" });
    }

    // 🔹 Strip "Bearer " if present
    if (token.startsWith("Bearer ")) {
      token = token.slice(7);
    }

    const decoded = jwt.verify(token, secretKey);

    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;
    next();

  } catch (err) {
    console.error("AUTH ERROR:", err.message);
    return res.status(401).json({ error: "Invalid token" });
  }
};

exports.isPremium = (req, res, next) => {
  if (!req.user.isPremium) {
    return res.status(403).json({ error: "Not a Premium User" });
  }
  next();
};
