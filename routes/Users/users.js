const express = require("express");
const router = express.Router();
const { searchUsers } = require("../../controllers/Users/usersController");
const authenticateUser = require("../../middleware/auth");

router.get("/", authenticateUser(), searchUsers);

module.exports = router;
