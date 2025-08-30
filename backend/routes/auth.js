const router = require('express').Router();
const { register, login, resetPassword } = require('../controllers/auth');
router.post('/register', register);
router.post('/login', login);
router.post('/reset', resetPassword);
module.exports = router;
