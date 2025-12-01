const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);
router.put('/change-password', protect, authController.changePassword);
router.put('/update-addresses', protect, authController.updateAddresses);
// Protected route
router.get('/me', protect, authController.getMyProfile);


module.exports = router;