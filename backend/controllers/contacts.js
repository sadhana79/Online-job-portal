const { pool } = require('../config/db');
const { sendMail } = require('../utils/mailer');

exports.create = async (req,res)=>{
  const { name, email, message } = req.body;
  if(!name || !email || !message) return res.status(400).json({msg:'All fields required'});
  await pool.query('INSERT INTO contacts (name,email,message) VALUES (?,?,?)',[name,email,message]);
  try{
    await sendMail({ to: email, subject:'We received your message', html:`<p>Thanks ${name}, we'll reply soon.</p>` });
  }catch(e){}
  res.json({ok:true});
};
