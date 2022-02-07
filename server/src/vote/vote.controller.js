const Vote = require('./vote.model');
const { voteExists } = require('./vote.helpers');

exports.create = async (req, res) => {

    const vote = req.body;

    if (await voteExists(vote.user, vote.content)) {
        return res.status(400).json({ error: 'vote already exists' });
    }

    try {
        await Vote.create(vote);
    } catch (err) {
        return res.status(400).json({ error: 'error creating vote' });
    }

    res.status(201).end();

}

exports.get = async (req, res) => {

    const { id } = req.params;

    let votes;

    try {
        votes = await Vote.find({ content: id });
    } catch {
        return res.status(400).json({ error: 'error retrieving votes' });
    }

    res.status(200).json(votes);

}

exports.update = async (req, res) => {

    const { id, down } = req.params;

    try {
        await Vote.findByIdAndUpdate(id, { down: down });
    } catch (err) {
        return res.status(400).json({ error: 'error updating vote' });
    }

    res.status(204).end();

}

exports.delete = async (req, res) => {

    const { id } = req.params;

    try {
        await Vote.findByIdAndDelete(id);
    } catch (err) {
        return res.status(400).json({ error: 'error deleting vote' });
    }

    res.status(202).end();

}