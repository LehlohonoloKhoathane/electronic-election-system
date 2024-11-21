import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Swal from 'sweetalert2';
import './manageDatabase.css';

function ManageDatabase() {
  const [candidates, setCandidates] = useState([]);
  const [electionTypes, setElectionTypes] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if the logged-in user is an admin
    const checkAdminPrivileges = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const userDoc = await getDoc(doc(db, 'Users', user.uid));
            if (userDoc.exists() && userDoc.data().role === 'admin') {
              setIsAdmin(true);
            } else {
              setIsAdmin(false);
              Swal.fire({
                icon: 'error',
                title: 'Access Denied',
                text: 'Only admins can access this page.',
              });
            }
          } catch (error) {
            console.error('Error checking admin privileges:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to verify admin privileges.',
            });
          }
        } else {
          setIsAdmin(false);
          Swal.fire({
            icon: 'error',
            title: 'Access Denied',
            text: 'You must be logged in to access this page.',
          });
        }
      });
    };

    checkAdminPrivileges();
  }, []);

  useEffect(() => {
    // Fetch candidates and election types if the user is an admin
    if (isAdmin) {
      const fetchData = async () => {
        try {
          const candidatesSnapshot = await getDocs(collection(db, 'Candidates'));
          const electionTypesSnapshot = await getDocs(collection(db, 'ElectionTypes'));

          setCandidates(candidatesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
          setElectionTypes(electionTypesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
          console.error('Error fetching data:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to fetch data.',
          });
        }
      };

      fetchData();
    }
  }, [isAdmin]);

  const handleDelete = async (collectionName, id) => {
    if (!isAdmin) {
      Swal.fire({
        icon: 'error',
        title: 'Access Denied',
        text: 'Only admins can delete items.',
      });
      return;
    }

    // Ask for confirmation before deleting
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, collectionName, id));
        Swal.fire({
          icon: 'success',
          title: 'Deleted',
          text: `The item has been deleted from ${collectionName}.`,
        });

        // Update the state after deletion
        if (collectionName === 'Candidates') {
          setCandidates((prev) => prev.filter((item) => item.id !== id));
        } else if (collectionName === 'ElectionTypes') {
          setElectionTypes((prev) => prev.filter((item) => item.id !== id));
        }
      } catch (error) {
        console.error('Error deleting item:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete the item.',
        });
      }
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Cancelled',
        text: 'The item was not deleted.',
      });
    }
  };

  return (
    <div className="manage-database">
      <h2>Manage Database</h2>
      {isAdmin ? (
        <>
          <div className="data-section">
            <h3>Candidates</h3>
            {candidates.length > 0 ? (
              <ul>
                {candidates.map((candidate) => (
                  <li className='candidateD' key={candidate.id}>
                    <strong>{candidate.FullNames}</strong> {candidate.Party}
                    <button
                      className="delete-button"
                      onClick={() => handleDelete('Candidates', candidate.id)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No candidates found.</p>
            )}
          </div>

          <div className="data-section">
            <h3>Election Types</h3>
            {electionTypes.length > 0 ? (
              <ul>
                {electionTypes.map((type) => (
                  <li className='electionD' key={type.id}>
                    <strong>{type.electionName}</strong> End Date: {type.electionEndDate}
                    <button
                      className="delete-button"
                      onClick={() => handleDelete('ElectionTypes', type.id)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No election types found.</p>
            )}
          </div>
        </>
      ) : (
        <p>You do not have the necessary permissions to access this page.</p>
      )}
    </div>
  );
}

export default ManageDatabase;
