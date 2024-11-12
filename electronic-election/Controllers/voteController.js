const Vote = require('../Models/vote');  // Import the Vote class

async function castVote(req, res) {
    const { voterId, candidateId } = req.body;

    try {
        await Vote.castVote(voterId, candidateId);  // Call the static method from Vote class
        res.status(200).send("Vote cast successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error casting vote");
    }
}

module.exports = { castVote };
