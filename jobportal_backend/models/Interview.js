const { pool } = require('../config/db');


exports.create = (payload) => {
  const { job_id, user_id, hr_id, company_name, address, location, schedule_time, mode, meet_link } = payload;
  const sql = `INSERT INTO interviews
    (job_id, user_id, hr_id, company_name, address, location, schedule_time, mode, meet_link, created_at)
    VALUES (?,?,?,?,?,?,?,?,?, NOW())`;
  return pool.query(sql, [job_id, user_id, hr_id, company_name, address, location, schedule_time, mode, meet_link]);
};


exports.findByUser = (user_id) => {
  const sql = `
    SELECT i.*,
           j.title AS job_title,
           j.company_name AS job_company,
           j.location AS job_location
    FROM interviews i
    JOIN jobs j ON j.id = i.job_id
    WHERE i.user_id = ?
    ORDER BY i.schedule_time DESC, i.id DESC
  `;
  return pool.query(sql, [user_id]);
};


exports.findByHr = (hr_id) => {
  const sql = `
    SELECT i.*,
           j.title AS job_title,
           j.company_name AS job_company,
           j.location AS job_location
    FROM interviews i
    JOIN jobs j ON j.id = i.job_id
    WHERE i.hr_id = ?
    ORDER BY i.schedule_time DESC, i.id DESC
  `;
  return pool.query(sql, [hr_id]);
};


exports.findById = (id) => pool.query('SELECT * FROM interviews WHERE id=?', [id]);
