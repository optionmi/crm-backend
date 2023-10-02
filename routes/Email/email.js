const express = require("express");
const router = express.Router();

const transporter = require("../../config/email");
const authenticateUser = require("../../middleware/auth");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/send-email", authenticateUser(), async (req, res) => {
    const { to, subject, message, leadID } = req.body;

    if (!to || !subject || !message) {
        return res.status(400).json({
            success: false,
            message: "All fields are required.",
        });
    }

    const mailOptions = {
        from: req.user.email,
        to,
        subject,
        html: message,
    };

    const saveEmail = await prisma.lead_emails.create({
        data: {
            lead: { connect: { id: parseInt(leadID) } },
            user: { connect: { id: parseInt(req.user.id) } },
            to,
            subject,
            message,
        },
    });

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Email could not be sent.",
            });
        } else {
            console.log("Email sent:", info.response);
            res.status(200).json({
                success: true,
                message: "Email sent successfully.",
            });
        }
    });
});
module.exports = router;
