const { body, validationResult } = require('express-validator');

exports.validateNewUserDetails = [

    body('firstName').trim().isLength({ min: 2, max: 25 }).escape().withMessage('First name must be provided'),
    body('lastName').trim().isLength({ min: 2, max: 25 }).escape().withMessage('Last name must be provided'),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 5, max: 20 }).withMessage('must be between 5 and 20 characters long'),

    (req, res, next) => {
        
        const errors = validationResult(req);

        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        next();
    }

]