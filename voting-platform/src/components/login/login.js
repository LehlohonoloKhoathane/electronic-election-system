import { signInWithEmailAndPassword } from 'firebase/auth';
import './login.css';
import React, { useState } from 'react';
import { auth } from '../firebase';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // useNavigate hook for navigation

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("User logged in Successfully");
            toast.success("User logged in Successfully", {
                position: "top-center",
            });
            // Navigate to the candidates page after successful login
            navigate('/candidates');
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
