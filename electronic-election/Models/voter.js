class Voter {
    constructor(id, email, hasVoted = false) {
        this.id = id;
        this.email = email;
        this.hasVoted = hasVoted;
    }

    // Save the Voter to Firebase
    async save() {
        const { db } = require('../Config/firebase');
        return db.collection('voters').doc(this.id).set({
            email: this.email,
            hasVoted: this.hasVoted
        });
    }

    // Fetch voter by ID
    static async findById(id) {
        const { db } = require('../Config/firebase');
        const doc = await db.collection('voters').doc(id).get();
        if (!doc.exists) return null;
        return new Voter(id, doc.data().email, doc.data().hasVoted);
    }
}

module.exports = Voter;
