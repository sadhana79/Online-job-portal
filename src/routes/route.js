const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const adminController = require("../controllers/adminController");
const hrController = require("../controllers/hrController");

// HR CRUD
router.post("/admin/users", hrController.createUser);
router.get("/admin/users", hrController.listUsers);
router.put("/admin/users/:id", hrController.updateUser);    
router.post("/admin/users/:id/delete", hrController.deleteUser);

// Auth
router.post("/user/register", userController.register);
router.post("/user/login", userController.login);
router.post("/admin/login", adminController.login);

module.exports = router;
