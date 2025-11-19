const jwt = require("jsonwebtoken");
const secretKey = "MY_SECRET_KEY";

exports.authenticate = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "Token missing" });

    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
