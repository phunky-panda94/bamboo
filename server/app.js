const express = require('express');
const path = require('path');
const indexRouter = require('./src/index/index.routes');
const userRouter = require('./src/user/user.routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));	

app.use('/', indexRouter);
app.use('/user', userRouter);

module.exports = app;
