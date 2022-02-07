const express = require('express')
const router = express.Router();
const { authenticateToken } = require('../middleware/authenticator')
const voteController = require('./vote.controller');

router.post('/', authenticateToken, voteController.create);

router.get('/post/:id', voteController.get);

router.get('/comment/:id', voteController.get);

router.put('/:id/:down', authenticateToken, voteController.update);

router.delete('/:id', authenticateToken, voteController.delete);

module.exports = router;