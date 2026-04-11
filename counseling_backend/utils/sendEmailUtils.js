const nodemailer = require("nodemailer");

async function sendEmailUtils(to, subject, text) {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            text: text,
        };
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully!");
    }
    catch (error) {
        console.log("Email sending failed:", error);
        throw error;
    }
}

module.exports = sendEmailUtils;