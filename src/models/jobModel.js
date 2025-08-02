const db = require("../../db");

exports.create = (job) => {
  const query = `
    INSERT INTO jobs (company_name, title, description, location, salary, job_type, hid)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  return new Promise((resolve, reject) => {
    db.query(query, [
      job.company_name,
      job.title,
      job.description,
      job.location,
      job.salary,
      job.job_type,
      job.hid
    ], (err, result) => {
      if (err) reject(err);
      else resolve(result.insertId);
    });
  });
};

exports.listPaginated = (limit, offset) => {
  const query = `
    SELECT * FROM jobs ORDER BY jid DESC LIMIT ? OFFSET ?
  `;
  return new Promise((resolve, reject) => {
    db.query(query, [limit, offset], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

exports.count = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT COUNT(*) AS total FROM jobs", (err, result) => {
      if (err) reject(err);
      else resolve(result[0].total);
    });
  });
};

exports.findById = (id) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM jobs WHERE jid = ?", [id], (err, result) => {
      if (err) reject(err);
      else resolve(result[0]);
    });
  });
};

exports.update = (id, job) => {
  const query = `
    UPDATE jobs
    SET company_name = ?, title = ?, description = ?, location = ?, salary = ?, job_type = ?
    WHERE jid = ?
  `;
  return new Promise((resolve, reject) => {
    db.query(query, [
      job.company_name,
      job.title,
      job.description,
      job.location,
      job.salary,
      job.job_type,
      id
    ], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

exports.delete = (id) => {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM jobs WHERE jid = ?", [id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};



exports.searchByTitle = (title) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM jobs WHERE title LIKE ?", [`%${title}%`], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};
