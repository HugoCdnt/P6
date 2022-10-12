const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');
const rateLimot = require('express-rate-limit');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;