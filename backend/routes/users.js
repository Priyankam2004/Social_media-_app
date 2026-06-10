const router = require('express').Router();
const auth = require('../middleware/auth');
const upload = require('../config/multer');
const { getMe, updateProfile } = require('../controllers/userController');

router.get('/me', auth, getMe);
router.put('/profile', auth, upload.single('profilePic'), updateProfile);

module.exports = router;
