
const router = require('express').Router();
const { auth, role } = require('../middleware/auth');
const ctrl = require('../controllers/applications');
const upload = require('../middleware/upload');


router.post('/:jobId', auth, role('user'), upload.single('resume'), ctrl.apply);


router.get('/mine', auth, role('user'), ctrl.mine);


router.get('/job/:jobId', auth, role('hr'), ctrl.forJob);
router.get('/:id/resume', auth, role('hr'), ctrl.downloadResume);
router.patch('/:id/status', auth, role('hr'), ctrl.updateStatus);
router.post('/:id/schedule', auth, role('hr'), require('../controllers/interviews').scheduleForApplication);

router.get('/', auth, role('hr'), ctrl.forCategory);


router.put('/:id/status', auth, role('hr'), ctrl.updateStatus);
module.exports = router;
