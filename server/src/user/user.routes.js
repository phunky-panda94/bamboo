const express = require('express');
const router = express.Router();
const userController = require('./user.controller');

router.get('/:id', (req, res) => {
    // return user details
})

router.post('/register', userController.register);

router.post('/login', userController.login);

module.exports = router;
