const express = require("express");
const router = express.Router();
const {
    createQuote,
    getAllQuotes,
    deleteQuoteById,
    getQuoteById,
    updateQuoteById,
} = require("../../controllers/Quotes/quoteController");
const authenticateUser = require("../../middleware/auth");

router.post("/create", authenticateUser(), createQuote);
router.get("/all", authenticateUser(), getAllQuotes);
router.get("/:id", authenticateUser(), getQuoteById);
router.delete("/:id", authenticateUser(), deleteQuoteById);
router.put("/:id", authenticateUser(), updateQuoteById);

module.exports = router;
