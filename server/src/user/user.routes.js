const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const { authenticateToken, authenticateUser } = require('../middleware/auth');

router.get('/:id', authenticateToken, userController.getUser);

router.post('/register', userController.register);

router.post('/login', authenticateUser, userController.login);

module.exports = router;
