// import React, { useEffect, useState } from 'react';
// import { auth, db } from '../firebase';
// import { useNavigate } from 'react-router-dom';
// import { collection, onSnapshot, doc, updateDoc, increment } from 'firebase/firestore';
// import './candidates.css';

// function Candidates() {
//     const [candidates, setCandidates] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [user, setUser] = useState(null);
//     const navigate = useNavigate();

//     useEffect(() => {
//         // Listen for authentication state changes
//         const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
//             if (currentUser) {
//                 setUser(currentUser);
//             } else {
//                 // Redirect to login page if user is not authenticated
//                 navigate('/login');
//             }
//         });

//         // Fetch real-time updates from Firestore
//         const unsubscribeCandidates = onSnapshot(collection(db, 'Candidates'), (snapshot) => {
//             const candidateList = snapshot.docs.map(doc => ({
//                 id: doc.id,
//                 ...doc.data()
//             }));
//             setCandidates(candidateList);
//             setLoading(false);
//         });

//         return () => {
//             unsubscribeAuth();
//             unsubscribeCandidates();
//         };
//     }, [navigate]);

//     const handleVote = async (candidateId) => {
//         if (!user) {
//             alert("Please log in to vote.");
//             return;
//         }

//         try {
//             const candidateRef = doc(db, 'Candidates', candidateId);
//             await updateDoc(candidateRef, {
//                 Votes: increment(1)
//             });
//             alert("Vote cast successfully!");
//         } catch (error) {
//             console.error("Error voting:", error);
//             alert("Error casting vote. Please try again.");
//         }
//     };

//     return (
//         <section id="candidates">
//             <h2>Meet the Candidates</h2>
//             <div id="candidates-container">
//                 {loading ? (
//                     <p>Loading candidate information...</p>
//                 ) : (
//                     candidates.map(candidate => (
//                         <div key={candidate.id} className="candidate-card">
//                             <h3>{candidate.FullNames}</h3>
//                             <p>{candidate.Party}</p>
//                             <p>{candidate.Description}</p>
//                             {/* <p>Votes: {candidate.Votes}</p> */}
//                             <div className='cButtons'>
//                                 <button className='viewManifesto'>View Manifesto</button>
//                                 <button className='voting' onClick={() => handleVote(candidate.id)}>Vote</button>
//                             </div>
//                         </div>
//                     ))
//                 )}
//             </div>
//         </section>
//     );
// }

// export default Candidates;


import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot, doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import './candidates.css';

function Candidates() {
    const [candidates, setCandidates] = useState([]); // State for candidates
    const [loading, setLoading] = useState(true); // Loading state for candidates
    const [user, setUser] = useState(null); // User state
    const [hasVoted, setHasVoted] = useState(false); // State to track if the user has voted
    const navigate = useNavigate(); // For navigation

    useEffect(() => {
        // Listen for authentication state changes
        const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                checkIfUserVoted(currentUser.uid); // Check if the user has voted
            } else {
                // Redirect to login page if user is not authenticated
                navigate('/login');
            }
        });

        // Fetch real-time updates from Firestore
        const unsubscribeCandidates = onSnapshot(collection(db, 'Candidates'), (snapshot) => {
            const candidateList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCandidates(candidateList);
            setLoading(false);
        });

        return () => {
            unsubscribeAuth();
            unsubscribeCandidates();
        };
    }, [navigate]);

    // Function to check if the user has already voted
    const checkIfUserVoted = async (userId) => {
        try {
            const userDoc = doc(db, 'Users', userId); // Assuming you have a Users collection
            const userSnapshot = await getDoc(userDoc);

            if (userSnapshot.exists()) {
                const userData = userSnapshot.data();
                setHasVoted(userData.Voted || false); // Set the hasVoted state based on the user's record
            }
        } catch (error) {
            console.error("Error checking user vote status:", error);
        }
    };

    const handleVote = async (candidateId) => {
        if (!user) {
            alert("Please log in to vote.");
            return;
        }

        if (hasVoted) {
            alert("You have already voted.");
            return;
        }

        try {
            const candidateRef = doc(db, 'Candidates', candidateId);
            await updateDoc(candidateRef, {
                Votes: increment(1)
            });

            // Update the user record to mark them as having voted
            const userRef = doc(db, 'Users', user.uid); // Reference to the current user
            await updateDoc(userRef, {
                Voted: true // Mark user as voted
            });

            setHasVoted(true); // Update local state to reflect that the user has voted
            alert("Vote cast successfully!");
        } catch (error) {
            console.error("Error voting:", error);
            alert("Error casting vote. Please try again.");
        }
    };

    return (
        <section id="candidates">
            <h2>Meet the Candidates</h2>
            <div id="candidates-container">
                {loading ? (
                    <p>Loading candidate information...</p>
                ) : (
                    candidates.map(candidate => (
                        <div key={candidate.id} className="candidate-card">
                            <h3>{candidate.FullNames}</h3>
                            <p>{candidate.Party}</p>
                            <p>{candidate.Description}</p>
                            <div className='cButtons'>
                                <button className='viewManifesto'>View Manifesto</button>
                                <button
                                    className='voting'
                                    onClick={() => handleVote(candidate.id)}
                                    // disabled={hasVoted} // Disable the vote button if the user has already voted
                                >
                                    Vote
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}

export default Candidates;
