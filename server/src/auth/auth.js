require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.encryptPassword = async (password) => {
    const encryptedPassword = await bcrypt.hash(password, 10);
    return encryptedPassword;
}

exports.checkPassword = async (password, encryptedPassword) => {
    const match = await bcrypt.compare(password, encryptedPassword);
    return match;
}

exports.authenticateUser = () => {

}

exports.authenticateToken = () => {
    
}