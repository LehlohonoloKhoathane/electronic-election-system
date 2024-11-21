import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot, doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import Swal from 'sweetalert2'; // Import Swal for alerts
import './candidates.css';

function Candidates() {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [hasVoted, setHasVoted] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                checkIfUserVoted(currentUser.uid);
            } else {
                navigate('/login');
            }
        });

        const unsubscribeCandidates = onSnapshot(collection(db, 'Candidates'), (snapshot) => {
            const candidateList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setCandidates(candidateList);
            setLoading(false);
        });

        return () => {
            unsubscribeAuth();
            unsubscribeCandidates();
        };
    }, [navigate]);

    const checkIfUserVoted = async (userId) => {
        try {
            const userDoc = doc(db, 'Users', userId);
            const userSnapshot = await getDoc(userDoc);

            if (userSnapshot.exists()) {
                const userData = userSnapshot.data();
                setHasVoted(userData.Voted || false);
            }
        } catch (error) {
            console.error('Error checking user vote status:', error);
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
                    Votes: increment(1),
                });

                const userRef = doc(db, 'Users', user.uid);
                await updateDoc(userRef, {
                    Voted: true,
                });

                setHasVoted(true);

                Swal.fire({
                    icon: 'success',
                    title: 'Vote Cast',
                    text: `You have successfully voted for ${candidateName}!`,
                    timer: 3000,
                    showConfirmButton: false,
                });
            } catch (error) {
                console.error('Error voting:', error);
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

    const handleViewManifesto = async (candidateId) => {
        try {
            const candidateDoc = doc(db, 'Candidates', candidateId);
            const candidateSnapshot = await getDoc(candidateDoc);

            if (candidateSnapshot.exists()) {
                const { Manifesto } = candidateSnapshot.data();
                Swal.fire({
                    title: 'Candidate Manifesto',
                    text: Manifesto || 'No manifesto available.',
                    icon: 'info',
                    confirmButtonText: 'Close',
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Candidate not found.',
                    icon: 'error',
                    confirmButtonText: 'Close',
                });
            }
        } catch (error) {
            console.error('Error fetching manifesto:', error);
            Swal.fire({
                title: 'Error',
                text: 'Unable to fetch manifesto. Please try again.',
                icon: 'error',
                confirmButtonText: 'Close',
            });
        }
    };

    return (
        <section id="candidates">
            <h2>Meet the Candidates</h2>
            <div id="candidates-container">
                {loading ? (
                    <p>Loading candidate information...</p>
                ) : (
                    candidates.map((candidate) => (
                        <div key={candidate.id} className="candidate-card">
                            {candidate.Images && (
                                <img
                                    src={candidate.Images}
                                    alt={`Pictur of ${candidate.FullNames}`}
                                    className="candidate-image"
                                />
                            )}
                            <h3>{candidate.FullNames}</h3>
                            <p>{candidate.Party}</p>
                            <p>{candidate.Description}</p>
                            <div className="cButtons">
                                <button
                                    className="viewManifesto"
                                    onClick={() => handleViewManifesto(candidate.id)}
                                >
                                    View Manifesto
                                </button>
                                <button
                                    className="voting"
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
