const Admin = require("../models/adminModel");

exports.login = (req, res) => {
  let { aname, pass } = req.body;

  let promise = Admin.findByName(aname);
  promise
    .then((result) => {
      if (result.length === 0) {
        res.json({ msg: "Admin not found" });
      } else {
        if (result[0].pass === pass) {
          res.json({ msg: "Login Successful" });
        } else {
          res.json({ msg: "Invalid Password" });
        }
      }
    })
    .catch((err) => {
      res.json({ msg: err });
    });
};
