const router = require('express').Router();
const { auth, role } = require('../middleware/auth');
const ctrl = require('../controllers/admin');


router.post('/hr', auth, role('admin'), ctrl.addHR);
router.get('/hrs', auth, role('admin'), ctrl.hrs);
router.get('/hr/:id', auth, role('admin'), ctrl.getHR);
router.put('/hr/:id', auth, role('admin'), ctrl.updateHR);
router.delete('/hr/:id', auth, role('admin'), ctrl.removeHR);


router.post('/user', auth, role('admin'), ctrl.addUser);
router.get('/user/:id', auth, role('admin'), ctrl.getUser); 
 
 
router.get('/users', auth, role('admin'), ctrl.users);
router.put('/user/:id', auth, role('admin'), ctrl.updateUser);
router.delete('/user/:id', auth, role('admin'), ctrl.removeUser);

router.get('/applications', auth, role('admin'), ctrl.allApplications);


router.get('/stats', auth, role('admin', 'hr'), ctrl.stats);

module.exports = router;
