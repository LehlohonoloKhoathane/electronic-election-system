// import './results.css';
// import React from 'react';

// function Results() {
//     return (
//         <section id="results">
//             <h2>Live Voting Results</h2>
//             <div id="results-container">
//                 <p>Loading results...</p> {/* Placeholder for real-time data */}
//             </div>
//         </section>
//     );
// }

// export default Results;

import './results.css';
import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Import your Firestore instance
import { collection, getDocs } from 'firebase/firestore';
import { toast } from 'react-toastify';

function Results() {
  const [candidates, setCandidates] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0); // To store the total number of registered users
  const [votersCount, setVotersCount] = useState(0); // To store the number of users who voted

  useEffect(() => {
    // Fetch candidates and their votes
    const fetchCandidates = async () => {
      try {
        const candidatesSnapshot = await getDocs(collection(db, 'Candidates'));
        const candidatesData = candidatesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Calculate total votes and update state
        const votesSum = candidatesData.reduce((sum, candidate) => sum + (candidate.Votes || 0), 0);
        setCandidates(candidatesData);
        setTotalVotes(votesSum);

      } catch (error) {
        console.error('Error fetching candidates: ', error);
        toast.error('Failed to load candidates');
      }
    };

    // Fetch total users and voters count
    const fetchUsersData = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, 'Users'));
        const usersData = usersSnapshot.docs.map(doc => doc.data());

        setTotalUsers(usersData.length); // Total registered users

        // Assuming users have a 'hasVoted' field indicating if they have voted
        const voters = usersData.filter(user => user.hasVoted);
        setVotersCount(voters.length);

      } catch (error) {
        console.error('Error fetching users data: ', error);
        toast.error('Failed to load users data');
      }
    };

    fetchCandidates();
    fetchUsersData();
  }, []);

  return (
    <section id="results">
      <h2>Live Voting Results</h2>
      <div id="results-container">
        {candidates.length > 0 ? (
          <>
            <ul>
              {candidates.map(candidate => (
                <li key={candidate.id}>
                  <strong>{candidate.FullNames}</strong>: {candidate.Votes} votes
                </li>
              ))}
            </ul>
            <p><strong>Total Votes:</strong> {totalVotes}</p>
            <p><strong>Percentage of Users Voted:</strong> {totalUsers > 0 ? ((votersCount / totalUsers) * 100).toFixed(2) : 0}%</p>
          </>
        ) : (
          <p>Loading results...</p>
        )}
      </div>
    </section>
  );
}

export default Results;

