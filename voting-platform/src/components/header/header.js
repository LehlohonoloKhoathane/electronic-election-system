// import './header.css';
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom'; // Add useNavigate import
// import { onAuthStateChanged, signOut } from 'firebase/auth';
// import { auth, db } from '../firebase'; // Import Firestore
// import { doc, getDoc } from 'firebase/firestore'; // To fetch user data

// function Header() {
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [userName, setUserName] = useState('');
//     const [userRole, setUserRole] = useState(''); // State to store user role
//     const navigate = useNavigate(); // Initialize navigate hook

//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, (user) => {
//             if (user) {
//                 setIsAuthenticated(true);
//                 // Fetch user details (like firstName and role) from Firestore
//                 const fetchUserDetails = async () => {
//                     try {
//                         const userRef = doc(db, 'Users', user.uid); // Access user document
//                         const userDoc = await getDoc(userRef);
//                         if (userDoc.exists()) {
//                             const userData = userDoc.data();
//                             setUserName(userData.firstName || 'User'); // Get firstName, default to 'User'
//                             setUserRole(userData.role || 'user'); // Get role, default to 'user'
//                         }
//                     } catch (error) {
//                         console.error('Error fetching user details:', error);
//                     }
//                 };

//                 fetchUserDetails(); // Fetch the user's details after login
//             } else {
//                 setIsAuthenticated(false);
//                 setUserName('');
//                 setUserRole('');
//             }
//         });

//         return () => unsubscribe(); // Cleanup subscription on unmount
//     }, []);

//     const handleLogout = () => {
//         signOut(auth)
//             .then(() => {
//                 setIsAuthenticated(false);
//                 setUserName('');
//                 setUserRole('');
//                 navigate('/login'); // Redirect to the login page after logout
//             })
//             .catch((error) => {
//                 console.error('Error signing out:', error);
//             });
//     };

//     return (
//         <header className="heading">
//             <nav className="heading-navs">
//                 <div className="logo">K-Votex Platform</div>
//                 <ul className="nav-links">
//                     {isAuthenticated ? (
//                         userRole === 'admin' ? (
//                             // Admin navigation bar items
//                             <>
//                                 <li><Link to="/adminPage">Admin Page</Link></li>
//                                 <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
//                             </>
//                         ) : (
//                             // Regular user navigation bar items
//                             <>
//                                 <li><Link to="/userPage">Dashboard</Link></li>
//                                 <li><Link to="/results">View Results</Link></li>
//                                 <li>Hello <span>{userName}</span></li>
//                                 <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
//                             </>
//                         )
//                     ) : (
//                         // Navigation bar for unauthenticated users
//                         <>
//                             <li><Link to="/">Home</Link></li>
//                             <li><Link to="/results">View Results</Link></li>
//                             <li className="login"><Link to="/login">Login</Link></li>
//                             <li className="register"><Link to="/register">Register as voter</Link></li>
//                         </>
//                     )}
//                 </ul>
//             </nav>
//         </header>
//     );
// }

// export default Header;

import './header.css';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

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

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                setIsAuthenticated(false);
                setUserName('');
                setUserRole('');
                navigate('/login');
            })
            .catch((error) => {
                console.error('Error signing out:', error);
            });
    };

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
                    ☰
                </div>
                <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                    {isAuthenticated ? (
                        userRole === 'admin' ? (
                            <>
                                <li><Link to="/adminPage" onClick={closeMenu}>Admin Page</Link></li>
                                <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
                            </>
                        ) : (
                            <>
                                <li><Link to="/userPage" onClick={closeMenu}>Dashboard</Link></li>
                                <li><Link to="/results" onClick={closeMenu}>View Results</Link></li>
                                <li>Hello <span>{userName}</span></li>
                                <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
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
