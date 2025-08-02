const db = require("../../db");

exports.create = (hr) => {
  return new Promise((resolve, reject) => {
    const query = "INSERT INTO hr (hname, email, hpass, contact) VALUES (?, ?, ?, ?)";
    db.query(query, [hr.hname, hr.email, hr.hpass, hr.contact], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

exports.findByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM hr WHERE email = ?";
    db.query(query, [email], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

exports.listPaginated = (limit, offset) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT hid, hname, email, contact, created_at 
      FROM hr 
      WHERE status = 'active'
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
    db.query(query, [limit, offset], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

exports.countActive = () => {
  return new Promise((resolve, reject) => {
    const query = "SELECT COUNT(*) AS total FROM hr WHERE status = 'active'";
    db.query(query, (err, result) => {
      if (err) reject(err);
      else resolve(result[0].total);
    });
  });
};

exports.softDelete = (id) => {
  return new Promise((resolve, reject) => {
    const query = "UPDATE hr SET status = 'deleted' WHERE hid = ?";
    db.query(query, [id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

exports.findById = (id) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM hr WHERE hid = ?";
    db.query(query, [id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};
