import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import './addElectionTypes.css';

function AddElectionType() {
  const [electionName, setElectionName] = useState('');
  const [electionEndDate, setElectionEndDate] = useState('');

  const handleAddElectionType = async (e) => {
    e.preventDefault();
    if (!electionName || !electionEndDate) {
      toast.error('Please provide an election name and set an end date');
      return;
    }

    try {
      await addDoc(collection(db, 'electionTypes'), {
        electionName: electionName,
        electionEndDate: electionEndDate
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
    </div>
  );
}

export default AddElectionType;
