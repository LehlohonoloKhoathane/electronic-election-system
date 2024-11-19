import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import Swal from 'sweetalert2'; // Import Swal for notifications
import './adminPage.css';

function AdminPage() {
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
        <Link to="/addElectionType" className="admin-link">
          Add Election Type
        </Link>
        <Link to="/addCandidates" className="admin-link">
          Add Candidates
        </Link>
        {/* Add more links to other admin pages as needed */}
      </div>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
}

export default AdminPage;
