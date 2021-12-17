const User = require('./user.model');
const { body, validationResult } = require('express-validator');
const { encryptPassword } = require('../auth/auth');

exports.register = [

    // validate & sanitise
    body('firstName').trim().isLength({ min: 2, max: 25 }).escape().withMessage('First name must be provided'),
    body('lastName').trim().isLength({ min: 2, max: 25 }).escape().withMessage('Last name must be provided'),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 5, max: 20 }).withMessage('must be between 5 and 20 characters long'),
    
    // process
    (req, res, next) => {
        
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        } else {

            let encryptedPassword = encryptPassword(req.body.password);
            
            let newUser = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: encryptedPassword
            })

            newUser.save(err => {
                if (err) return res.status(400).json('Error occurred while registering new user');
            })

            return res.status(201).json('New user successfully registered');

        }

    }

]
