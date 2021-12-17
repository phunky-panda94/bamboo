const express = require('express');
const router = express.Router();
const userController = require('./user.controller');

router.get('/users/:id', (req, res) => {
    // return user details
})

router.post('/register', userController.register);

router.post('/login', (req, res) => {
    // authenticate
    
    // return token
})

module.exports = router;
