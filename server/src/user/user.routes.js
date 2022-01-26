const express = require('express');
const router = express.Router();
const { getUser, getUserPosts, login, register, updateEmail, updatePassword, deleteUser } = require('./user.controller');
const { authenticateToken, authenticateUser, encryptPassword } = require('../middleware/authenticator');
const { validateEmail, validatePassword, validateNewUserDetails } = require('../middleware/validator');

router.get('/', authenticateToken, getUser);

router.get('/:id/posts', getUserPosts);

router.post('/register', validateNewUserDetails, encryptPassword, register);

router.post('/login', authenticateUser, login);

router.put('/:id/email', authenticateToken, validateEmail, updateEmail);

router.put('/:id/password', authenticateToken, validatePassword, encryptPassword, updatePassword);

router.delete('/:id', authenticateToken, deleteUser);

module.exports = router;
