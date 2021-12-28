const Comment = require('./comment.model');

exports.create = async (req, res) => {

    const { user, post, content } = req.body;

    await Comment.create({
        user: user,
        post: post,
        content: content
    }).catch(err => {
        return res.status(400).json({ error: 'comment could not be created'});
    })

    return res.status(201);

}

exports.get = async (req, res) => {

    const { comment } = req.params;

    const foundComment = await Comment.findById(comment).catch(err => {
        return res.status(404).json({ error: 'comment not found' });
    });

    return res.status(200).json(foundComment);

}

exports.getAll = async (req, res) => {

    const comments = await Comment.find({});

    return res.status(200).json(comments);

}

exports.update = async (req, res) => {

    const { comment, content } = req.body;

    await Comment.findByIdAndUpdate(comment, { content: content }).catch(err => {
        return res.status(400).json({ error: 'comment could not be updated' });
    });

    return res.status(204);

}

exports.delete = async (req, res) => {

    const { comment } = req.params;

    await Comment.findByIdAndDelete(comment).catch(err => {
        return res.status(400).json({ error: 'comment could not be deleted' })
    });

    return res.status(202);
    
}