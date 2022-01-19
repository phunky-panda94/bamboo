const User = require('./user.model');
const { userExists } = require('./user.helpers');

exports.register = async (req, res) => {
    
    const { firstName, lastName, email, password } = req.body;

    if (await userExists(email)) {
        return res.status(400).json({ error: 'Email address already taken' })
    };

    const newUser = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
    }
    
    try {
        await User.create(newUser);
    } catch (err) {
        return res.status(400).json({ error: 'user could not be registered' });
    }

    res.status(201).end();

}

exports.login = async (req, res) => {
    const { user, token } = req.body;
    res.status(200)
        .cookie('token', token, { httpOnly: true })
        .json({ user: user });
}

exports.getUser = async (req, res) => {
    
    const { id } = req.params;
    let user;

    try {
        user = await User.findById(id, 'firstName lastName email');
    } catch {
        return res.status(404).json({ error: 'user not found' });
    }
        
    res.status(200).json(user);

}

exports.updateEmail = async (req, res) => {

    const { email } = req.body;
    const { id } = req.params;
    let user;

    try {
        user = await User.findById(id);
    } catch (err) {
        return res.status(404).json({ error: 'user does not exist' });
    }

    if (await User.findOne({ email: email })) return res.status(400).json({ error: 'email address already taken' });
    
    try {
        user.email = email;
        await user.save();
    } catch (err) {
        return res.status(400).json({ error: 'user email could not be updated' });
    }

    res.status(204).end();

}

exports.updatePassword = async (req, res) => {

    const { password } = req.body;
    const { id } = req.params;
    let user;

    try {
        user = await User.findById(id);
    } catch (err) {
        return res.status(404).json({ error: 'user does not exist' });
    }
    
    try {
        user.password = password;
        await user.save();
    } catch {
        return res.status(400).json({ error: 'user password could not be updated' });
    }

    res.status(204).end();

}

exports.deleteUser = async (req, res) => {

    const { id } = req.params;

    try {
        await User.findByIdAndDelete(id);
    } catch (err) {
        return res.status(400).json({ error: 'user could not be deleted' });
    }
    
    res.status(202).end();

}