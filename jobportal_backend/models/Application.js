
const { pool } = require('../config/db');


exports.create = (payload) => {
  const { job_id, user_id, name, education, college, experience, skills, current_ctc, resume } = payload;
  const sql = `INSERT INTO applications
    (job_id, user_id, name, education, college, experience, skills, current_ctc, resume)
    VALUES (?,?,?,?,?,?,?,?,?)`;
  return pool.query(sql, [job_id, user_id, name, education, college, experience, skills, current_ctc, resume]);
};


exports.findById = (id) => pool.query('SELECT * FROM applications WHERE id=?',[id]);


exports.getResumePath = (id) => pool.query('SELECT resume FROM applications WHERE id=?',[id]);


exports.forJob = (jobId) => pool.query(`
  SELECT a.*, u.name as user_name, u.email as user_email 
  FROM applications a 
  JOIN users u ON u.id = a.user_id
  WHERE a.job_id = ?
  ORDER BY a.created_at DESC
`, [jobId]);


exports.mine = (userId) => pool.query(`
  SELECT a.*, j.title, j.category,j.company_name 
  FROM applications a 
  JOIN jobs j ON j.id = a.job_id 
  WHERE a.user_id = ? 
  ORDER BY a.created_at DESC
`, [userId]);


exports.updateStatus = (id, status) => pool.query('UPDATE applications SET status=? WHERE id=?',[status,id]);


exports.forCategory = (category) => {
  
  const base = `
    SELECT a.*, 
           u.name  AS user_name, u.email AS user_email, u.contact,
           j.title AS job_title, j.category AS job_category
    FROM applications a
    JOIN users u ON u.id = a.user_id
    JOIN jobs  j ON j.id = a.job_id
  `;
  if (!category || category.toLowerCase() === 'all') {
    return pool.query(base + ' ORDER BY a.created_at DESC');
  }
  return pool.query(base + ' WHERE j.category = ? ORDER BY a.created_at DESC', [category]);
};
