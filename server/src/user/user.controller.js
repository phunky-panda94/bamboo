const User = require('./user.model');
const { encryptPassword } = require('../middleware/authenticator');

exports.register = async (req, res) => {
        
    const { firstName, lastName, email, password } = req.body;

    const encryptedPassword = await encryptPassword(password);
    
    const newUser = new User({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: encryptedPassword
    })
    
    await newUser.save(err => {
        if (err) return res.status(400);
    });

    return res.status(201);

}

exports.login = async (req, res) => {
    return res.status(200);
}

exports.getUser = (req, res) => {
    
}