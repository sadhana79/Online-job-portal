const User = require("../models/userModel");

// Registration
exports.register = (req, res) => {
  const {
    uname,
    pass,
    contact,
    uemail,
    passoutyear,
    collegename,
    skills,
    experience,
  } = req.body;

  User.findByEmail(uemail)
    .then((result) => {
      if (result.length > 0) {
        return res.json({ message: "Email already registered." });
      }

      return User.create({
        uname,
        pass,
        contact,
        uemail,
        passoutyear,
        collegename,
        skills,
        experience,
      }).then(() => {
        return res.json({ message: "Registered successfully." });
      });
    })
    .catch((err) => {
      if (!res.headersSent) {
        res.status(500).json({ error: "Registration failed", details: err });
      }
    });
};

//Login (ADD THIS)
exports.login = (req, res) => {
  const { uemail, pass } = req.body;

  User.findByEmail(uemail)
    .then((result) => {
      if (result.length === 0) {
        return res.json({ message: "User not found." });
      }

      const user = result[0];
      if (user.pass !== pass) {
        return res.json({ message: "Invalid password." });
      }

      return res.json({ message: "Login successful" });
    })
    .catch((err) => {
      res.status(500).json({ error: "Login failed", details: err });
    });
};
