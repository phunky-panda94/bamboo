const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcryptjs');

const User = require('../src/user/user.model');
const Post = require('../src/post/post.model');
const Comment = require('../src/comment/comment.model');
const Vote = require('../src/vote/vote.model');

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

    const postA = await Post.create({
        author: user._id,
        content: 'this is a post',
        title: 'this is the Title'
    })

    const postB = await Post.create({
        author: user._id,
        content: 'this is another post',
        title: 'this is the title'
    })

    const commentA = await Comment.create({
        user: user._id,
        post: postA._id,
        content: "this is a comment"
    })

    await Comment.create({
        user: user._id,
        post: postB._id,
        content: "this is another comment"
    })

    await Vote.create({
        user: user._id,
        content: postA._id,
    })

    await Vote.create({
        user: user._id,
        content: commentA._id,
        down: true
    })

}