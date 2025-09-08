const router = require('express').Router();
const ctrl = require('../controllers/contacts');
router.post('/', ctrl.create);
module.exports = router;
