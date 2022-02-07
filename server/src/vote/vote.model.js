const mongoose = require('mongoose');

const VoteSchema = mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true 
    },
    content: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    down: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Vote', VoteSchema);