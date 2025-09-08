const { pool } = require('../config/db');

exports.create = (title, company_name, category, description, location, userId) =>
  pool.query(
    'INSERT INTO jobs (title, company_name, category, description, location, created_by) VALUES (?,?,?,?,?,?)',
    [title, company_name, category, description, location, userId]
  );

exports.list = (sql, params) => pool.query(sql, params);

exports.findById = (id) => pool.query('SELECT * FROM jobs WHERE id=?', [id]);

exports.update = (id, title, company_name, category, description, location) =>
  pool.query(
    'UPDATE jobs SET title=?, company_name=?, category=?, description=?, location=? WHERE id=?',
    [title, company_name, category, description, location, id]
  );

exports.remove = (id) => pool.query('DELETE FROM jobs WHERE id=?', [id]);
