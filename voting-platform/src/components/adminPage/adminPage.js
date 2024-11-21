import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate for navigation
import Swal from 'sweetalert2'; // Import Swal for notifications
import { signOut } from 'firebase/auth'; // Import Firebase auth signOut method
import { auth } from '../firebase'; // Import Firebase auth instance
import './adminPage.css';

function AdminPage() {
  const navigate = useNavigate(); // Initialize navigate hook

  // Handle the logout process
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        
        // setIsAuthenticated(false);
        // setUserName('');
        // setUserRole('');

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
      <p>Welcome</p>
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
