const { body, validationResult } = require('express-validator');

exports.validateNewUserDetails = [
    
    body('firstName').trim().isLength({ min: 2, max: 25 }).escape().withMessage('Must be between 2 and 25 characters long'),
    body('lastName').trim().isLength({ min: 2, max: 25 }).escape().withMessage('Must be between 2 and 25 characters long'),
    body('email').isEmail().normalizeEmail().withMessage('Must be a valid email address'),
    body('password').isLength({ min: 5, max: 25 }).withMessage('Must be between 5 and 20 characters long'),
    
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

exports.sanitiseComment = [
    body('comment').trim().escape(),
    (req, res, next) => next()
]

exports.handleErrors = (req, res, next) => {

    const errors = validationResult(req);
    
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    next();

}

