const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = "MY_SECRET_KEY";  // keep same as auth.js


exports.signUp = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existing = await User.findOne({ where: { email } });
        if (existing) return res.status(400).json({ error: "Email already exists" });

        const hashed = await bcrypt.hash(password, 10);

        await User.create({ username, email, password: hashed });

        res.json({ message: "User created successfully" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Server error" });
    }
};
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ error: "Invalid email or password" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ error: "Invalid email or password" });

        //  UPDATED JWT PAYLOAD 
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                username: user.username,
                isPremium: user.isPremium     // REQUIRED
            },
            secretKey,
            { expiresIn: "24h" }
        );

        res.json({ message: "Login successful", token });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};