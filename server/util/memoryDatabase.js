const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcryptjs');

const User = require('../src/user/user.model');
const Post = require('../src/post/post.model');
const Comment = require('../src/comment/comment.model');

let database;

exports.connect = async () => {
    database = await MongoMemoryServer.create();
    const uri = database.getUri();
    await mongoose.connect(uri);
}

exports.disconnect = async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
    await database.stop();
}

exports.seed = async () => {

    const encryptedPassword = await bcrypt.hash('batman', 10);

    const user = new User({
        firstName: 'Bruce',
        lastName: 'Wayne',
        email: 'bwayne@wayne.com',
        password: encryptedPassword
    });

    await user.save();

    const post = new Post({
        author: user._id,
        content: 'this is a post'
    })

    await post.save();

    await Comment.create({
        user: user._id,
        post: post._id,
        content: "this is a comment"
    })

}