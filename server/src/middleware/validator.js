const { body, validationResult } = require('express-validator');

exports.validateNewUserDetails = [

    body('firstName').trim().isLength({ min: 2, max: 25 }).escape().withMessage('First name must be provided'),
    body('lastName').trim().isLength({ min: 2, max: 25 }).escape().withMessage('Last name must be provided'),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 5, max: 25 }).withMessage('must be between 5 and 20 characters long'),

    (req, res, next) => this.handleErrors(req, res, next)

]

exports.validateEmail = [

    body('email').isEmail().normalizeEmail().withMessage('must be a valid email address'),
    (req, res, next) => {
        if(!validationResult(req).isEmpty()) return res.status(400).json({ error: 'invalid email address' });
        next();
    }

]

exports.validatePassword = [

    body('password').isLength({ min: 5, max: 25 }).withMessage('must be between 5 and 20 characters long'),
    (req, res, next) => {
        if(!validationResult(req).isEmpty()) return res.status(400).json({ error: 'invalid password' });
        next();
    }

]

exports.handleErrors = (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    next();

}

