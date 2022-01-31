const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
    upVotes: { type: Number, default: 0 },
    downVotes: { type: Number, default: 0 }
})

CommentSchema.virtual('url').get(function() {
    return `/api/posts/${this.post}/comments/${this._id}`;
})

CommentSchema.virtual('totalVotes').get(function() {
    return this.upVotes + this.downVotes;
})

module.exports = mongoose.model('Comment', CommentSchema);