const mongoose = require('mongoose');

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

PostSchema.virtual('slug').get(function() {
    return this.title.toLowerCase().replaceAll(' ', '-');
})

PostSchema.virtual('votes',{
    ref: 'Vote',
    localField: '_id',
    foreignField: 'content',
    count: true
})

module.exports = mongoose.model('Post', PostSchema);