import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Import Firestore instance
import { collection, getDocs } from 'firebase/firestore'; // Import Firestore methods
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { toast } from 'react-toastify'; // Import toast for notifications
import 'react-toastify/dist/ReactToastify.css'; // Import toast CSS
import './home.css';

const Home = () => {
  const [candidates, setCandidates] = useState([]); // State to store candidates
  const [showManifestoModal, setShowManifestoModal] = useState(false); // State to control Manifesto modal visibility
  const [showVoteModal, setShowVoteModal] = useState(false); // State to control Vote modal visibility
  const [selectedManifesto, setSelectedManifesto] = useState(''); // State to store the selected manifesto
  const navigate = useNavigate(); // Create a navigate function

  // Fetch candidates from Firestore
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Candidates'));
        const candidatesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCandidates(candidatesList);
      } catch (error) {
        console.error('Error fetching candidates: ', error);
      }
    };

    fetchCandidates();
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts

  // Handler for the "Vote" button click
  const handleVoteClick = () => {
    setShowVoteModal(true); // Show the "Sign to Vote" modal
  };

  // Handler to open the modal and set the selected manifesto
  const handleViewManifesto = (manifesto) => {
    setSelectedManifesto(manifesto);
    setShowManifestoModal(true); // Show manifesto modal when the button is clicked
  };

  // Handler to close the manifesto modal
  const closeManifestoModal = () => {
    setShowManifestoModal(false); // Hide the manifesto modal
    setSelectedManifesto(''); // Clear the manifesto
  };

  // Handler to close the vote modal
  const closeVoteModal = () => {
    setShowVoteModal(false); // Hide the vote modal
  };

  // Handler for the "Okay" button on the vote modal (redirect to the voting page)
  const handleOkayVote = () => {
    navigate('/login'); // Redirect to the voting page
    setShowVoteModal(false); // Close the vote modal
  };

  return (
    <section className="home-container" id="home-container">
      <div className="blur HomeBlur"></div>
      <div className="home-content">
        <div className="heading-container">
          <h2>Welcome to K-Votex, your secure and trusted destination for casting your vote online.</h2>
        </div>
        <hr className="custom-hr" />
        <div className="paragraph-container">
          <p>Experience a streamlined, user-friendly, and fully protected voting process from the comfort of your home. Your voice matters, and we've made it easier than ever to ensure it's heard. Participate, engage, and make a difference—anytime, anywhere. Start your journey now and be a part of the change!</p>
        </div>

        {/* Display Candidates */}
        <div className="candidates-container">
          <h3>Meet Our Candidates</h3>
          <hr className="custom-hr" />
          {candidates.length > 0 ? (
            <div className="candidates-list">
              {candidates.map((candidate) => (
                <div key={candidate.id} className="candidate-card">
                  <h4>{candidate.FullNames}</h4>
                  <p><strong>Party:</strong> {candidate.Party}</p>
                  <p><strong>Description:</strong> {candidate.Description}</p>
                  <div className="cButtons">
                    <button className="viewManifesto" onClick={() => handleViewManifesto(candidate.Manifesto)}>
                      View Manifesto
                    </button>
                    <button className="voting" onClick={handleVoteClick}>Vote</button> {/* Add click handler */}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No candidates available at the moment.</p>
          )}
        </div>
      </div>

      {/* Manifesto Modal */}
      {showManifestoModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Candidate Manifesto</h2>
            <p>{selectedManifesto}</p>
            <div className="modal-buttons">
              <button className="close-modal-btn" onClick={closeManifestoModal}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Vote Modal (Sign to Vote) */}
      {showVoteModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Sign to Vote</h2>
            <p>Please sign in to proceed with voting.</p>
            <div className="modal-buttons">
              <button className="okay-btn" onClick={handleOkayVote}>Okay</button>
              <button className="close-modal-btn" onClick={closeVoteModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Home;
