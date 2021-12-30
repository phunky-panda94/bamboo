const express = require('express');
const router = express.Router();
const { getUser, login, register, updateEmail, updatePassword, deleteUser } = require('./user.controller');
const { authenticateToken, authenticateUser, encryptPassword } = require('../middleware/authenticator');
const { validateNewUserDetails } = require('../middleware/validator');

router.get('/:id', authenticateToken, getUser);

router.post('/register', validateNewUserDetails, register);

router.post('/login', authenticateUser, login);

router.put('/:id/email', authenticateToken, updateEmail);

router.put('/:id/password', authenticateToken, encryptPassword, updatePassword);

router.delete('/:id', authenticateToken, deleteUser);

module.exports = router;
