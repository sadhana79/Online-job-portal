const db = require('../../db');

// Find user by email
exports.findByEmail = (uemail) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM jobseekers WHERE uemail = ?";
    db.query(query, [uemail], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// Create new user with all required fields
exports.create = (user) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO jobseekers 
      (uname, pass, contact, uemail, passoutyear, collegename, skills, experience)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [
        user.uname,
        user.pass,
        user.contact,
        user.uemail,
        user.passoutyear,
        user.collegename,
        user.skills,
        user.experience
      ],
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
};
