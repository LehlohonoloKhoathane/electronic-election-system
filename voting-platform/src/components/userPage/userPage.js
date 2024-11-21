import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import Swal from 'sweetalert2'; // Import Swal for notifications
import './userPage.css';

function UserPage() {
  const handleLogout = () => {
    // Add your logout logic here (using Firebase auth signOut)
    Swal.fire({
      icon: 'success',
      title: 'Logged Out',
      text: 'You have been successfully logged out.',
    });
  };

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>
      <p>Welcome </p>
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
        {/* Add more links to other admin pages as needed */}
      </div>
    </div>
  );
}

export default UserPage;
