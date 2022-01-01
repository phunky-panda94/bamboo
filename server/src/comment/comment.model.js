const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now }
})

CommentSchema.virtual('url').get(function() {
    return `/api/posts/${this.post}/comments/${this._id}`;
})

module.exports = mongoose.model('Comment', CommentSchema);