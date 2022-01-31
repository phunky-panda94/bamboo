const router = require('express').Router();
const { authenticateToken } = require('../middleware/authenticator');
const { sanitiseComment } = require('../middleware/validator');
const commentController = require('./comment.controller');

router.post('/:postId/comments/', authenticateToken, sanitiseComment, commentController.create);

router.get('/:postId/comments/', commentController.getByPost);

router.get('/:postId/comments/:commentId', commentController.get);

router.put('/:postId/comments/:commentId', authenticateToken, sanitiseComment, commentController.update);

router.put('/:postId/comments/:commentId/votes/:direction', commentController.updateVotes);

router.delete('/:postId/comments/:commentId', authenticateToken, commentController.delete);

module.exports = router;