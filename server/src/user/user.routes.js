const express = require('express');
const router = express.Router();
const { getUser, login, register } = require('./user.controller');
const { authenticateToken, authenticateUser } = require('../middleware/authenticator');
const { encryptPassword }


router.get('/:id', authenticateToken, getUser);

router.post('/register', register);

router.post('/login', authenticateUser, login);

module.exports = router;
