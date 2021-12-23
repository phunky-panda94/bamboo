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

exports.authenticateToken = (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        res.status(401);
        return res.json({ error: 'No token in Authorization header' });
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err) => {
        if (err) {
            res.status(403);
            return res.json({ error: 'Unauthorized'});
        }
    })

    next();

}

exports.createToken = (email) => {

    const token = jwt.sign(email, process.env.TOKEN_SECRET);
    return token;

}