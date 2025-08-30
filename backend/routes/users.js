const router = require('express').Router();
const { auth } = require('../middleware/auth');
const ctrl = require('../controllers/users');
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: (req,file,cb)=> cb(null, path.join(__dirname,'..','uploads','avatars')),
  filename: (req,file,cb)=> cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g,'_'))
});
const upload = multer({ storage });

router.get('/me', auth, ctrl.me);
router.post('/me', auth, upload.single('avatar'), ctrl.updateProfile);
router.get('/all', auth, ctrl.list);
module.exports = router;
