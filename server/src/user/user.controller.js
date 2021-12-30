const User = require('./user.model');
const { userExists } = require('./user.helpers');

exports.register = async (req, res) => {
    
    const { firstName, lastName, email, password } = req.body;

    if (await userExists(email)) {
        return res.status(400).json({ error: 'user already exists' })
    };

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

    const foundUser = await User.findById(id, 'firstName lastName email').catch(err => { return });

    if (!foundUser) return res.status(404).json({ error: 'user not found' });
        
    res.status(200).json(foundUser);

}

exports.updateUser = async (req, res) => {

    const { email, password } = req.body;
    const { id } = req.params

    const user = await User.findById(id).catch(err => { return });
    if (!user) return res.status(404).json({ error: 'user does not exist' });

    user.email = email;
    user.password = password;
    
    const updatedUser = await user.save().catch(err => { return });
    if(!updatedUser) return res.status(400).json({ error: 'user could not be updated' });

    res.status(202).end();

}

exports.deleteUser = async (req, res) => {

}