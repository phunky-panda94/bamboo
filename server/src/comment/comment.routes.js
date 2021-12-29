const router = require('express').Router();
const { authenticateToken } = require('../middleware/authenticator');
const commentController = require('./comment.controller');

router.post('/', authenticateToken, commentController.create);

router.get('/', commentController.getAll);

router.get('/:id', commentController.get);

router.put('/:id', authenticateToken, commentController.update);

router.delete('/:id', authenticateToken, commentController.delete);

module.exports = router;