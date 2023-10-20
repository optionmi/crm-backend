// email configuration
const nodemailer = require("nodemailer");

// Create a transporter object using SMTP
const transporter = nodemailer.createTransport({
    host: "localhost",
    port: 1025, // SMTP port (typically 587 for TLS, 465 for SSL)
    secure: false, // true for SSL, false for TLS
});

module.exports = transporter;
