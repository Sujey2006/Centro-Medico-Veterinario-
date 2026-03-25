const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/auth/login', authController.getLoginForm);
router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);

module.exports = router;

