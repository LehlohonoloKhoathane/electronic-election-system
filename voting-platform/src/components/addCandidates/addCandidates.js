import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Import your Firestore instance
import { collection, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { toast } from 'react-toastify';
import './addCandidates.css'; // Import the CSS file

function AddCandidates() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [candidate, setCandidate] = useState({ name: '', votingType: '' });

  useEffect(() => {
    const checkAdmin = async () => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          user.getIdTokenResult().then((idTokenResult) => {
            if (idTokenResult.claims.role === 'admin') {
              setIsAdmin(true);
            }
          });
        }
      });
    };
    checkAdmin();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'candidates'), candidate);
      toast.success('Candidate added successfully!');
      setCandidate({ name: '', votingType: '' }); // Reset form
    } catch (error) {
      console.error('Error adding candidate: ', error);
      toast.error('Failed to add candidate');
    }
  };

  if (!isAdmin) {
    return <p className="error-message">Access denied. Only admins can add candidates.</p>;
  }

  return (
    <div className="form-container">
      <h2>Add Candidate</h2>
      <form onSubmit={handleSubmit} className="candidate-form">
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={candidate.name}
            onChange={(e) => setCandidate({ ...candidate, name: e.target.value })}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Voting Type:</label>
          <input
            type="text"
            value={candidate.votingType}
            onChange={(e) => setCandidate({ ...candidate, votingType: e.target.value })}
            required
            className="form-input"
          />
        </div>
        <button type="submit" className="submit-button">Add Candidate</button>
      </form>
    </div>
  );
}

export default AddCandidates;
