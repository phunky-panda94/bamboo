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
    }
})

PostSchema.virtual('url').get(function() {
    return `/api/posts/${this._id}`;
})

module.exports = mongoose.model('Post', PostSchema);