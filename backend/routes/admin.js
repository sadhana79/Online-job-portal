const router = require('express').Router();
const { auth, role } = require('../middleware/auth');
const ctrl = require('../controllers/admin');

// HR Routes
router.post('/hr', auth, role('admin'), ctrl.addHR);
router.get('/hrs', auth, role('admin'), ctrl.hrs);
router.get('/hr/:id', auth, role('admin'), ctrl.getHR);
router.put('/hr/:id', auth, role('admin'), ctrl.updateHR);
router.delete('/hr/:id', auth, role('admin'), ctrl.removeHR);

// User Routes
router.post('/user', auth, role('admin'), ctrl.addUser); 
 // Add this route for user creation
 
router.get('/users', auth, role('admin'), ctrl.users);
router.put('/user/:id', auth, role('admin'), ctrl.updateUser);
router.delete('/user/:id', auth, role('admin'), ctrl.removeUser);

// Stats Route
router.get('/stats', auth, role('admin', 'hr'), ctrl.stats);

module.exports = router;
