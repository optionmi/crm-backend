const express = require("express");
const router = express.Router();

const authenticateUser = require("../../middleware/auth");

const {
    sendEmail,
    emailNotifications,
    getEmailById,
    getAllEmails,
    getSentEmails,
    deleteEmailById,
} = require("../../controllers/Email/emailController");

router.post("/send-email", authenticateUser(), sendEmail);
router.get("/email-notifications", authenticateUser(), emailNotifications);
router.get("/all", authenticateUser(), getAllEmails);
router.get("/sent-emails", authenticateUser(), getSentEmails);
router.get("/get-email/:id", authenticateUser(), getEmailById);
router.delete("/:id", authenticateUser(), deleteEmailById);

module.exports = router;
