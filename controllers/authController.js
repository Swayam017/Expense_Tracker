const User = require("../models/User");
const bcrypt = require("bcrypt");

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

        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        return res.json({ message: "Login successful" });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
};