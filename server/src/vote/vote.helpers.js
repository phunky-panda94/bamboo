const Vote = require('../../src/vote/vote.model');

exports.voteExists = async (user, content) => {

    let vote;

    try {
        vote = await Vote.findOne({ user: user, content: content });
    } catch (err) {
        return false;
    }
    
    if (vote) return true;

    return false;

}