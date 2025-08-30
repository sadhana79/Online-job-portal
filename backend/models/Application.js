const { pool } = require('../config/db');

exports.findById = (id) => pool.query('SELECT * FROM applications WHERE id=?',[id]);

exports.getResumePath = (id) => pool.query('SELECT resume FROM applications WHERE id=?',[id]);

exports.forJob = (jobId) => pool.query(`
    SELECT a.*, u.name as user_name, u.email as user_email 
    FROM applications a JOIN users u ON u.id=a.user_id
    WHERE a.job_id=? ORDER BY a.created_at DESC`, [jobId]);

exports.mine = (userId) => pool.query(`
    SELECT a.*, j.title, j.category FROM applications a 
    JOIN jobs j ON j.id=a.job_id WHERE a.user_id=? ORDER BY a.created_at DESC`, [userId]);

exports.updateStatus = (id, status) => pool.query('UPDATE applications SET status=? WHERE id=?',[status,id]);

exports.create = (payload) => pool.query(
    'INSERT INTO applications (job_id,user_id,name,education,college,experience,skills,current_ctc,resume) VALUES (?,?,?,?,?,?,?,?,?)',
    [payload.job_id, payload.user_id, payload.name, payload.education, payload.college, payload.experience, payload.skills, payload.current_ctc, payload.resume]);
