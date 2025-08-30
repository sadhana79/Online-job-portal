const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

function fail(res, code, msg){ return res.status(code).json({ ok:false, msg }) }

exports.register = (req,res)=>{
  const { name, email, password, role, contact, education, college, experience, skills } = req.body;
  if(!name || !email || !password) return fail(res,400,'All fields are required');
  const pass = String(password||'');
  const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/.test(pass);
  if(!strong) return fail(res,400,'Password needs upper, lower, number, symbol, 6+ chars');
  pool.query('SELECT id FROM users WHERE email=?',[email])
    .then(([exists])=>{
      if(exists.length) return fail(res,400,'Email already registered');
      return bcrypt.hash(pass, 10)
        .then(hash=> pool.query(
          'INSERT INTO users (name,email,contact,education,college,experience,skills,password,role) VALUES (?,?,?,?,?,?,?,?,?)',
          [name,email,contact||null,education||null,college||null,experience||null,skills||null,hash, role||'user']
        ))
        .then(()=> res.json({ ok:true }));
    })
    .catch(e=>{ console.error(e); res.status(500).json({msg:'Server error'}); });
};

exports.login = (req,res)=>{
  const { email, password } = req.body;
  if(!email || !password) return fail(res,400,'Email and password required');
  pool.query('SELECT * FROM users WHERE email=?',[email])
    .then(([rows])=>{
      if(!rows.length) return fail(res,400,'Invalid credentials');
      const user = rows[0];
      return require('bcryptjs').compare(password, user.password)
        .then(ok=>{
          if(!ok) return fail(res,400,'Invalid credentials');
          const token = jwt.sign({ id:user.id, role:user.role, name:user.name }, process.env.JWT_SECRET || 'supersecretkey', { expiresIn:'7d' });
          const sanitized = { id:user.id, name:user.name, email:user.email, role:user.role, avatar:user.avatar||'assets/default-avatar.png', resume:user.resume };
          return res.json({ ok:true, token, user: sanitized });
        });
    })
    .catch(e=>{ console.error(e); res.status(500).json({msg:'Server error'}); });
};

exports.resetPassword = (req,res)=>{
  const { email, newPassword } = req.body;
  if(!email || !newPassword) return fail(res,400,'Email and new password required');
  const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/.test(String(newPassword));
  if(!strong) return fail(res,400,'Weak password');
  require('bcryptjs').hash(newPassword, 10)
    .then(hash=> pool.query('UPDATE users SET password=? WHERE email=?',[hash,email]))
    .then(([result])=>{
      if(result.affectedRows===0) return fail(res,404,'Email not found');
      res.json({ ok:true });
    })
    .catch(e=>{ console.error(e); res.status(500).json({msg:'Server error'}); });
};
