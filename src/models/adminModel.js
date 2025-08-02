const db = require('../../db');


exports.findByName = (aname) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM admin WHERE aname = ?";
    db.query(query, [aname], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};
