import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import Swal from 'sweetalert2'; // Import Swal for notifications
import { signOut, onAuthStateChanged } from 'firebase/auth'; // Import Firebase auth methods
import { auth, db } from '../firebase'; // Import Firebase auth instance and Firestore database
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore methods
import './userPage.css';

function UserPage() {
  const navigate = useNavigate(); // Initialize the navigate hook
  const [userName, setUserName] = useState(''); // State to hold user name
  const [userRole, setUserRole] = useState(''); // State to hold user role
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State to track if user is authenticated

  // Get user details when the component mounts
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        const fetchUserDetails = async () => {
          try {
            const userRef = doc(db, 'Users', user.uid); // Get user reference from Firestore
            const userDoc = await getDoc(userRef); // Fetch user document from Firestore
            if (userDoc.exists()) {
              const userData = userDoc.data();
              setUserName(userData.firstName || 'User'); // Set the user name
              setUserRole(userData.role || 'user'); // Set the user role
            }
          } catch (error) {
            console.error('Error fetching user details:', error);
          }
        };

        fetchUserDetails();
      } else {
        setIsAuthenticated(false);
        setUserName('');
        setUserRole('');
      }
    });

    return () => unsubscribe(); // Clean up the subscription on unmount
  }, []);

  const handleLogout = async () => {
    try {
      // Sign the user out using Firebase auth
      await signOut(auth);

      // Clear authentication-related state
      setIsAuthenticated(false);
      setUserName('');
      setUserRole('');

      // Show logout success notification
      Swal.fire({
        icon: 'success',
        title: 'Logged Out',
        text: 'You have been successfully logged out.',
      });

      // Redirect to login page after successful logout
      navigate('/login');
    } catch (error) {
      // Show error notification if logout fails
      Swal.fire({
        icon: 'error',
        title: 'Logout Failed',
        text: 'There was an issue logging out. Please try again.',
      });
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="admin-page">
      <h1>User Dashboard</h1>
      {isAuthenticated ? (
        <p>Welcome, {userName} ({userRole})</p> // Display the authenticated user's name and role
      ) : (
        <p>Please log in to access the user page</p> // Display message when the user is not authenticated
      )}
      <div className="admin-links">
        <Link to="/candidates" className="admin-link">
          Vote
        </Link>
        <Link to="/results" className="admin-link">
          View Results
        </Link>
        <Link to="/manageProfile" className="admin-link">
          Manage Profile
        </Link>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </div>
  );
}

export default UserPage;
