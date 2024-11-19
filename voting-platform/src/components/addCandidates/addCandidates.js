import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Import Firestore instance
import { collection, getDocs, addDoc, doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Import Firebase Auth
import Swal from 'sweetalert2'; // Import Swal
import './addCandidates.css';

function AddCandidates() {
  const [electionTypes, setElectionTypes] = useState([]);
  const [selectedElection, setSelectedElection] = useState('');
  const [candidate, setCandidate] = useState({
    FullNames: '',
    Description: '',
    Party: '',
    Manifesto: '',
  });
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Fetch election types from Firestore
  useEffect(() => {
    const fetchElectionTypes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'ElectionTypes'));
        const elections = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (elections.length === 0) {
          Swal.fire({
            icon: 'info',
            title: 'No election types available',
            text: 'Please add election types before adding candidates.',
          });
        }

        console.log('Fetched Elections: ', elections);
        setElectionTypes(elections);
      } catch (error) {
        console.error('Error fetching election types: ', error);
        Swal.fire({
          icon: 'error',
          title: 'Failed to load election types',
          text: 'Please try again later.',
        });
      }
    };

    fetchElectionTypes();
  }, []);

  // Check if the current user is an admin
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        try {
          // Fetch user profile from Firestore
          const userRef = doc(db, 'Users', user.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.role === 'admin') {
              setIsAdmin(true);
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Permission Denied',
                text: 'You do not have permission to add candidates.',
              });
            }
          } else {
            Swal.fire({
              icon: 'error',
              title: 'User profile not found',
              text: 'Please ensure you have a valid user profile.',
            });
          }
        } catch (error) {
          console.error('Error checking user role: ', error);
          Swal.fire({
            icon: 'error',
            title: 'Error verifying user role',
            text: 'Please try again later.',
          });
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedElection) {
      Swal.fire({
        icon: 'error',
        title: 'Election Not Selected',
        text: 'Please select an election.',
      });
      return;
    }

    if (!isAdmin) {
      Swal.fire({
        icon: 'error',
        title: 'Permission Denied',
        text: 'Only an admin can add candidates.',
      });
      return;
    }

    try {
      const electionRef = doc(db, 'ElectionTypes', selectedElection);
      const candidateRef = await addDoc(collection(db, 'Candidates'), {
        FullNames: candidate.FullNames,
        Description: candidate.Description,
        Party: candidate.Party,
        Manifesto: candidate.Manifesto,
        Votes: 0,
        electionType: electionRef,
      });

      console.log('Candidate added with ID: ', candidateRef.id);
      Swal.fire({
        icon: 'success',
        title: 'Candidate Added',
        text: 'The candidate has been added successfully!',
      });
      setCandidate({ FullNames: '', Description: '', Party: '', Manifesto: '' });
      setSelectedElection('');
    } catch (error) {
      console.error('Error adding candidate: ', error.message);
      Swal.fire({
        icon: 'error',
        title: 'Failed to Add Candidate',
        text: 'There was an error while adding the candidate. Please try again.',
      });
    }
  };

  return (
    <div className="form-container">
      {isAdmin ? (
        <>
          <h2>Add Candidate</h2>
          <form onSubmit={handleSubmit} className="candidate-form">
            <div className="form-group">
              <label>Select Election:</label>
              <select
                value={selectedElection}
                onChange={(e) => setSelectedElection(e.target.value)}
                required
                className="form-input"
              >
                <option value="">Select an election</option>
                {electionTypes.map((election) => (
                  <option key={election.id} value={election.id}>
                    {election.electionName}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                value={candidate.FullNames}
                onChange={(e) => setCandidate({ ...candidate, FullNames: e.target.value })}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={candidate.Description}
                onChange={(e) => setCandidate({ ...candidate, Description: e.target.value })}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Party:</label>
              <input
                type="text"
                value={candidate.Party}
                onChange={(e) => setCandidate({ ...candidate, Party: e.target.value })}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Manifesto:</label>
              <textarea
                value={candidate.Manifesto}
                onChange={(e) => setCandidate({ ...candidate, Manifesto: e.target.value })}
                required
                className="form-input"
              />
            </div>
            <button type="submit" className="submit-button">Add Candidate</button>
          </form>
        </>
      ) : (
        <p>You do not have permission to access this page.</p>
      )}
    </div>
  );
}

export default AddCandidates;
