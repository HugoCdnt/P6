const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');
const regExp = require('../library/regExp');

router.post('/signup', regExp, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;