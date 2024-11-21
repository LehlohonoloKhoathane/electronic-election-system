
import React, { useState, useEffect } from 'react';
import { PuffLoader } from "react-spinners";

import './loader.css';

const Root = () => {
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      // Simulating a 2-second delay
      setTimeout(() => {
        setLoading(false);
      }, 4000);
    }, []);
}  

const Loader = () => {
    return (
      <div className="loader">  <PuffLoader color="#09BE67" loading={true} size={60} /></div>
    );
  };
  

export default Loader;
