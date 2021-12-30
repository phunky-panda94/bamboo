const Comment = require('./comment.model');

exports.create = async (req, res) => {

    const { user, post, content } = req.body;

    let comment;

    try {
        comment = await Comment.create({
            user: user,
            post: post,
            content: content
        });
    } catch (err) {
        return res.status(400).json({ error: 'comment could not be created'});
    }

    res.status(201).json({ id: comment._id });

}

exports.get = async (req, res) => {

    const { id } = req.params;

    let comment;

    try { 
        comment = await Comment.findById(id);
    } catch (err) {
        return res.status(404).json({ error: 'comment not found' });
    }

    res.status(200).json(comment);

}

exports.getAll = async (req, res) => {

    const comments = await Comment.find({});

    res.status(200).json(comments);

}

exports.update = async (req, res) => {

    const { id } = req.params
    const { content } = req.body;

    let comment;

    try {
        comment = await Comment.findById(id);
    } catch (err) {
        return res.status(404).json({ error: 'comment not found' });
    }

    comment.content = content;

    try {
        await comment.save();
    } catch (err) {
        return res.status(400).json({ error: 'comment could not be updated' });
    }

    res.status(204).end();

}

exports.delete = async (req, res) => {

    const { id } = req.params;

    try {
        await Comment.findByIdAndDelete(id)
    } catch (err) {
        return res.status(400).json({ error: 'comment could not be deleted' })
    }

    res.status(202).end();
    
}