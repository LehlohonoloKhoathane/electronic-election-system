import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import Swal from 'sweetalert2'; // Import Swal for notifications
import { signOut } from 'firebase/auth'; // Import Firebase auth signOut method
import { auth } from '../firebase'; // Import Firebase auth instance
import './userPage.css';

function UserPage() {
  const navigate = useNavigate(); // Initialize the navigate hook
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Simulate authenticated state
  const [userName, setUserName] = useState('John Doe'); // Simulate user info
  const [userRole, setUserRole] = useState('Admin'); // Simulate user role

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
      <h1>Admin Dashboard</h1>
      <p>Welcome, {userName} ({userRole})</p>
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
