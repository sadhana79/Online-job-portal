const Interview = require('../models/Interview');
const App = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const mailer = require('../utils/mailer');


exports.scheduleForApplication = async (req, res) => {
  try {
    const appId = parseInt(req.params.id, 10);
    const { mode, meet_link = null, address = null, schedule_time } = req.body;

    if (!appId || !schedule_time || !mode) {
      return res.status(400).json({ msg: 'Required fields missing' });
    }

    
    const [apps] = await App.findById(appId);
    if (!apps || !apps.length) return res.status(404).json({ msg: 'Application not found' });
    const application = apps[0];

    const job_id = application.job_id;
    const user_id = application.user_id;
    const hr_id = req.user.id;

    
    const [[job]] = await Job.findById(job_id);
    if (!job) return res.status(404).json({ msg: 'Job not found' });

    const company_name = job.company_name;
    const location = job.location;

    
    await Interview.create({
      job_id,
      user_id,
      hr_id,
      company_name,
      address,
      location,
      schedule_time,
      mode,
      meet_link
    });

  
    await App.updateStatus(appId, "scheduled");

    
    const [[user]] = await User.findById(user_id);

    if (user && user.email) {
      const subject = `Interview Scheduled: ${job.title}`;
      const whenStr = new Date(schedule_time).toLocaleString();

      let extraInfo = '';
      if (mode === 'online' && meet_link) {
        extraInfo = `<tr><td><strong>Meet Link</strong></td><td><a href="${meet_link}">${meet_link}</a></td></tr>`;
      }
      if (mode === 'offline' && address) {
        extraInfo = `<tr><td><strong>Address</strong></td><td>${address}</td></tr>`;
      }

      const html = `
        <div style="font-family: Arial, sans-serif">
          <h2>Interview Scheduled</h2>
          <p>Hi ${user.name || ''},</p>
          <p>Your interview has been scheduled.</p>
          <table cellpadding="6" style="border-collapse: collapse">
            <tr><td><strong>Company</strong></td><td>${company_name}</td></tr>
            <tr><td><strong>Job</strong></td><td>${job.title}</td></tr>
            <tr><td><strong>When</strong></td><td>${whenStr}</td></tr>
            <tr><td><strong>Mode</strong></td><td>${mode}</td></tr>
            ${extraInfo}
          </table>
          <p>Please be on time.</p>
          <p>Good luck!</p>
          <p>Regards,<br/>HR Team</p>
        </div>
      `;
      try {
        await mailer.sendMail({
          from: process.env.SMTP_USER,
          to: user.email,
          subject: subject,
          html: html
        });
      } catch (e) {
        console.error('Email send failed:', e.message);
      }
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
};


exports.getForMe = async (req, res) => {
  try {
    const user_id = req.user.id;
    const [rows] = await Interview.findByUser(user_id);
    res.json(rows || []);
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: 'Server error' });
  }
};
