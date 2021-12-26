const express = require('express')
const router = express.Router();
const { authenticateToken } = require('../middleware/auth')
const postController = require('./post.controller');

router.post('/', authenticateToken, postController.create);

router.get('/', postController.getAll);

router.get('/:id', postController.get);

router.put('/:id', authenticateToken, postController.update);

router.delete('/:id', authenticateToken, postController.delete);

module.exports = router;