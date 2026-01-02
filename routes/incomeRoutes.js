const express = require("express");
const router = express.Router();
const incomeController = require("../controllers/incomeController");
const { authenticate } = require("../middleware/auth");

router.post("/", authenticate, incomeController.createIncome);
router.get("/", authenticate, incomeController.getIncome);
router.delete("/:id", authenticate, incomeController.deleteIncome);
router.put("/:id", authenticate, incomeController.updateIncome);

module.exports = router;

