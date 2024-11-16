// import React, { useState } from 'react';
// import { db } from '../firebase';
// import { collection, addDoc } from 'firebase/firestore';
// import { toast } from 'react-toastify';
// import './addElectionTypes.css';

// function AddElectionType() {
//   const [electionName, setElectionName] = useState('');
//   const [electionEndDate, setElectionEndDate] = useState('');

//   const handleAddElectionType = async (e) => {
//     e.preventDefault();
//     if (!electionName || !electionEndDate) {
//       toast.error('Please provide an election name and set an end date');
//       return;
//     }

//     try {
//       await addDoc(collection(db, 'ElectionTypes'), {
//         electionName: electionName,
//         electionEndDate: electionEndDate
//       });
//       toast.success('Election type added successfully!');
//       setElectionName('');
//       setElectionEndDate('');
//     } catch (error) {
//       console.error('Error adding election type: ', error);
//       toast.error('Failed to add election type');
//     }
//   };

//   return (
//     <div className="form-container">
//       <h2>Add Election Type</h2>
//       <form onSubmit={handleAddElectionType} className="election-form">
//         <div className="form-group">
//           <label>Election Name:</label>
//           <input
//             type="text"
//             value={electionName}
//             onChange={(e) => setElectionName(e.target.value)}
//             required
//             className="form-input"
//           />
//         </div>
//         <div className="form-group">
//           <label>Election End Date:</label>
//           <input
//             type="date"
//             value={electionEndDate}
//             onChange={(e) => setElectionEndDate(e.target.value)}
//             required
//             className="form-input"
//           />
//         </div>
//         <button type="submit" className="submit-button">Add Election Type</button>
//       </form>
//     </div>
//   );
// }

// export default AddElectionType;


import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDoc, doc } from 'firebase/firestore';
import { auth } from '../firebase'; // Import Firebase auth
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-toastify';
import './addElectionTypes.css';

function AddElectionType() {
  const [electionName, setElectionName] = useState('');
  const [electionEndDate, setElectionEndDate] = useState('');
  const [isAdmin, setIsAdmin] = useState(false); // State to check if user is admin

  // Check if user is logged in and has admin privileges
  useEffect(() => {
    const checkUserStatus = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            // Check if the user has admin privileges
            const userDoc = await getDoc(doc(db, 'Users', user.uid));
            if (userDoc.exists() && userDoc.data().role === 'admin') {
              setIsAdmin(true);
            } else {
              toast.error('Access denied: Admins only');
            }
          } catch (error) {
            console.error('Error checking admin privileges:', error);
            toast.error('Failed to verify admin privileges');
          }
        } else {
          toast.error('You must be logged in as an admin to add election types');
        }
      });
    };
    checkUserStatus();
  }, []);

  const handleAddElectionType = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      toast.error('Only admins can add election types');
      return;
    }

    if (!electionName || !electionEndDate) {
      toast.error('Please provide an election name and set an end date');
      return;
    }

    try {
      await addDoc(collection(db, 'ElectionTypes'), {
        electionName: electionName,
        electionEndDate: electionEndDate,
      });
      toast.success('Election type added successfully!');
      setElectionName('');
      setElectionEndDate('');
    } catch (error) {
      console.error('Error adding election type: ', error);
      toast.error('Failed to add election type');
    }
  };

  return (
    <div className="form-container">
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
        </>
      ) : (
        <p>You do not have the necessary permissions to access this page.</p>
      )}
    </div>
  );
}

export default AddElectionType;
