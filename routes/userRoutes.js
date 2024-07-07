const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const rateLimit = require('../middleware/rateLimit');

router.post('/register', rateLimit, userController.register);
router.post('/login', rateLimit, userController.login);
router.get('/profile', auth.protect, userController.getProfile);
router.put('/profile', auth.protect, userController.updateProfile);
router.post('/request-password-reset', rateLimit, userController.requestPasswordReset);
router.post('/reset-password', rateLimit, userController.resetPassword);
router.get('/verify/:token', userController.verifyEmail);
router.post('/upload-avatar', auth.protect, upload.single('avatar'), userController.uploadAvatar);
router.put('/deactivate', auth.protect, userController.deactivateUser);
router.post('/reactivate', userController.reactivateUser);

module.exports = router;
