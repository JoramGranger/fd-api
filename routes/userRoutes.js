const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const rateLimit = require('../middleware/rateLimit');

// public routes
router.post('/register', rateLimit, userController.register);
router.post('/login', rateLimit, userController.login);
router.get('/verify/:token', userController.verifyEmail);
router.post('/request-password-reset', rateLimit, userController.requestPasswordReset);
router.post('/reset-password', rateLimit, userController.resetPassword);

// protected routes
router.get('/profile', auth.protect, userController.getProfile);
router.put('/profile', auth.protect, userController.updateProfile);
router.post('/upload-avatar', auth.protect, upload.single('avatar'), userController.uploadAvatar);

// admin-only routes
router.put('/deactivate', auth.protect, auth.admin, userController.deactivateUser);
router.post('/reactivate', auth.admin, userController.reactivateUser);

module.exports = router;
