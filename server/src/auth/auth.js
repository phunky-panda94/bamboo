require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../user/user.model');

exports.encryptPassword = async (password) => {
    const encryptedPassword = await bcrypt.hash(password, 10);
    return encryptedPassword;
}

exports.checkPassword = async (password, encryptedPassword) => {
    const match = await bcrypt.compare(password, encryptedPassword);
    return match;
}

exports.authenticateUser = async (email, password) => {

    const user = await User.findOne({ email: email });

    if (user && await this.checkPassword(password, user.password)) return true;
    
    return false;

}

exports.authenticateToken = () => {
    
}

exports.createToken = (email) => {

    const token = jwt.sign(email, process.env.TOKEN_SECRET);
    return token;

}