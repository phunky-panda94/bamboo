const express = require('express');
const router = express.Router();
const { getUser, login, register, updateUser, deleteUser } = require('./user.controller');
const { authenticateToken, authenticateUser } = require('../middleware/authenticator');
const { validateNewUserDetails } = require('../middleware/validator');

router.get('/:id', authenticateToken, getUser);

router.post('/register', validateNewUserDetails, register);

router.post('/login', authenticateUser, login);

router.put('/:id', authenticateToken, updateUser);

router.delete('/:id', authenticateToken, deleteUser);

module.exports = router;
