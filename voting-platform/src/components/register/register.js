import './register.css'
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { setDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify'

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fname, setName] = useState('');
    const [IDNumber, setID] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            const user = auth.currentUser;
            console.log(user);
            if(user) {
                await setDoc(doc(db, "Users", user.uid), {
                    email: user.email,
                    firstName: fname,
                    Identity: IDNumber, 
                });
            }
            console.log("User Registered Successfully!");
            toast.success("User Registered Successfully!!",{
                position: "top-center"
            });
        } catch (error) {
            console.log(error.message);
            toast.success(error.message, {
                position:"bottom-center",
            });
        }
        // Simulate registration logic (replace with actual registration)
        if (fname && email && password) {
            alert('Registration successful!');
            // Redirect or handle post-registration actions
        } else {
            setError('Please fill in all fields.');
        }
    };

    return (
        <section id="register">
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <div>
                    <label>Full Name:</label>
                    <input 
                        type="text" 
                        value={fname} 
                        placeholder='Full Names'
                        onChange={(e) => setName(e.target.value)} 
                        required
                    />
                </div>
                <div>
                    <label>ID Number:</label>
                    <input 
                        type="number" 
                        value={IDNumber} 
                        placeholder='ID Number'
                        onChange={(e) => setID(e.target.value)} 
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input 
                        type="email" 
                        value={email}
                        placeholder='Email address' 
                        onChange={(e) => setEmail(e.target.value)} 
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input 
                        type="password" 
                        value={password}
                        placeholder='Password' 
                        onChange={(e) => setPassword(e.target.value)} 
                        required
                    />
                </div>
                {error && <p className="error">{error}</p>}
                <button type="submit">Register</button>
            </form>
        </section>
    );
}

export default Register;
