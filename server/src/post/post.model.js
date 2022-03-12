const mongoose = require('mongoose');
const Comment = require('../comment/comment.model');
const Vote = require('../vote/vote.model');

const PostSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        maxLength: 50,
        required: true
    }
}, {
    toJSON: { virtuals: true }
})

PostSchema.virtual('url').get(function() {
    return `/api/posts/${this._id}`;
})

PostSchema.virtual('votes', {
    ref: 'Vote',
    localField: '_id',
    foreignField: 'content',
    count: true
})

PostSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'post',
    count: true
})

PostSchema.pre('deleteOne', { document: false, query: true }, async function() {
    const post = await this.model.findOne(this.getFilter());
    await Vote.deleteMany({ content: post._id });
    await Comment.deleteMany({ post: post._id });
})

module.exports = mongoose.model('Post', PostSchema);