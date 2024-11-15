import { signInWithEmailAndPassword } from 'firebase/auth';
import './login.css';
import React, { useState } from 'react';
import { auth, db } from '../firebase';  // Import db to interact with Firestore
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';  // To fetch the user role from Firestore

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("User logged in successfully");

            // Set the user state with the authenticated user
            setUser(userCredential.user);

            toast.success("User logged in Successfully", {
                position: "top-center",
            });

            // Fetch the user's role from Firestore
            const userRef = doc(db, 'Users', userCredential.user.uid);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                const role = userData.role;

                // Navigate based on the user's role
                if (role === 'admin') {
                    navigate('/addCandidates');  // Admin redirects to add candidates page
                } else {
                    navigate('/candidates');  // Regular user redirects to candidates page
                }
            } else {
                // Handle case where user does not have a role assigned
                console.log("No role found for the user");
                navigate('/candidates');  // Redirect to candidates page if no role
            }

        } catch (error) {
            console.log(error.message);
            toast.error(error.message, {
                position: "bottom-center",
            });
        }
    };

    return (
        <section id="login">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email:</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required
                    />
                </div>
                {error && <p className="error">{error}</p>}
                <button type="submit">Login</button>
            </form>
        </section>
    );
}

export default Login;
