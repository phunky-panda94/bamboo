#! /usr/bin/env node
require('dotenv').config();
const faker = require('faker');
const mongoose = require('mongoose');
const async = require('async');

const User = require('../src/user/user.model');
const Post = require('./src/post/post.model');
const Comment = require('./src/comment/comment.model');

mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true });
const database = mongoose.connection;
database.on('error', console.error.bind(console, 'Error connecting to database'));

let users = [];
let posts = [];

function createUser(firstName, lastName, email) {

    details = {
        firstName: firstName, 
        lastName: lastName,
        email: email
    }

    let user = new User(details);
         
    user.save((err) => {

        if (err) {
            console.log(`[ERROR] Error creating user: ${user.fullName} - ${err}`);
            cb(err, null);
            return;
        }

        console.log(`[INFO] New user created: ${user.fullName}`);
        user.push(user);
        cb(null, user);

    });

}
  
function createPost() {

}

function createComment() {
    
}

function populateUsers(cb) {

    async.series([
        (callback) => {
          createUser(faker.firstName(), faker.lastName(), faker.internet.email(), callback);
        },
        (callback) => {
            createUser(faker.firstName(), faker.lastName(), faker.internet.email(), callback);
        },
        (callback) => {
            createUser(faker.firstName(), faker.lastName(), faker.internet.email(), callback);
        }
    ], cb);

}

function populatePosts(cb) {
    async.parallel([
        (callback) => {
            
        }
    ], cb);
}

function populateComments(cb) {
    async.parallel([
        (callback) => {
        }
    ], cb);
}

console.log('Populating database...');

async.series([populateUsers, populatePosts, populateComments], (err, results) => {

    if (err) {
        console.log(`[ERROR] ${err}`);
    }
    else {
        console.log('[INFO] Data successfully loaded!');
    }
    mongoose.connection.close();

});



