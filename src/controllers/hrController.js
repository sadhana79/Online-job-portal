const HR = require("../models/hrModel");

exports.createUser = (req, res) => {
  const { hname, email, hpass, contact } = req.body;

  console.log(">> Received data:", req.body);

  // Use model method instead of raw SQL
  HR.create({ hname, email, hpass, contact })
    .then(() => {
      res.status(201).json({ message: "HR user created successfully" });
    })
    .catch((err) => {
      console.error("Insert error:", err);
      res.status(500).json({ error: "Failed to create HR user" });
    });
};


// 📃 Get HR users (with pagination)
exports.listUsers = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  HR.countActive()
    .then((totalUsers) => {
      HR.listPaginated(limit, offset)
        .then((data) => {
          res.status(200).json({
            data,
            pagination: {
              currentPage: page,
              totalPages: Math.ceil(totalUsers / limit),
              totalUsers,
            },
          });
        })
        .catch((err) => {
          res.status(500).json({ error: "Unable to fetch HR users", details: err });
        });
    })
    .catch((err) => {
      res.status(500).json({ error: "Error counting users", details: err });
    });
};

// ❌ Delete HR user (soft delete)
exports.deleteUser = (req, res) => {
  const id = req.params.id;

  HR.findById(id)
    .then((result) => {
      if (result.length === 0) {
        return res.status(404).json({ error: "HR user not found" });
      }

      return HR.softDelete(id)
        .then(() => {
          res.status(200).json({ message: "HR user deleted successfully" });
        });
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to delete HR user", details: err });
    });
};
exports.updateUser = (req, res) => {
  const id = req.params.id;
  const { hname, email, contact } = req.body;

  const sql = "UPDATE hr SET hname = ?, email = ?, contact = ? WHERE hid = ? AND status = 'active'";

  const db = require("../../db"); // or wherever your DB is

  db.query(sql, [hname, email, contact, id], (err, result) => {
    if (err) {
      console.error("❌ Update failed:", err);
      res.status(500).json({ error: "Failed to update HR user" });
    } else {
      res.status(200).json({ message: "HR user updated successfully" });
    }
  });
};
