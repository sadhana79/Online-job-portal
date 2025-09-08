const router = require('express').Router();
const { auth, role } = require('../middleware/auth');
const ctrl = require('../controllers/interviews');


router.post('/applications/:id/schedule', auth, role('hr'), ctrl.scheduleForApplication);


router.get('/me', auth, ctrl.getForMe);

module.exports = router;
