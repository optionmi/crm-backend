const express = require("express");
const router = express.Router();

const authenticateUser = require("../../middleware/auth");

const { sendEmail } = require("../../controllers/Email/emailController");

router.post("/send-email", authenticateUser(), sendEmail);

module.exports = router;
