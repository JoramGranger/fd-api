const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const rateLimit = require('../middleware/rateLimit');

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieve a list of users
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: 12345
 *                   name:
 *                     type: string
 *                     example: John Doe
 */

// pr
router.post('/register', rateLimit, userController.register);
router.post('/login', rateLimit, userController.login);
router.get('/verify/:token', userController.verifyEmail);
router.post('/request-password-reset', rateLimit, userController.requestPasswordReset);
router.post('/reset-password', rateLimit, userController.resetPassword);

// ptdr
router.get('/profile', auth.protect, userController.getProfile);
router.put('/profile', auth.protect, userController.updateProfile);
router.post('/upload-avatar', auth.protect, upload.single('avatar'), userController.uploadAvatar);

// ar
router.put('/deactivate', auth.protect, auth.admin, userController.deactivateUser);
router.post('/reactivate', auth.admin, userController.reactivateUser);

module.exports = router;
