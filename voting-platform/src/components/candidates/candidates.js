// import './candidates.css';
// import React from 'react';

// function Candidates() {
//     return (
//         <section id="candidates">
//             <h2>Meet the Candidates</h2>
//             <div id="candidates-container">
//                 <p>Loading candidate information...</p> {/* Placeholder for candidate data */}
//             </div>
//         </section>
//     );
// }

// export default Candidates;

// import './candidates.css';
// import React, { useState, useEffect } from 'react';
// import { db } from "../firebase"; // Ensure firebase is correctly initialized
// import { collection, getDocs } from 'firebase/firestore'; // Correct imports from Firestore SDK

// function Candidates() {
//     const [candidates, setCandidates] = useState([]); // State to store candidates
//     const [loading, setLoading] = useState(true); // State to show loading message

//     // Fetch candidates when component mounts
//     useEffect(() => {
//         const fetchCandidates = async () => {
//             try {
//                 // Fetch candidates collection from Firestore
//                 const candidatesCollection = collection(db, "Candidates");
//                 const snapshot = await getDocs(candidatesCollection); // Get all documents from the 'Candidates' collection
//                 const candidateList = snapshot.docs.map(doc => ({
//                     id: doc.id, 
//                     ...doc.data()
//                 }));
//                 setCandidates(candidateList); // Set the state with the fetched data
//             } catch (error) {
//                 console.error('Error fetching candidates:', error);
//             } finally {
//                 setLoading(false); // Hide loading message once the data is fetched
//             }
//         };

//         fetchCandidates();
//     }, []); // Empty array ensures this effect runs once when the component mounts

//     return (
//         <section id="candidates">
//             <h2>Meet the Candidates</h2>
//             <div id="candidates-container">
//                 {loading ? (
//                     <p>Loading candidate information...</p> // Display loading message while fetching
//                 ) : (
//                     candidates.map(candidate => (
//                         <div key={candidate.id} className="candidate-card">
//                             <h3>{candidate.FullNames}</h3>
//                             <p>{candidate.Party}</p>
//                             <p>{candidate.Description}</p>
//                             <p>Votes: {candidate.Votes}</p>
//                         </div>
//                     ))
//                 )}
//             </div>
//         </section>
//     );
// }

// export default Candidates;


// import './candidates.css';
// import React, { useState, useEffect } from 'react';
// import { db } from "../firebase"; // Ensure firebase is correctly initialized
// import { collection, getDocs } from 'firebase/firestore'; // Correct imports from Firestore SDK
import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot, doc, updateDoc, increment } from 'firebase/firestore';
import './candidates.css';

function Candidates() {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Listen for authentication state changes
        const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                setUser(currentUser);
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

    const handleVote = async (candidateId) => {
        if (!user) {
            alert("Please log in to vote.");
            return;
        }

        try {
            const candidateRef = doc(db, 'Candidates', candidateId);
            await updateDoc(candidateRef, {
                Votes: increment(1)
            });
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
                            {/* <p>Votes: {candidate.Votes}</p> */}
                            <div className='cButtons'>
                                <button className='viewManifesto'>View Manifesto</button>
                                <button className='voting' onClick={() => handleVote(candidate.id)}>Vote</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}

export default Candidates;





