const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");
const { authenticate } = require("../middleware/auth");

dotenv.config();
const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

router.get("/insights", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const expenses = await Expense.findAll({ where: { UserId: userId } });

    if (expenses.length === 0) {
      return res.json({ message: "No expenses found" });
    }

    // Prepare data for AI
    const expenseSummary = expenses.map(e => ({
      category: e.category,
      amount: e.amount,
      date: e.date
    }));

    const prompt = `
You are a financial assistant.
Analyze the following expense data and generate insights:

${JSON.stringify(expenseSummary)}

Give:
1. Highest spending category
2. Percentage comparison with last month
3. A short friendly financial advice
`;

       const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });

    console.log(response.text);
    res.json({ insight: response.text });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate insights" });
  }
});

module.exports = router;
