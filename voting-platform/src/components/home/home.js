import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Import Firestore instance
import { collection, getDocs } from 'firebase/firestore'; // Import Firestore methods
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import Swal from 'sweetalert2'; // Import Swal for notifications
import './home.css';

const Home = () => {
  const [candidates, setCandidates] = useState([]); // State to store candidates
  const navigate = useNavigate(); // Create a navigate function

  // Fetch candidates from Firestore
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Candidates'));
        const candidatesList = querySnapshot.docs.map((doc) => ({
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

  // Handler to display the manifesto using Swal
  const handleViewManifesto = (manifesto) => {
    Swal.fire({
      title: 'Candidate Manifesto',
      html: `<p>${manifesto}</p>`,
      icon: 'info',
      confirmButtonText: 'Close',
    });
  };

  // Handler for voting action
  const handleVoteClick = () => {
    Swal.fire({
      title: 'Sign to Vote',
      text: 'Please sign in to proceed with voting.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sign In',
      cancelButtonText: 'Close',
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/register'); // Redirect to the login page
      }
    });
  };

  return (
    <section className="home-container" id="home-container">
      <div className="blur HomeBlur"></div>
      <div className="home-content">
        <div className="heading-container">
          <h2>K-Votex, your secure and trusted destination for casting your vote online.</h2>
        </div>
        <hr className="custom-hr" />
        <div className="paragraph-container">
          <p>
            Experience a streamlined, user-friendly, and fully protected voting process from the comfort of your home.
            Your voice matters!
          </p>
        </div>

        {/* Display Candidates */}
        <div className="candidates-container">
          <h3>Meet Our Candidates</h3>
          <hr className="custom-hr" />
          {candidates.length > 0 ? (
            <div className="candidates-list">
              {candidates.map((candidate) => (
                <div key={candidate.id} className="candidate-card">
                  {/* Add image here */}
                  {candidate.Images && (
                    <img src={candidate.Images} alt={candidate.FullNames} className="candidate-image" />
                  )}
                  <h4>{candidate.FullNames}</h4>
                  <p>
                    <strong>Party:</strong> {candidate.Party}
                  </p>
                  <p>
                    <strong>Description:</strong> {candidate.Description}
                  </p>
                  <div className="cButtons">
                    <button className="viewManifesto" onClick={() => handleViewManifesto(candidate.Manifesto)}>
                      View Manifesto
                    </button>
                    <button className="voting" onClick={handleVoteClick}>
                      Vote
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No candidates available at the moment.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Home;
