require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.encryptPassword = async (password) => {

    const encryptedPassword = await bcrypt.hash(password, 10);

    return encryptedPassword;

}

exports.authenticateUser = () => {

}

exports.authenticateToken = () => {
    
}