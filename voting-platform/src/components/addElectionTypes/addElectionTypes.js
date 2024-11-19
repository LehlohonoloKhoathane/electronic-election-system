import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDoc, doc } from 'firebase/firestore';
import { auth } from '../firebase'; // Import Firebase auth
import { onAuthStateChanged, signOut } from 'firebase/auth'; // Import signOut
import Swal from 'sweetalert2'; // Import SweetAlert2
import './addElectionTypes.css';

function AddElectionType() {
  const [electionName, setElectionName] = useState('');
  const [electionEndDate, setElectionEndDate] = useState('');
  const [isAdmin, setIsAdmin] = useState(false); // State to check if user is admin
  const [isLoggingOut, setIsLoggingOut] = useState(false); // State to track logout

  // Check if user is logged in and has admin privileges
  useEffect(() => {
    if (isLoggingOut) return; // Skip if logging out

    const checkUserStatus = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            // Check if the user has admin privileges
            const userDoc = await getDoc(doc(db, 'Users', user.uid));
            if (userDoc.exists() && userDoc.data().role === 'admin') {
              setIsAdmin(true);
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Access Denied',
                text: 'Admins only!',
              });
            }
          } catch (error) {
            console.error('Error checking admin privileges:', error);
            Swal.fire({
              icon: 'error',
              title: 'Verification Failed',
              text: 'Failed to verify admin privileges.',
            });
          }
        } else if (!isLoggingOut) {
          Swal.fire({
            icon: 'warning',
            title: 'Authentication Required',
            text: 'You must be logged in as an admin to add election types.',
          });
        }
      });
    };
    checkUserStatus();
  }, [isLoggingOut]);

  // Handle Logout
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut(auth);
      Swal.fire({
        icon: 'success',
        title: 'Logged Out',
        text: 'You have been successfully logged out.',
      });
      setIsAdmin(false);
    } catch (error) {
      console.error('Error logging out:', error);
      Swal.fire({
        icon: 'error',
        title: 'Logout Failed',
        text: 'Something went wrong. Please try again later.',
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleAddElectionType = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      Swal.fire({
        icon: 'error',
        title: 'Access Denied',
        text: 'Only admins can add election types.',
      });
      return;
    }

    if (!electionName || !electionEndDate) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please provide an election name and set an end date.',
      });
      return;
    }

    try {
      await addDoc(collection(db, 'ElectionTypes'), {
        electionName: electionName,
        electionEndDate: electionEndDate,
      });
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Election type added successfully!',
      });
      setElectionName('');
      setElectionEndDate('');
    } catch (error) {
      console.error('Error adding election type: ', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to add election type. Please try again later.',
      });
    }
  };

  return (
    <div className="election-form-container">
      {isAdmin ? (
        <>
          <h2>Add Election Type</h2>
          <form onSubmit={handleAddElectionType} className="election-form">
            <div className="form-group">
              <label>Election Name:</label>
              <input
                type="text"
                value={electionName}
                onChange={(e) => setElectionName(e.target.value)}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Election End Date:</label>
              <input
                type="date"
                value={electionEndDate}
                onChange={(e) => setElectionEndDate(e.target.value)}
                required
                className="form-input"
              />
            </div>
            <button type="submit" className="submit-button">Add Election Type</button>
          </form>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </>
      ) : (
        <p>You do not have the necessary permissions to access this page.</p>
      )}
    </div>
  );
}

export default AddElectionType;
