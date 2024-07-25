const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/auth');

// Send notification
router.post('/send', auth.protect, auth.admin, notificationController.sendNotification);

module.exports = router;
