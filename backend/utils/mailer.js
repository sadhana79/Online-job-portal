const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendMail({to, subject, html}){
  if(!process.env.MAIL_USER || !process.env.MAIL_PASS){
    console.log('[MAIL MOCK]', {to, subject});
    return { ok: true, mock: true };
  }
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
  });
  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.MAIL_USER,
    to, subject, html
  });
  return { ok: true };
}

module.exports = { sendMail };
