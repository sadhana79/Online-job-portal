const { pool } = require('../config/db');
exports.findById = (id) => pool.query('SELECT id,name,email,contact,education,college,experience,skills,role,avatar,resume FROM users WHERE id=?',[id]);
exports.updateProfile = (id, fields) => {
  const { name, email, contact=null, education=null, college=null, experience=null, skills=null, avatar=null } = fields;
  const cols = [];
  const vals = [];
  if(name!=null){ cols.push('name=?'); vals.push(name); }
  if(email!=null){ cols.push('email=?'); vals.push(email); }
  if(contact!=null){ cols.push('contact=?'); vals.push(contact); }
  if(education!=null){ cols.push('education=?'); vals.push(education); }
  if(college!=null){ cols.push('college=?'); vals.push(college); }
  if(experience!=null){ cols.push('experience=?'); vals.push(experience); }
  if(skills!=null){ cols.push('skills=?'); vals.push(skills); }
  if(avatar!=null){ cols.push('avatar=?'); vals.push(avatar); }
  if(!cols.length) return Promise.resolve([[]]);
  vals.push(id);
  const sql = 'UPDATE users SET ' + cols.join(',') + ' WHERE id=?';
  return pool.query(sql, vals);
};
exports.listUsers = () => pool.query('SELECT id,name,email,role,avatar FROM users WHERE role="user" ORDER BY created_at DESC');
