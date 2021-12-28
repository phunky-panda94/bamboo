const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Comment', CommentSchema);