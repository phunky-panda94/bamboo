const Post = require('./post.model');
const User = require('../user/user.model');

exports.create = async (req, res) => {

    const { user, content } = req.body;

    const author = await User.findOne({ _id: user });

    const post = new Post({
        author: author,
        content: content
    })

    post.save(err => {
        return res.status(400);
    })

    return res.status(201);

}

exports.get = async () => {

}

exports.update = async () => {

}

exports.delete = async () => {

} 