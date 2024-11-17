import './results.css';
import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Importing firebase instance
import { collection, getDocs } from 'firebase/firestore';
import { toast } from 'react-toastify';

function Results() {
  const [candidates, setCandidates] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0); // To store the total number of registered users
  const [votersCount, setVotersCount] = useState(0); // To store the number of users who voted
  const [provincialData, setProvincialData] = useState({}); // To store provincial data

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

    // Fetch total users and voters count by province
    const fetchUsersData = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, 'Users'));
        const usersData = usersSnapshot.docs.map(doc => doc.data());

        setTotalUsers(usersData.length); // Total registered users

        // Filter users who have the 'Voted' attribute set to true and group by province
        const voters = usersData.filter(user => user.Voted === true);
        setVotersCount(voters.length);

        // Group users by province and calculate voting percentages
        const provinceCounts = {
          'Gauteng': { total: 0, voted: 0 },
          'Free State': { total: 0, voted: 0 },
          'Western Cape': { total: 0, voted: 0 },
          'Northern Cape': { total: 0, voted: 0 },
          'Eastern Cape': { total: 0, voted: 0 },
          'Kwazulu-Natal': { total: 0, voted: 0 },
          'North West': { total: 0, voted: 0 },
          'Mpumalanga': { total: 0, voted: 0 },
          'Limpopo': { total: 0, voted: 0 },
        };

        usersData.forEach(user => {
          if (provinceCounts[user.Province]) {
            provinceCounts[user.Province].total += 1;
            if (user.Voted) {
              provinceCounts[user.Province].voted += 1;
            }
          }
        });

        // Calculate percentages for each province
        const provincialResults = {};
        for (const province in provinceCounts) {
          const { total, voted } = provinceCounts[province];
          provincialResults[province] = total > 0 ? Math.round((voted / total) * 100) : 0;
        }

        setProvincialData(provincialResults);
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
            <div className="candidates-grid">
              {candidates.map(candidate => {
                const votePercentage = totalVotes > 0 ? Math.round((candidate.Votes / totalVotes) * 100) : 0;

                return (
                  <div key={candidate.id} className="candidate-card">
                    <h3>{candidate.FullNames}</h3>
                    <p><strong>Votes:</strong> {candidate.Votes} ({votePercentage}%)</p>
                    <div className="progress-bar-container">
                      <div
                        className="progress-bar"
                        style={{ width: `${votePercentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
            <p><strong>Total Votes:</strong> {totalVotes}</p>
            <p><strong>Percentage of Users Voted:</strong> {totalUsers > 0 ? Math.round((votersCount / totalUsers) * 100) : 0}%</p>

            <h3>Provincial Voting Results</h3>
            <div className="provincial-results">
              {Object.entries(provincialData).map(([province, percentage]) => (
                <p key={province}><strong>{province}:</strong> {percentage}% of users voted</p>
              ))}
            </div>
          </>
        ) : (
          <p>Loading results...</p>
        )}
      </div>
    </section>
  );
}

export default Results;
