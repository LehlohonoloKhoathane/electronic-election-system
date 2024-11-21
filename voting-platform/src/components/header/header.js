import './header.css';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { TfiMenuAlt } from "react-icons/tfi";

function Header() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage mobile menu
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuthenticated(true);
                const fetchUserDetails = async () => {
                    try {
                        const userRef = doc(db, 'Users', user.uid);
                        const userDoc = await getDoc(userRef);
                        if (userDoc.exists()) {
                            const userData = userDoc.data();
                            setUserName(userData.firstName || 'User');
                            setUserRole(userData.role || 'user');
                        }
                    } catch (error) {
                        console.error('Error fetching user details:', error);
                    }
                };

                fetchUserDetails();
            } else {
                setIsAuthenticated(false);
                setUserName('');
                setUserRole('');
            }
        });

        return () => unsubscribe();
    }, []);

    // const handleLogout = () => {
    //     signOut(auth)
    //         .then(() => {
    //             setIsAuthenticated(false);
    //             setUserName('');
    //             setUserRole('');
    //             navigate('/login');
    //         })
    //         .catch((error) => {
    //             console.error('Error signing out:', error);
    //         });
    // };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen); // Toggle menu state on small screens
    };

    const closeMenu = () => {
        setIsMenuOpen(false); // Close the menu when a link is clicked
    };

    return (
        <header className="heading">
            <nav className="heading-navs">
                <div className="logo">K-Votex Platform</div>
                {/* Hamburger icon for small screens */}
                <div className="hamburger-menu" onClick={toggleMenu}>
                <TfiMenuAlt />
                </div>
                <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                    {isAuthenticated ? (
                        userRole === 'admin' ? (
                            <>
                                <li><Link to="/adminPage" onClick={closeMenu}>Admin Page</Link></li>
                                {/* <li><button onClick={handleLogout} className="logout-button">Logout</button></li> */}
                            </>
                        ) : (
                            <>
                                <li><Link to="/userPage" onClick={closeMenu}>Dashboard</Link></li>
                                <li><Link to="/results" onClick={closeMenu}>View Results</Link></li>
                                {/* <li>Hello <span>{userName}</span></li> */}
                                {/* <li><button onClick={handleLogout} className="logout-button">Logout</button></li> */}
                            </>
                        )
                    ) : (
                        <>
                            <li><Link to="/" onClick={closeMenu}>Home</Link></li>
                            <li><Link to="/results" onClick={closeMenu}>View Results</Link></li>
                            <li className="login"><Link to="/login" onClick={closeMenu}>Login</Link></li>
                            <li className="register"><Link to="/register" onClick={closeMenu}>Register as voter</Link></li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
}

export default Header;
