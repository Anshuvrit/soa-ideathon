const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

async function sendEmail({ to, subject, html }) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.log(`[email:dev-mode] to=${to} subject="${subject}"\n${html}`);
    return { devMode: true };
  }
  return transporter.sendMail({ from: `"SOA Ideathon TeamUp" <${process.env.GMAIL_USER}>`, to, subject, html });
}

async function sendOtpEmail(to, code) {
  return sendEmail({
    to,
    subject: 'Your SOA Ideathon TeamUp sign-in code',
    html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto">
      <h2 style="color:#1e3a8a">Your sign-in code</h2>
      <p>Enter this code to sign in:</p>
      <p style="font-size:32px;font-weight:bold;letter-spacing:6px;color:#2563eb">${code}</p>
      <p style="color:#6b7280;font-size:13px">Expires in 10 minutes.</p>
    </div>`,
  });
}

module.exports = { sendEmail, sendOtpEmail };