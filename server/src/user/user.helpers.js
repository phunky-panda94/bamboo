const User = require('../../src/user/user.model');

exports.userExists = async (email) => {

    const user = await User.findOne({ email: email });
    
    if (user) return true;
    
    return false;

}