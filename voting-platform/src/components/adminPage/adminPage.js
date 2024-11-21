import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate for navigation
import Swal from 'sweetalert2'; // Import Swal for notifications
import { signOut, onAuthStateChanged } from 'firebase/auth'; // Import Firebase auth methods
import { auth, db } from '../firebase'; // Import Firebase auth instance and Firestore database
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore methods
import './adminPage.css';

function AdminPage() {
  const navigate = useNavigate(); // Initialize navigate hook
  const [userName, setUserName] = useState(''); // State to hold the user's name
  const [userRole, setUserRole] = useState(''); // State to hold the user's role
  const [isAuthenticated, setIsAuthenticated] = useState(false); // To check authentication status

  // Get the logged-in user's name and role on component mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        const fetchUserDetails = async () => {
          try {
            const userRef = doc(db, 'Users', user.uid);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
              const userData = userDoc.data();
              setUserName(userData.firstName || 'User'); // Set first name or fallback to 'User'
              setUserRole(userData.role || 'user'); // Set role or fallback to 'user'
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

    return () => unsubscribe(); // Clean up subscription on unmount
  }, []);

  // Handle the logout process
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Show logout success notification
        Swal.fire({
          icon: 'success',
          title: 'Logged Out',
          text: 'You have been successfully logged out.',
        });

        // Redirect to the login page after successful logout
        navigate('/login');
      })
      .catch((error) => {
        // Show error notification if logout fails
        Swal.fire({
          icon: 'error',
          title: 'Logout Failed',
          text: 'There was an issue logging out. Please try again.',
        });
        console.error('Error signing out:', error);
      });
  };

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>
      {isAuthenticated ? (
        <p>Welcome, {userName} </p> // Display user name and role
      ) : (
        <p>Please log in to access the admin page</p>
      )}
      <div className="admin-links">
        <Link to="/addElectionType" className="admin-link">
          Add Election Type
        </Link>
        <Link to="/addCandidates" className="admin-link">
          Add Candidates
        </Link>
        <Link to="/manageDatabase" className="admin-link">
          Manage Database
        </Link>
        <Link to="/electionTypeSelector" className="admin-link">
          Manage Vote Type
        </Link>
      </div>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
}

export default AdminPage;
