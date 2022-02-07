const express = require('express');
const cors = require('cors');
const path = require('path');
const userRouter = require('./src/user/user.routes');
const postRouter = require('./src/post/post.routes');
const commentRouter = require('./src/comment/comment.routes');
const voteRouter = require('./src/vote/vote.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));	

app.use('/api/user', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/posts', commentRouter);
app.use('/api/votes', voteRouter);

module.exports = app;
