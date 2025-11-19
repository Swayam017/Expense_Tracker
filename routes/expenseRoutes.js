const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expenseController");
const { authenticate } = require("../middleware/auth");

router.post("/", authenticate, expenseController.createExpense);
router.get("/", authenticate, expenseController.getExpenses);
router.delete("/:id", authenticate, expenseController.deleteExpense);
router.put("/:id", authenticate, expenseController.updateExpense);

module.exports = router;
