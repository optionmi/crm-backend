const express = require("express");
const router = express.Router();
const authenticateUser = require("../../middleware/auth");
const {
    createBoard,
    getBoardById,
    updateBoard,
    getAllBoards,
    deleteBoard,
} = require("../../controllers/Publishers/boardsController");

router.post("/create", authenticateUser(), createBoard);
router.get("/all", authenticateUser(), getAllBoards);
router.get("/:id", authenticateUser(), getBoardById);
router.put("/:id", authenticateUser(), updateBoard);
router.delete("/:id", authenticateUser(), deleteBoard);

module.exports = router;
