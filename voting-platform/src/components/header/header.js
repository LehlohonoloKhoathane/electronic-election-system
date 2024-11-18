import './header.css';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Add useNavigate import
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../firebase'; // Import Firestore
import { doc, getDoc } from 'firebase/firestore';  // To fetch user data

function Header() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userName, setUserName] = useState('');
    const navigate = useNavigate(); // Initialize navigate hook

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuthenticated(true);
                // Fetch user details (like firstName) from Firestore
                const fetchUserDetails = async () => {
                    const userRef = doc(db, 'Users', user.uid); // Access user document
                    const userDoc = await getDoc(userRef);
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setUserName(userData.firstName || 'User');  // Get firstName, default to 'User'
                    }
                };

                fetchUserDetails(); // Fetch the user's details after login
            } else {
                setIsAuthenticated(false);
                setUserName('');
            }
        });

        return () => unsubscribe(); // Cleanup subscription on unmount
    }, []);

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                setIsAuthenticated(false);
                setUserName('');
                navigate('/login'); // Redirect to the login page after logout
            })
            .catch((error) => {
                console.error('Error signing out:', error);
            });
    };

    return (
        <header className='heading'>
            <nav className='heading-navs'>
                <div className="logo">K-Votex Platform</div>
                <ul className="nav-links">
                    {isAuthenticated ? (
                        <>
                            <li><Link to="/candidates">Vote</Link></li>
                            <li><Link to="/results">View Results</Link></li>
                            <li>Hello <span>{userName}</span></li>
                            <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/results">View Results</Link></li>
                            <li><Link className='login' to="/login">Login</Link></li>
                            <li className='register'><Link to="/register">Register as voter</Link></li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
}

export default Header;
