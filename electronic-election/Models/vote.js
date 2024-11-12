class Vote {
    constructor(candidateId, voterId) {
        this.candidateId = candidateId;
        this.voterId = voterId;
    }

    static async castVote(voterId, candidateId) {
        const { db } = require('../Config/firebase');
        const candidateRef = db.collection('candidates').doc(candidateId);

        return db.runTransaction(async (transaction) => {
            const candidateDoc = await transaction.get(candidateRef);
            if (!candidateDoc.exists) throw "Candidate does not exist";

            // Increment vote count
            const newVoteCount = (candidateDoc.data().voteCount || 0) + 1;
            transaction.update(candidateRef, { voteCount: newVoteCount });

            // Mark voter as having voted
            const voterRef = db.collection('voters').doc(voterId);
            transaction.update(voterRef, { hasVoted: true });
        });
    }
}

module.exports = Vote;
