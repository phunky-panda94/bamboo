const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        maxLength: 25,
        required: true
    },
    lastName: {
        type: String,
        maxLength: 25,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

UserSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
})

UserSchema.virtual('url').get(function() {
    return `/api/user/${this._id}`;
})

module.exports = mongoose.model('User', UserSchema);