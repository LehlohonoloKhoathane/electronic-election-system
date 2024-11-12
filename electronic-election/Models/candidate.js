const admin = require('firebase-admin');
const db = admin.firestore();

/**
 * Candidate model class to interact with Firestore.
 */
class Candidate {
  constructor(id, name, party, bio) {
    this.id = id;        // Unique identifier for the candidate
    this.name = name;    // Candidate's name
    this.party = party;  // Candidate's party affiliation
    this.bio = bio;      // Short biography or description
  }

  /**
   * Save the candidate to Firestore.
   * @returns {Promise} A promise indicating the success of the save operation.
   */
  async save() {
    try {
      await db.collection('candidates').doc(this.id).set({
        name: this.name,
        party: this.party,
        bio: this.bio,
      });
      console.log(`Candidate ${this.name} saved successfully`);
    } catch (error) {
      console.error('Error saving candidate:', error);
      throw new Error('Failed to save candidate');
    }
  }

  /**
   * Fetch all candidates from Firestore.
   * @returns {Promise<Array>} A promise that resolves to an array of candidates.
   */
  static async getAll() {
    try {
      const candidatesSnapshot = await db.collection('candidates').get();
      const candidates = [];
      candidatesSnapshot.forEach(doc => {
        candidates.push({ id: doc.id, ...doc.data() });
      });
      return candidates;
    } catch (error) {
      console.error('Error fetching candidates:', error);
      throw new Error('Failed to fetch candidates');
    }
  }

  /**
   * Fetch a specific candidate by ID from Firestore.
   * @param {string} id - The ID of the candidate to retrieve.
   * @returns {Promise<Object>} A promise that resolves to the candidate data.
   */
  static async getById(id) {
    try {
      const candidateDoc = await db.collection('candidates').doc(id).get();
      if (!candidateDoc.exists) {
        throw new Error('Candidate not found');
      }
      return { id: candidateDoc.id, ...candidateDoc.data() };
    } catch (error) {
      console.error('Error fetching candidate by ID:', error);
      throw new Error('Failed to fetch candidate');
    }
  }

  /**
   * Update candidate details in Firestore.
   * @param {string} id - The ID of the candidate to update.
   * @param {Object} updates - The updates to be applied to the candidate.
   * @returns {Promise} A promise indicating the success of the update operation.
   */
  static async update(id, updates) {
    try {
      await db.collection('candidates').doc(id).update(updates);
      console.log(`Candidate ${id} updated successfully`);
    } catch (error) {
      console.error('Error updating candidate:', error);
      throw new Error('Failed to update candidate');
    }
  }

  /**
   * Delete a candidate from Firestore.
   * @param {string} id - The ID of the candidate to delete.
   * @returns {Promise} A promise indicating the success of the delete operation.
   */
  static async delete(id) {
    try {
      await db.collection('candidates').doc(id).delete();
      console.log(`Candidate ${id} deleted successfully`);
    } catch (error) {
      console.error('Error deleting candidate:', error);
      throw new Error('Failed to delete candidate');
    }
  }
}

module.exports = Candidate;
