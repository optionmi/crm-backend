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

const emailNotifications = async (req, res) => {
    // console.log(req.user);
    try {
        const emails = await prisma.lead_emails.findMany({
            where: { to: req.user.email, status: "UNREAD" },
        });
        return res.status(200).json({ emails });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
};

// const updateEmailStatus = async (req, res) => {
//     const { id, status } = req.body;

// }

const getEmailById = async (req, res) => {
    const { id } = req.params;
    const userEmail = req.user.email;

    // Parse the id to an integer and handle possible errors
    let parsedId;
    try {
        parsedId = parseInt(id);
        if (isNaN(parsedId)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }

    try {
        let email = await prisma.lead_emails.findUnique({
            where: { id: parsedId },
            include: { user: true },
        });

        if (email.to === userEmail) {
            email = await prisma.lead_emails.update({
                where: { id: parsedId },
                data: {
                    status: "READ",
                },
                include: { user: true },
            });
        }

        return res.status(200).json({ email });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
};

const getAllEmails = async (req, res) => {
    const userEmail = req.user.email;
    try {
        const emails = await prisma.lead_emails.findMany({
            where: { to: userEmail },
            include: { user: true },
        });
        return res.status(200).json({ emails });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
};

const getSentEmails = async (req, res) => {
    const userId = req.user.id;
    try {
        const emails = await prisma.lead_emails.findMany({
            where: { user_id: userId },
            include: { user: true },
        });
        return res.status(200).json({ emails });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
};

const deleteEmailById = async (req, res) => {
    const { id } = req.params;

    // Parse the id to an integer and handle possible errors
    let parsedId;
    try {
        parsedId = parseInt(id);
        if (isNaN(parsedId)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }

    try {
        const email = await prisma.lead_emails.delete({
            where: { id: parsedId },
        });
        return res
            .status(200)
            .json({ message: "Email deleted successfully", email });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    sendEmail,
    emailNotifications,
    getEmailById,
    getAllEmails,
    getSentEmails,
    deleteEmailById,
};
