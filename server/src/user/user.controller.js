const User = require('./user.model');
const { body, validationResult } = require('express-validator');
const { authenticateUser, encryptPassword, checkPassword } = require('../auth/auth');

exports.register = [
    
    // validate & sanitise
    body('firstName').trim().isLength({ min: 2, max: 25 }).escape().withMessage('First name must be provided'),
    body('lastName').trim().isLength({ min: 2, max: 25 }).escape().withMessage('Last name must be provided'),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 5, max: 20 }).withMessage('must be between 5 and 20 characters long'),

    async (req, res) => {
        
        const errors = validationResult(req);

        // return status 400 if validations errors exist
        if (!errors.isEmpty()) return res.status(400).json(errors);

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
            if (err) console.log(err);
        });

        return res.status(201).json('New user successfully registered');

    }
]

exports.login = async (req, res) => {
    return res.status(200).json(res.locals.user);
}

exports.getUser = (req, res) => {
    
}