import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Import Firestore instance
import { collection, getDocs, query, where, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore'; // Firestore methods
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Firebase Authentication
import Swal from 'sweetalert2'; // Swal for alerts
import { useNavigate } from 'react-router-dom'; // For navigation (useNavigate instead of useHistory)
import './electionTypeSelector.css'; // Import CSS for styling

function ElectionTypeSelector() {
  const [electionTypes, setElectionTypes] = useState([]);
  const [selectedElection, setSelectedElection] = useState('');
  const [selectedElectionName, setSelectedElectionName] = useState(''); // Store selected election name
  const [isAdmin, setIsAdmin] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [user, setUser] = useState(null); // Store user information
  const navigate = useNavigate();

  // Fetch Election Types from Firestore
  useEffect(() => {
    const fetchElectionTypes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'ElectionTypes'));
        const elections = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setElectionTypes(elections);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Failed to load election types',
          text: 'Please try again later.',
        });
      }
    };
    fetchElectionTypes();
  }, []);

  // Fetch the logged-in user and their role
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Save user information
        const userRef = doc(db, 'Users', currentUser.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.role === 'admin') {
            setIsAdmin(true);
            // Fetch saved election type for the admin
            if (userData.selectedElection) {
              setSelectedElection(userData.selectedElection);
            }
          } else {
            // For non-admins, fetch only the candidates for the admin's saved election type
            if (userData.selectedElection) {
              setSelectedElection(userData.selectedElection);
              fetchCandidates(userData.selectedElection);
            } else {
              Swal.fire({
                icon: 'info',
                title: 'No Election Selected',
                text: 'Please contact the admin to set the election type.',
              });
            }
          }
        }
      } else {
        setIsAdmin(false);
      }
    });
  }, []);

  // Save selected election type to the admin's user record
  const saveElectionType = async (electionId) => {
    if (user) {
      try {
        const userRef = doc(db, 'Users', user.uid);
        await updateDoc(userRef, { selectedElection: electionId });
        Swal.fire({
          icon: 'success',
          title: 'Election type saved successfully',
          text: 'Users will now see only the candidates for this election.',
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error saving election type',
          text: 'Please try again later.',
        });
      }
    }
  };

  // Fetch Candidates for the selected election type
  const fetchCandidates = async (electionId) => {
    if (!electionId) return; // Skip if no election type selected

    try {
      // Fetch the election name using the election reference
      const electionRef = doc(db, 'ElectionTypes', electionId);
      const electionDoc = await getDoc(electionRef);
      if (electionDoc.exists()) {
        setSelectedElectionName(electionDoc.data().electionName); // Set election name for display

        // Fetch candidates using the election type reference
        const q = query(collection(db, 'Candidates'), where('electionType', '==', electionRef));
        const querySnapshot = await getDocs(q);
        setCandidates(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Election type not found',
          text: 'The selected election type does not exist.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error fetching candidates',
        text: 'There was an error fetching candidates.',
      });
    }
  };

  useEffect(() => {
    if (selectedElection) {
      fetchCandidates(selectedElection);
    }
  }, [selectedElection]);

  const handleElectionChange = (e) => {
    const electionId = e.target.value;
    setSelectedElection(electionId);
    setSelectedElectionName('');
    setCandidates([]);
    saveElectionType(electionId); // Save election type when admin selects it
  };

  return (
    <div className="admin-dashboard">
      {isAdmin ? (
        <>
          <h2>Admin Dashboard</h2>
          <div className="election-type-selector">
            <label>Select Election Type:</label>
            <select value={selectedElection} onChange={handleElectionChange}>
              <option value="">Select an election type</option>
              {electionTypes.map((election) => (
                <option key={election.id} value={election.id}>
                  {election.electionName}
                </option>
              ))}
            </select>
          </div>
          <div className="candidates-list">
            {selectedElection && candidates.length > 0 ? (
              <div>
                <h3>Candidates for {selectedElectionName}</h3>
                <ul>
                  {candidates.map((candidate) => (
                    <li key={candidate.id}>
                      <strong>{candidate.FullNames}</strong> - {candidate.Party}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>No candidates found for this election type.</p>
            )}
          </div>
        </>
      ) : (
        <div>
          <h2>Welcome</h2>
          <div className="candidates-list">
            {candidates.length > 0 ? (
              <div>
                <h3>Candidates for {selectedElectionName}</h3>
                <ul>
                  {candidates.map((candidate) => (
                    <li key={candidate.id}>
                      <strong>{candidate.FullNames}</strong> - {candidate.Party}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>No candidates available for the current election type.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ElectionTypeSelector;
