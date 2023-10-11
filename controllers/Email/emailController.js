const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const transporter = require("../../config/email");

const sendEmail = async (req, res) => {
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

    transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Email could not be sent.",
            });
        } else {
            const saveEmail = await prisma.lead_emails.create({
                data: {
                    lead: { connect: { id: parseInt(leadID) } },
                    user: { connect: { id: parseInt(req.user.id) } },
                    to,
                    subject,
                    message,
                },
            });

            console.log("Email sent:", info.response);
            res.status(200).json({
                success: true,
                message: "Email sent successfully.",
            });
        }
    });
};

module.exports = { sendEmail };
