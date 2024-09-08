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

router.post("/create", authenticateUser(["publisher"]), createBook);
router.get("/", authenticateUser(["publisher"]), searchBooksByName);
router.get("/all", authenticateUser(), getAllBooks);
router.get("/:id", authenticateUser(), getBookById);
router.put("/:id", authenticateUser(["publisher"]), updateBook);
router.delete("/:id", authenticateUser(["publisher"]), deleteBook);

module.exports = router;
