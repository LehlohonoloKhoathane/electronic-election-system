//importing necessary dependancies for pack to top button
import React, { useState } from 'react';
import { FaArrowCircleUp } from 'react-icons/fa';
import './backToTop.css'

//Component for the back to top button
const BackToTopButton = () => {
  //State to track visibility of the button
  const [isVisible, setIsVisible] = useState(false);

  //Function to toggle visibility based on scroll position
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  //Function to scroll back to the top of the page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Event listener to track scroll and update visibility
  window.addEventListener('scroll', toggleVisibility);

  return (
    <>
    {/* Render the button only if isVisible is true */}
      {isVisible && (
        <div className="back-to-top" onClick={scrollToTop}>
          <FaArrowCircleUp className="icon" />
        </div>
      )}
      
    </>
  );
};

export default BackToTopButton;
