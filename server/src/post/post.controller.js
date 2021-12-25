const Post = require('./post.model');
const User = require('../user/user.model');

exports.create = async (req, res) => {

    const { user, content } = req.body;

    const post = await Post.create({
        author: user,
        content: content
    }).catch(err => {
        console.log(err);
        return res.status(400).json({ error: 'post could not be created' });
    });
    
    return res.status(201).json({ post: post._id });
    
}

exports.get = async (req, res) => {

    const { post } = req.body;

    const foundPost = await Post.findById(post).catch(err => {
        return res.status(404).json({ error: 'post not found' });
    });

    return res.status(200).json(foundPost);

}

exports.update = async (req, res) => {

    const { post, content } = req.body;

    await Post.findByIdAndUpdate(post, { content: content }, { runValidators: true }).catch(err => {
        return res.status(400).json({ error: 'post could not be updated' });
    });

    return res.status(204);

}

exports.delete = async (req, res) => {

    const { post } = req.body

    await Post.findByIdAndDelete(post).catch(err => {
        return res.status(400).json({ error: 'post does not exist' });
    });

    return res.status(202);

} 