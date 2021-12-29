const User = require('./user.model');

exports.register = async (req, res) => {
        
    const { firstName, lastName, email, password } = req.body;

    const newUser = new User({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
    })
    
    await newUser.save(err => {
        if (err) return res.status(400);
    });

    return res.status(201);

}

exports.login = async (req, res) => {
    return res.status(200);
}

exports.getUser = async (req, res) => {
    
    const { user } = req.params;

    const foundUser = await User.findById(user, '-_id firstName lastName email').catch(err => {
        return res.status(404).json({ error: 'user not found' });
    });

    return res.status(200).json(foundUser)

}