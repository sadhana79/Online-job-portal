const { pool } = require('../config/db');
exports.create = (title, category, description, location, userId) =>
  pool.query('INSERT INTO jobs (title,category,description,location,created_by) VALUES (?,?,?,?,?)',
    [title,category,description,location,userId]);

exports.list = (sql, params) => pool.query(sql, params);

exports.findById = (id) => pool.query('SELECT * FROM jobs WHERE id=?',[id]);

exports.update = (id, title, category, description, location) =>
  pool.query('UPDATE jobs SET title=?, category=?, description=?, location=? WHERE id=?',[title,category,description,location,id]);
exports.remove = (id) => pool.query('DELETE FROM jobs WHERE id=?',[id]);
