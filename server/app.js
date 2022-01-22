const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const userRouter = require('./src/user/user.routes');
const postRouter = require('./src/post/post.routes');
const commentRouter = require('./src/comment/comment.routes');

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));	

app.use('/api/user', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/posts', commentRouter);

module.exports = app;
