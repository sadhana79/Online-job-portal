const { pool } = require('../config/db');
const transporter = require('../utils/mailer');  // this is the transporter object

exports.create = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ msg: 'All fields required' });
  }

  try {
    
    await pool.query(
      'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)',
      [name, email, message]
    );

    let mailSent = false;
    try {
      await transporter.sendMail({
        from: process.env.FROM_EMAIL || process.env.SMTP_USER,
        to: email,
        subject: 'We received your message',
        html: `<p>Thanks <b>${name}</b>, we received your message and will reply soon.</p>`,
      });
      mailSent = true;
      console.log(" Contact mail sent to:", email);
    } catch (mailErr) {
      console.error(" Mail send failed:", mailErr.message);
    }

    res.json({ ok: true, mailSent });
  } catch (dbErr) {
    console.error(" DB insert failed:", dbErr.message);
    res.status(500).json({ msg: "Something went wrong, please try again later" });
  }
};
