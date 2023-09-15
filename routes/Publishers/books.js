const express = require("express");
const router = express.Router();
const authenticateUser = require("../../middleware/auth");
const {
    createBook,
    getBookById,
    updateBook,
    getAllBooks,
    deleteBook,
    searchBooksByName,
} = require("../../controllers/Publishers/booksController");

router.post("/create", authenticateUser(), createBook);
router.get("/", authenticateUser(), searchBooksByName);
router.get("/all", authenticateUser(), getAllBooks);
router.get("/:id", authenticateUser(), getBookById);
router.put("/:id", authenticateUser(), updateBook);
router.delete("/:id", authenticateUser(), deleteBook);

module.exports = router;
