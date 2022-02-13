const mongoose = require('mongoose');
const Vote = require('../../src/vote/vote.model');

const CommentSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
    votes: { type: Number, default: 0 }
})

CommentSchema.virtual('url').get(function() {
    return `/api/posts/${this.post}/comments/${this._id}`;
})

CommentSchema.pre('deleteOne', { document: false, query: true }, async function() {
    const comment = await this.model.findOne(this.getFilter());
    await Vote.deleteMany({ content: comment._id });
})

module.exports = mongoose.model('Comment', CommentSchema);