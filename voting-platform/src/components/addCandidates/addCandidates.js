// import React, { useState } from 'react';
// import { db } from '../firebase'; // Import your Firestore instance
// import { collection, addDoc } from 'firebase/firestore';
// import { toast } from 'react-toastify';
// import './addCandidates.css'; // Import the CSS file

// function AddCandidates() {
//   const [candidate, setCandidate] = useState({ name: '', votingType: '' });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await addDoc(collection(db, 'candidates'), candidate);
//       toast.success('Candidate added successfully!');
//       setCandidate({ name: '', votingType: '' }); // Reset form
//     } catch (error) {
//       console.error('Error adding candidate: ', error);
//       toast.error('Failed to add candidate');
//     }
//   };

//   return (
//     <div className="form-container">
//       <h2>Add Candidate</h2>
//       <form onSubmit={handleSubmit} className="candidate-form">
//         <div className="form-group">
//           <label>Name:</label>
//           <input
//             type="text"
//             value={candidate.name}
//             onChange={(e) => setCandidate({ ...candidate, name: e.target.value })}
//             required
//             className="form-input"
//           />
//         </div>
//         <div className="form-group">
//           <label>Voting Type:</label>
//           <input
//             type="text"
//             value={candidate.votingType}
//             onChange={(e) => setCandidate({ ...candidate, votingType: e.target.value })}
//             required
//             className="form-input"
//           />
//         </div>
//         <button type="submit" className="submit-button">Add Candidate</button>
//       </form>
//     </div>
//   );
// }

// export default AddCandidates;
import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Import your Firestore instance
import { collection, getDocs, addDoc, doc } from 'firebase/firestore'; // Import addDoc and doc for reference
import { toast } from 'react-toastify';
import './addCandidates.css';

function AddCandidates() {
  const [electionTypes, setElectionTypes] = useState([]);
  const [selectedElection, setSelectedElection] = useState('');
  const [candidate, setCandidate] = useState({
    FullNames: '',
    Description: '',
    Party: '',
    Manifesto: '', // Make sure Manifesto is included here
  });

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
          toast.info('No election types available');
        }

        console.log('Fetched Elections: ', elections);
        setElectionTypes(elections);
      } catch (error) {
        console.error('Error fetching election types: ', error);
        toast.error('Failed to load election types');
      }
    };

    fetchElectionTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedElection) {
      toast.error('Please select an election');
      return;
    }

    try {
      // Get the reference for the selected election type
      const electionRef = doc(db, 'ElectionTypes', selectedElection);

      // Add candidate to Firestore (Candidates collection)
      const candidateRef = await addDoc(collection(db, 'Candidates'), {
        FullNames: candidate.FullNames,
        Description: candidate.Description,
        Party: candidate.Party,
        Manifesto: candidate.Manifesto,
        Votes: 0, // Initialize with 0 votes
        electionType: electionRef, // Save as a reference to the ElectionTypes collection
      });

      console.log('Candidate added with ID: ', candidateRef.id);
      toast.success('Candidate added successfully!');
      setCandidate({ FullNames: '', Description: '', Party: '', Manifesto: '' });
      setSelectedElection('');
    } catch (error) {
      console.error('Error adding candidate: ', error.message); // Show specific error message
      toast.error('Failed to add candidate: ' + error.message); // Display detailed error
    }
  };

  return (
    <div className="form-container">
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
        {/* Candidate input fields */}
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
    </div>
  );
}

export default AddCandidates;
