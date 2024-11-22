// import './results.css';
// import React, { useState, useEffect } from 'react';
// import { db } from '../firebase'; // Importing firebase instance
// import { collection, onSnapshot } from 'firebase/firestore'; // Using `onSnapshot` for real-time updates
// import { toast } from 'react-toastify';

// function Results() {
//   const [candidates, setCandidates] = useState([]);
//   const [totalVotes, setTotalVotes] = useState(0);
//   const [totalUsers, setTotalUsers] = useState(0); // To store the total number of registered users
//   const [votersCount, setVotersCount] = useState(0); // To store the number of users who voted
//   const [provincialData, setProvincialData] = useState({}); // To store provincial data

//   useEffect(() => {
//     // Real-time listener for candidates
//     const unsubscribeCandidates = onSnapshot(
//       collection(db, 'Candidates'),
//       (snapshot) => {
//         const candidatesData = snapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data(),
//         }));

//         // Calculate total votes and update state
//         const votesSum = candidatesData.reduce((sum, candidate) => sum + (candidate.Votes || 0), 0);
//         setCandidates(candidatesData);
//         setTotalVotes(votesSum);
//       },
//       (error) => {
//         console.error('Error fetching candidates: ', error);
//         toast.error('Failed to load candidates');
//       }
//     );

//     // Real-time listener for users
//     const unsubscribeUsers = onSnapshot(
//       collection(db, 'Users'),
//       (snapshot) => {
//         const usersData = snapshot.docs.map(doc => doc.data());

//         setTotalUsers(usersData.length); // Total registered users

//         // Filter users who have the 'Voted' attribute set to true and group by province
//         const voters = usersData.filter(user => user.Voted === true);
//         setVotersCount(voters.length);

//         // Group users by province and calculate voting percentages
//         const provinceCounts = {
//           'Gauteng': { total: 0, voted: 0 },
//           'Free State': { total: 0, voted: 0 },
//           'Western Cape': { total: 0, voted: 0 },
//           'Northern Cape': { total: 0, voted: 0 },
//           'Eastern Cape': { total: 0, voted: 0 },
//           'Kwazulu-Natal': { total: 0, voted: 0 },
//           'North West': { total: 0, voted: 0 },
//           'Mpumalanga': { total: 0, voted: 0 },
//           'Limpopo': { total: 0, voted: 0 },
//         };

//         usersData.forEach(user => {
//           if (provinceCounts[user.Province]) {
//             provinceCounts[user.Province].total += 1;
//             if (user.Voted) {
//               provinceCounts[user.Province].voted += 1;
//             }
//           }
//         });

//         // Calculate percentages for each province
//         const provincialResults = {};
//         for (const province in provinceCounts) {
//           const { total, voted } = provinceCounts[province];
//           provincialResults[province] = total > 0 ? Math.round((voted / total) * 100) : 0;
//         }

//         setProvincialData(provincialResults);
//       },
//       (error) => {
//         console.error('Error fetching users data: ', error);
//         toast.error('Failed to load users data');
//       }
//     );

//     // Cleanup listeners on unmount
//     return () => {
//       unsubscribeCandidates();
//       unsubscribeUsers();
//     };
//   }, []);

//   // Function to determine the color of the progress bar based on percentage
//   const getProgressBarColor = (percentage) => {
//     if (percentage < 25) return 'red';
//     if (percentage >= 25 && percentage < 50) return 'yellow';
//     if (percentage >= 50 && percentage < 75) return 'green';
//     return 'blue'; // For percentage 75 and above
//   };

//   return (
//     <section id="results">
//       <h2>Live Voting Results</h2>
//       <hr className="custom-hr" />
//       <div id="results-container">
//         {candidates.length > 0 ? (
//           <>
//             <div className="candidates-grid">
//               {candidates.map(candidate => {
//                 const votePercentage = totalVotes > 0 ? Math.round((candidate.Votes / totalVotes) * 100) : 0;
//                 const progressBarColor = getProgressBarColor(votePercentage); // Get the color based on percentage

//                 return (
//                   <div key={candidate.id} className="candidate-card">
//                     {/* Render candidate image */}
//                     {candidate.Images && (
//                       <img
//                         src={candidate.Images}
//                         alt={candidate.FullNames}
//                         className="candidate-image"
//                       />
//                     )}
//                     <h3>{candidate.FullNames}</h3>
//                     <p><strong>Votes:</strong> {candidate.Votes} ({votePercentage}%)</p>
//                     <div className="progress-bar-container">
//                       <div
//                         className="progress-bar"
//                         style={{ 
//                           width: `${votePercentage}%`,
//                           backgroundColor: progressBarColor // Apply dynamic color
//                         }}
//                       ></div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//             <p><strong>Total Votes:</strong> {totalVotes}</p>
//             <p><strong>Percentage of Users Voted:</strong> {totalUsers > 0 ? Math.round((votersCount / totalUsers) * 100) : 0}%</p>

//             <h3 className='provinceH'>Population Voted by Province.</h3>
//             <hr className="custom-hr" />
//             <div className="provincial-results">
//               {Object.entries(provincialData).map(([province, percentage]) => (
//                 <p key={province}><strong>{province}:</strong> {percentage}% </p>
//               ))}
//             </div>
//           </>
//         ) : (
//           <p>Loading results...</p>
//         )}
//       </div>
//     </section>
//   );
// }

// export default Results;

import './results.css';
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { toast } from 'react-toastify';

function Results() {
  const [candidates, setCandidates] = useState([]);
  const [totalVotes, setTotalVotes] = useState({
    Provincial: 0,
    Regional: 0,
    National: 0,
  });
  const [totalUsers, setTotalUsers] = useState(0); // Total registered users
  const [votersCount, setVotersCount] = useState(0); // Users who voted
  const [provincialData, setProvincialData] = useState({}); // Provincial data
  const [activeCategory, setActiveCategory] = useState('Provincial'); // State to track the active category

  useEffect(() => {
    // Real-time listener for candidates
    const unsubscribeCandidates = onSnapshot(
      collection(db, 'Candidates'),
      (snapshot) => {
        const candidatesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Calculate total votes per category (Provincial, Regional, National)
        const provincialVotes = candidatesData.reduce(
          (sum, candidate) => sum + (candidate.Votes?.Provincial || 0),
          0
        );
        const regionalVotes = candidatesData.reduce(
          (sum, candidate) => sum + (candidate.Votes?.Regional || 0),
          0
        );
        const nationalVotes = candidatesData.reduce(
          (sum, candidate) => sum + (candidate.Votes?.National || 0),
          0
        );

        setCandidates(candidatesData);
        setTotalVotes({
          Provincial: provincialVotes,
          Regional: regionalVotes,
          National: nationalVotes,
        });
      },
      (error) => {
        console.error('Error fetching candidates: ', error);
        toast.error('Failed to load candidates');
      }
    );

    // Real-time listener for users
    const unsubscribeUsers = onSnapshot(
      collection(db, 'Users'),
      (snapshot) => {
        const usersData = snapshot.docs.map((doc) => doc.data());

        setTotalUsers(usersData.length); // Total registered users

        // Filter users who have the 'Voted' attribute set to true
        const voters = usersData.filter((user) => user.Voted === true);
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

        usersData.forEach((user) => {
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
      },
      (error) => {
        console.error('Error fetching users data: ', error);
        toast.error('Failed to load users data');
      }
    );

    // Cleanup listeners on unmount
    return () => {
      unsubscribeCandidates();
      unsubscribeUsers();
    };
  }, []);

  // Function to determine the color of the progress bar based on percentage
  const getProgressBarColor = (percentage) => {
    if (percentage < 25) return 'red';
    if (percentage >= 25 && percentage < 50) return 'yellow';
    if (percentage >= 50 && percentage < 75) return 'green';
    return 'blue'; // For percentage 75 and above
  };

  return (
    <section id="results">
      <h2>Live Voting Results</h2>
      <hr className="custom-hr" />

      {/* Category Navigation */}
      <div className="category-nav">
        {['Provincial', 'Regional', 'National'].map((category) => (
          <button
            key={category}
            className={activeCategory === category ? 'active' : ''}
            onClick={() => setActiveCategory(category)}
          >
            {category} Results
          </button>
        ))}
      </div>

      <div id="results-container">
        {candidates.length > 0 ? (
          <>
            <div className="category-results">
              {/* Display results based on the active category */}
              {activeCategory && (
                <div>
                  <h3>{activeCategory} Results</h3>
                  <div className="candidates-grid">
                    {candidates.map((candidate) => {
                      const voteCount = candidate.Votes?.[activeCategory] || 0;
                      const votePercentage =
                        totalVotes[activeCategory] > 0
                          ? Math.round((voteCount / totalVotes[activeCategory]) * 100)
                          : 0;
                      const progressBarColor = getProgressBarColor(
                        votePercentage
                      );

                      return (
                        <div key={candidate.id} className="candidate-card">
                          {/* Render candidate image */}
                          {candidate.Images && (
                            <img
                              src={candidate.Images}
                              alt={candidate.FullNames}
                              className="candidate-image"
                            />
                          )}
                          <h3>{candidate.FullNames}</h3>
                          <p>
                            <strong>Votes:</strong> {voteCount} ({votePercentage}%)
                          </p>
                          <div className="progress-bar-container">
                            <div
                              className="progress-bar"
                              style={{
                                width: `${votePercentage}%`,
                                backgroundColor: progressBarColor,
                              }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <p>
                    <strong>Total Votes ({activeCategory}):</strong>{' '}
                    {totalVotes[activeCategory]}
                  </p>
                  <hr className="custom-hr" />
                </div>
              )}
            </div>

            <h3 className="provinceH">Population Voted by Province.</h3>
            <hr className="custom-hr" />
            <div className="provincial-results">
              {Object.entries(provincialData).map(([province, percentage]) => (
                <p key={province}><strong>{province}:</strong> {percentage}%</p>
              ))}
            </div>

            <p>
              <strong>Percentage of Users Voted:</strong>{' '}
              {totalUsers > 0 ? Math.round((votersCount / totalUsers) * 100) : 0}%
            </p>
          </>
        ) : (
          <p>Loading results...</p>
        )}
      </div>
    </section>
  );
}

export default Results;
