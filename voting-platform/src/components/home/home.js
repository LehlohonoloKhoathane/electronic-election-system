import React from "react";
import './Home.css';

//Function to handle the smooth scrolling
function handleScroll(event) {
    event.preventDefault();
  
    const targetId = event.currentTarget.getAttribute("href");
    const targetElement = document.querySelector(targetId);
  
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
}

/* Home section content */
const Home = () => {
    return (
        <section className="home-container" id="home-container">
            <div className="blur HomeBlur"></div>
            <div className="home-content">
                <div className="heading-container">
                    <h2>"Welcome to K-Votex, your secure and trusted destination for casting your vote online. Experience a streamlined, user-friendly, and fully protected voting process from the comfort of your home. Your voice matters, and we've made it easier than ever to ensure it's heard. Participate, engage, and make a difference—anytime, anywhere. Start your journey now and be a part of the change!"</h2>
                </div>
                <hr className="custom-hr" />
                <div className="paragraph-container">
                    <p>Whether you are seeking a developer to bring ideas to life or seeking innovative solutions, you are in the right place.</p>
                </div>
                <div className="links-container">
                    <a href="#work-container" onClick={handleScroll}><span>See Work</span></a>
                    <a href="https://drive.google.com/file/d/11QZcGIzMg_JJwe1_ned3JGNJWFkzELTD/view?usp=sharing" target="_blank" rel="noopener noreferrer"><span>Download CV</span></a>
                </div>
                <div className="slidingTextcontainer">Full Stack Software Developer</div>
            </div>
        </section>
    );
};

export default Home;
