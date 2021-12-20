const express = require('express');
const router = express.Router();
const userController = require('./user.controller');

router.get('/:id', userController.getUser);

router.post('/register', userController.register);

router.post('/login', userController.login);

module.exports = router;
