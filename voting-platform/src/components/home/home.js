import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Import Firestore instance
import { collection, getDocs } from 'firebase/firestore'; // Import Firestore methods
import './home.css';

const Home = () => {
  const [candidates, setCandidates] = useState([]); // State to store candidates

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
          <h3>Our Candidates</h3>
          {candidates.length > 0 ? (
            <div className="candidates-list">
              {candidates.map((candidate) => (
                <div key={candidate.id} className="candidate-card">
                  <h4>{candidate.FullNames}</h4>
                  <p><strong>Party:</strong> {candidate.Party}</p>
                  <p><strong>Description:</strong> {candidate.Description}</p>
                  <div className='cButtons'>
                                <button className='viewManifesto'>View Manifesto</button>
                                <button className='voting'>Vote</button>
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
