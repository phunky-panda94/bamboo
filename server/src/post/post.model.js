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
        maxLength: 25,
        required: true
    },
    votes: {
        type: Number,
        default: 0
    }
})

PostSchema.virtual('url').get(function() {
    return `/api/posts/${this._id}`;
})

PostSchema.virtual('slug').get(function() {
    return this.title.toLowerCase().replaceAll(' ', '-');
})

module.exports = mongoose.model('Post', PostSchema);