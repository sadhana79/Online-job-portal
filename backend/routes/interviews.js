const router = require('express').Router();
const { auth, role } = require('../middleware/auth');
const ctrl = require('../controllers/interviews');
router.post('/schedule', auth, role('hr'), ctrl.schedule);
router.get('/calendar', auth, role('hr'), ctrl.calendar);
module.exports = router;
