const User = require('./user.model');

exports.register = async (req, res) => {
    
    const { firstName, lastName, email, password } = req.body;

    const newUser = await User.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
    }).catch(err => {
        console.log('error')
        return res.status(400);
    })

    return res.status(201).json({ user: newUser._id });

}

exports.login = async (req, res) => {
    return res.status(200);
}

exports.getUser = async (req, res) => {
    
    const { id } = req.params;

    const foundUser = await User.findById(id, 'firstName lastName email').catch(err => {
        return res.status(404).json({ error: 'user not found' });
    });

    return res.status(200).json(foundUser)

}