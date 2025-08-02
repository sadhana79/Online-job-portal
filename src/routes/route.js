const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const adminController = require("../controllers/adminController");
const hrController = require("../controllers/hrController");
const jobController = require("../controllers/jobController");

// HR CRUD
router.post("/admin/users", hrController.createUser);
router.get("/admin/users", hrController.listUsers);
router.put("/admin/users/:id", hrController.updateUser);    
router.post("/admin/users/:id/delete", hrController.deleteUser);

// Auth
router.post("/user/register", userController.register);
router.post("/user/login", userController.login);
router.post("/admin/login", adminController.login);

router.post("/hr/jobs", jobController.createJob);
router.get("/hr/jobs", jobController.listJobs);
router.get("/hr/jobs/:id", jobController.getJobById);
router.put("/hr/jobs/:id", jobController.updateJob);
router.delete("/hr/jobs/:id/delete", jobController.deleteJob);
router.get("hr/jobs/search", jobController.searchJobs);

module.exports = router;