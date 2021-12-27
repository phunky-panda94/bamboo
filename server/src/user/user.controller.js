const User = require('./user.model');
const { body, validationResult } = require('express-validator');
const { encryptPassword } = require('../middleware/auth');

exports.register = async (req, res) => {
        
    const { firstName, lastName, email, password } = req.body;

    const encryptedPassword = await encryptPassword(password);

    // create new user -> save to database -> return status 201
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

exports.validate = [

    // validate & sanitise
    body('firstName').trim().isLength({ min: 2, max: 25 }).escape().withMessage('First name must be provided'),
    body('lastName').trim().isLength({ min: 2, max: 25 }).escape().withMessage('Last name must be provided'),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 5, max: 20 }).withMessage('must be between 5 and 20 characters long'),

    (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) return res.status(400).json(errors);

        next();
    }

]

exports.login = async (req, res) => {
    return res.status(200);
}

exports.getUser = (req, res) => {
    
}