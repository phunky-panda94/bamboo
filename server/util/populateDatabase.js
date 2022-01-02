#! /usr/bin/env node
require('dotenv').config();
const faker = require('faker');
const mongoose = require('mongoose');
const async = require('async');
const bcrypt = require('bcryptjs');

const User = require('../src/user/user.model');
const Post = require('../src/post/post.model');
const Comment = require('../src/comment/comment.model');

mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true });
const database = mongoose.connection;
database.once('open', () => console.log('[INFO] Successfully connected to database'));
database.on('error', console.error.bind(console, 'Error connecting to database'));

let users = [];
let posts = [];

function getRandomIndex(array) {
    return Math.floor(Math.random() * array.length);
}

async function createUser(firstName, lastName, email, password, callback) {

    details = {
        firstName: firstName, 
        lastName: lastName,
        email: email,
        password: await bcrypt.hash(password, 10)
    }

    let user = new User(details);
         
    user.save((err) => {

        if (err) {
            console.log(`[ERROR] Error creating user: ${user.fullName} - ${err}`);
            callback(err, null);
            return;
        }

        console.log(`[INFO] New user created: ${user.fullName}`);
        users.push(user);
        callback(null, user);

    });

}
  
function createPost(author, content, callback) {

    let post = new Post({
        author: author._id,
        content: content
    })

    post.save((err) => {

        if (err) {
            console.log(`[ERROR] Error creating post: ${author.fullName} - ${post.content.length}`);
            callback(err, null);
            return;
        }

        console.log(`[INFO] New post created: ${author.fullName} - ${post.content.length}`);
        posts.push(post);
        callback(null, post);

    });

}

function createComment(user, post, content, callback) {

    let comment = new Comment({
        user: user._id,
        post: post._id,
        content: content
    })

    comment.save((err) => {

        if (err) {
            console.log(`[ERROR] Error creating comment: ${user.fullName} - ${comment.content.length}`);
            callback(err, null);
            return;
        }

        console.log(`[INFO] New comment created: ${user.fullName} - ${comment.content.length}`);
        callback(null, comment);

    })
    
}

function populateUsers(callback) {

    let usersToCreate = [];

    for (let i = 0; i < 5; i++) {
        usersToCreate.push(function(callback) { createUser(faker.name.firstName(), faker.name.lastName(), faker.internet.email(), faker.internet.password(), callback) });
    }

    async.series(usersToCreate, callback);

}

function populatePosts(callback) {

    let posts = [];

    for (let i = 0; i < 10; i++) {
        posts.push(function(callback) { createPost(users[getRandomIndex(users)], faker.lorem.paragraph(), callback) });
    }

    async.parallel(posts, callback);
}

function populateComments(callback) {

    let comments = [];

    for (let i = 0; i < 15; i++) {
        comments.push(function(callback) { createComment(users[getRandomIndex(users)], posts[getRandomIndex(posts)], faker.lorem.sentence(), callback) });
    }

    async.parallel(comments, callback);
}

console.log('[INFO] Populating database...');

async.series([populateUsers, populatePosts, populateComments], (err, results) => {

    if (err) {
        console.log(`[ERROR] ${err}`);
    }
    else {
        console.log('[INFO] Data successfully loaded!');
    }
    mongoose.connection.close();

});