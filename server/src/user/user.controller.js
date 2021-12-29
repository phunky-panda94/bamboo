const User = require('./user.model');

exports.register = async (req, res) => {
    
    const { firstName, lastName, email, password } = req.body;

    await User.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
    }).catch(err => {
        return res.status(400).json({ error: 'user could not be registered' });
    })

    res.status(201).end();

}

exports.login = async (req, res) => {
    const { user, token } = req.body;
    res.status(200).json({ user: user, token: token });
}

exports.getUser = async (req, res) => {
    
    const { id } = req.params;

    const foundUser = await User.findById(id, 'firstName lastName email').catch(err => {
        return res.status(404).json({ error: 'user not found' });
    });

    res.status(200).json(foundUser)

}