const router = require('express').Router();
const { authenticateToken } = require('../middleware/authenticator');
const commentController = require('./comment.controller');

router.post('/:postId/comments/', authenticateToken, commentController.create);

router.get('/:postId/comments/', commentController.getByPost);

router.get('/:postId/comments/:commentId', commentController.get);

router.put('/:postId/comments/:commentId', authenticateToken, commentController.update);

router.delete('/:postId/comments/:commentId', authenticateToken, commentController.delete);

module.exports = router;