
const { pool } = require('../config/db');
const { sendMail } = require('../utils/mailer');

exports.schedule = async (req,res)=>{
  try{
    const { company_name, address, location, schedule_time, job_id, user_id } = req.body;
    await pool.query('INSERT INTO interviews (job_id,user_id,hr_id,company_name,address,location,schedule_time) VALUES (?,?,?,?,?,?,?)',
      [job_id, user_id, req.user.id, company_name, address, location, schedule_time]);
    const [[user]] = await pool.query('SELECT email, name FROM users WHERE id=?',[user_id]);
    await sendMail({
      to: user.email,
      subject: 'Interview Scheduled - ' + company_name,
      html: `<p>Hi ${user.name},</p>
             <p>Your interview is scheduled on <b>${schedule_time}</b> at <b>${location}</b> (${address}) with <b>${company_name}</b>.</p>`
    });
    res.json({ok:true});
  }catch(e){ console.error(e); res.status(500).json({msg:'Server error'}); }
};

exports.calendar = async (req,res)=>{
  const [rows] = await pool.query('SELECT * FROM interviews WHERE hr_id=? ORDER BY schedule_time DESC',[req.user.id]);
  res.json(rows);
};
