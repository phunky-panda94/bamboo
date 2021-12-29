require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../user/user.model');

exports.encryptPassword = async (req, res, next) => {

    const { password } = req.body;
    const encryptedPassword = await bcrypt.hash(password, 10);

    req.body.password = encryptedPassword;

    next();

}

exports.checkPassword = async (password, encryptedPassword) => {
    const match = await bcrypt.compare(password, encryptedPassword);
    return match;
}

exports.authenticateUser = async (req, res, next) => {

    const { email, password } = req.body;
    
    const user = await User.findOne({ email: email });
    
    if (!user || !await this.checkPassword(password, user.password)) {
        return res.status(401).json({ error: 'Invalid credentials'})
    }

    const token = this.createToken(email);

    req.body.user = { firstName: user.firstName, lastName: user.lastName };
    req.body.token = token;

    next();

}

exports.authenticateToken = (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ error: 'No token in Authorization header' });
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err) => {
        if (err) {
            return res.status(403).json({ error: 'Unauthorized'});
        }
    })

    next();

}

exports.createToken = (email) => {
    const token = jwt.sign(email, process.env.TOKEN_SECRET);
    return token;
}