import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot, doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import Swal from 'sweetalert2'; // Import Swal for alerts
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
            const userDoc = doc(db, 'Users', userId); 
            const userSnapshot = await getDoc(userDoc);

            if (userSnapshot.exists()) {
                const userData = userSnapshot.data();
                setHasVoted(userData.Voted || false); // Set the hasVoted state based on the user's record
            }
        } catch (error) {
            console.error("Error checking user vote status:", error);
        }
    };

    const handleVote = async (candidateId, candidateName) => {
        if (!user) {
            Swal.fire({
                icon: 'error',
                title: 'Unauthorized',
                text: 'Please log in to vote.',
                timer: 2000,
                showConfirmButton: false,
            });
            return;
        }

        if (hasVoted) {
            Swal.fire({
                icon: 'info',
                title: 'Already Voted',
                text: 'You have already voted.',
                timer: 2000,
                showConfirmButton: false,
            });
            return;
        }

        // Confirm the vote before casting
        const confirmVote = await Swal.fire({
            title: `Confirm Your Vote`,
            text: `Are you sure you want to vote for ${candidateName}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
        });

        if (confirmVote.isConfirmed) {
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

                // Notify the user of successful voting
                Swal.fire({
                    icon: 'success',
                    title: 'Vote Cast',
                    text: `You have successfully voted for ${candidateName}!`,
                    timer: 3000,
                    showConfirmButton: false,
                });
            } catch (error) {
                console.error("Error voting:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error casting vote. Please try again.',
                    timer: 3000,
                    showConfirmButton: false,
                });
            }
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
                            {candidate.Images && (
                                <img src={candidate.Images} alt={`Pic of ${candidate.FullNames}`} className="candidate-image"/>
                            )}
                            <h3>{candidate.FullNames}</h3>
                            <p>{candidate.Party}</p>
                            <p>{candidate.Description}</p>
                            
                            {/* Display the candidate's image */}
                            
                            <div className='cButtons'>
                                <button className='viewManifesto'>View Manifesto</button>
                                <button
                                    className='voting'
                                    onClick={() => handleVote(candidate.id, candidate.FullNames)}
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
