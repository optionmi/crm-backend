const express = require("express");
const router = express.Router();
const {
    createExpense,
    getAllExpenses,
} = require("../../controllers/Salespersons/travellingexpensesController");
const authenticateUser = require("../../middleware/auth");

router.post("/", authenticateUser(), createExpense);
router.get("/all", authenticateUser(), getAllExpenses);

module.exports = router;
