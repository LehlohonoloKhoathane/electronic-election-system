import React from "react";
import './home.css';

const Home = () => {
    return (
        <section className="home-container" id="home-container">
            <div className="blur HomeBlur"></div>
            <div className="home-content">
                <div className="heading-container">
                    <h2>Welcome to K-Votex, your secure and trusted destination for casting your vote online.</h2>
                </div>
                <hr className="custom-hr" />
                <div className="paragraph-container">
                    <p>Experience a streamlined, user-friendly, and fully protected voting process from the comfort of your home. Your voice matters, and we've made it easier than ever to ensure it's heard. Participate, engage, and make a difference—anytime, anywhere. Start your journey now and be a part of the change!</p>
                </div>
            </div>
        </section>
    );
};

export default Home;
