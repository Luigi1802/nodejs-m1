const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false, 
  from: process.env.BREVO_EMAIL, 
  auth: {
    user: process.env.BREVO_LOGIN, 
    pass: process.env.BREVO_API_KEY,
  },
});

module.exports.sendEmail = async (to, subject, text) => {
  await transporter.sendMail({
    from: `Lab Rental Service <${process.env.BREVO_EMAIL}>`,
    to,
    subject,
    text,
  });
};
