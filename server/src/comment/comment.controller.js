const Comment = require('./comment.model');

exports.create = async (req, res) => {

    const { postId } = req.params
    const { user, content } = req.body;
    let comment;

    try {
        comment = await Comment.create({
            user: user,
            post: postId,
            content: content
        });
    } catch (err) {
        return res.status(400).json({ error: 'comment could not be created'});
    }

    res.status(201).json(comment);

}

exports.get = async (req, res) => {

    const { commentId } = req.params;

    let comment;

    try { 
        comment = await Comment.findById(commentId)
            .populate('user', 'firstName lastName')
            .populate('votes');
    } catch (err) {
        return res.status(404).json({ error: 'comment not found' });
    }

    res.status(200).json(comment);

}

exports.getByPost = async (req, res) => {

    const { postId } = req.params;
    let comments;

    try {
        comments = await Comment.find({ post: postId })
            .populate('user', 'firstName lastName')
            .populate('votes')
            .sort({ date: 'desc' })
    } catch (err) {
        return res.status(404).json({ error: 'post not found' })
    }

    res.status(200).json(comments);

}

exports.update = async (req, res) => {

    const { commentId } = req.params
    const { user, content } = req.body;

    let comment;

    try {
        comment = await Comment.findById(commentId);
    } catch (err) {
        return res.status(404).json({ error: 'comment not found' });
    }

    if (user !== comment.user.toString()) return res.status(403).json({ error: 'forbidden' });

    try {
        comment.content = content;
        await comment.save();
    } catch (err) {
        return res.status(400).json({ error: 'comment could not be updated' });
    }

    res.status(204).end();

}

exports.delete = async (req, res) => {

    const { commentId } = req.params;
    const { user } = req.body;

    let comment;

    try {
        comment = await Comment.findById(commentId)
    } catch (err) {
        return res.status(404).json({ error: 'comment not found' });
    }
    
    if (user !== comment.user.toString()) return res.status(403).json({ error: 'forbidden' });

    try {
        await Comment.deleteOne({ _id: commentId});
    } catch (err) { 
        return res.status(400).json({ error: 'comment could not be deleted' });
    }

    res.status(202).end();
    
}