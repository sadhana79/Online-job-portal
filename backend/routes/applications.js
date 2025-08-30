
const router = require('express').Router();
const { auth, role } = require('../middleware/auth');
const ctrl = require('../controllers/applications');
const upload = require('../middleware/upload');

// user submit application (with resume)
router.post('/:jobId', auth, role('user'), upload.single('resume'), ctrl.apply);

// user: list own applied jobs
router.get('/mine', auth, role('user'), ctrl.mine);

// HR: list applications for a job & download resume & update status
router.get('/job/:jobId', auth, role('hr'), ctrl.forJob);
router.get('/:id/resume', auth, role('hr'), ctrl.downloadResume);
router.patch('/:id/status', auth, role('hr'), ctrl.updateStatus);

module.exports = router;
