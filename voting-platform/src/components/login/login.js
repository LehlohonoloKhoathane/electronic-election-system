import { signInWithEmailAndPassword } from 'firebase/auth';
import './login.css';
import React, { useState } from 'react';
import { auth, db } from '../firebase'; // Import db to interact with Firestore
import Swal from 'sweetalert2'; // Import Swal
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore'; // To fetch the user role from Firestore
import { Link } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Sign in the user with email and password
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("User logged in successfully");

            const user = userCredential.user;

            // Check if the email is verified
            if (!user.emailVerified) {
                throw new Error("Please verify your email before logging in.");
            }

            // Set the user state with the authenticated user
            setUser(user);

            // Display success message using Swal
            Swal.fire({
                icon: 'success',
                title: 'Login Successful',
                text: 'Welcome back!',
                timer: 2000,
                showConfirmButton: false,
            });

            // Fetch the user's role from Firestore
            const userRef = doc(db, 'Users', user.uid);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                const role = userData.role;

                // Navigate based on the user's role
                if (role === 'admin') {
                    navigate('/adminPage'); // Admin redirects to the admin page
                } else {
                    navigate('/userPage'); // Regular user redirects to the user page
                }
            } else {
                // Handle case where user does not have a role assigned
                console.log("No role found for the user");
                navigate('/userPage'); // Default to user page if no role
            }

        } catch (error) {
            console.log(error.message);

            // Display error message using Swal
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: error.message,
                timer: 3000,
                showConfirmButton: false,
            });
        }
    };

    return (
        <section className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    className='email'
                    type="email"
                    value={email}
                    placeholder='Email'
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    className='password'
                    type="password"
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && <p className="error">{error}</p>}
                <button className='login-button' type="submit">Login</button>
                <Link to="/forgotPassword" className="forgot-password-link">
                    Forgot Password?
                </Link>
            </form>
        </section>
    );
}

export default Login;
