import './register.css';
import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { setDoc, doc, getDocs, collection, query, where } from 'firebase/firestore';
import Swal from 'sweetalert2'; // Import SweetAlert2
import axios from 'axios'; // Import Axios for API requests

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fname, setName] = useState('');
    const [IDNumber, setID] = useState('');
    const [province, setProvince] = useState('');
    const [provinces, setProvinces] = useState([]);
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [idError, setIDError] = useState('');

    // Fetch provinces from Firestore
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const provincesSnapshot = await getDocs(collection(db, 'Provinces'));
                const provincesList = provincesSnapshot.docs.map(doc => doc.data().ProvinceName);
                setProvinces(provincesList);
            } catch (error) {
                console.error('Error fetching provinces: ', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to load provinces',
                });
            }
        };

        fetchProvinces();
    }, []);

    // Check if the email is in valid format
    const isValidEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    // Check if the ID number is 13 digits long
    const isValidIDNumber = (id) => {
        return /^\d{13}$/.test(id);
    };

    // Check if the ID number already exists in the database
    const doesIDExist = async (id) => {
        const idQuery = query(collection(db, 'Users'), where('Identity', '==', id));
        const querySnapshot = await getDocs(idQuery);
        return !querySnapshot.empty; // Returns true if an ID match is found
    };

    // // Function to validate the email with MailCheck.ai
    // const validateEmailWithMailCheck = async (email) => {
    //     const apiKey = '3L317ZUayO3Xwai16Lrs9usU8h9qf8P9'; // Replace with your MailCheck.ai API Key

    //     try {
    //         const response = await axios.get(`https://api.mailcheck.ai/email/verify?email=${email}`, {
    //             headers: {
    //                 'Authorization': `Bearer ${apiKey}`,
    //             },
    //         });

    //         const data = response.data;

    //         if (data.is_valid) {
    //             return true; // Email is valid
    //         } else {
    //             setEmailError('The email address is invalid.');
    //             return false; // Invalid email
    //         }
    //     } catch (error) {
    //         console.error('Error validating email:', error);
    //         Swal.fire({
    //             icon: 'error',
    //             title: 'Error',
    //             text: 'There was an issue validating the email address. Please try again later.',
    //         });
    //         return false;
    //     }
    // };

    const handleRegister = async (e) => {
        e.preventDefault();

        // Check email validity
        if (!isValidEmail(email)) {
            setEmailError('Please enter a valid email address.');
            return;
        }

        // Validate the email using MailCheck.ai
        // const emailIsValid = await validateEmailWithMailCheck(email);
        // if (!emailIsValid) {
        //     return; // If email is not valid, stop further processing
        // }

        // Check if ID number is valid
        if (!isValidIDNumber(IDNumber)) {
            setIDError('Please enter a valid 13-digit SA ID number.');
            return;
        }

        try {
            // Check if ID number already exists
            const idExists = await doesIDExist(IDNumber);
            if (idExists) {
                setIDError('This ID number is already registered.');
                Swal.fire({
                    icon: 'error',
                    title: 'Duplicate ID',
                    text: 'This ID number is already registered.',
                });
                return;
            }

            // Create user in Firebase
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (user) {
                await setDoc(doc(db, 'Users', user.uid), {
                    email: user.email,
                    firstName: fname,
                    Identity: IDNumber,
                    Province: province, // Save selected province
                });

                // Clear all fields
                setEmail('');
                setPassword('');
                setName('');
                setID('');
                setProvince('');

                // Show success alert using SweetAlert2
                Swal.fire({
                    icon: 'success',
                    title: 'Registration Successful',
                    text: 'User Registered Successfully!',
                });
            }
        } catch (error) {
            console.log(error.message);

            if (error.code === 'auth/email-already-in-use') {
                setEmailError('This email is already registered.');
                Swal.fire({
                    icon: 'error',
                    title: 'Email Already Registered',
                    text: 'This email address is already registered.',
                });
            } else {
                setEmailError('Registration failed. Please try again.');
                Swal.fire({
                    icon: 'error',
                    title: 'Registration Failed',
                    text: 'Registration failed. Please try again.',
                });
            }
        }
    };

    return (
        <section id="register">
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <div className='register'>
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
                        onChange={(e) => {
                            setID(e.target.value);
                            setIDError('');
                        }} 
                        required
                    />
                    {idError && <p className="error">{idError}</p>}
                </div>
                <div>
                    <label>Email:</label>
                    <input 
                        type="email" 
                        value={email}
                        placeholder='Email address' 
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailError('');
                        }} 
                        required
                    />
                    {emailError && <p className="error">{emailError}</p>}
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
                <div>
                    <label>Province:</label>
                    <select
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        required
                    >
                        <option value="">Select a Province</option>
                        {provinces.map((province, index) => (
                            <option key={index} value={province}>
                                {province}
                            </option>
                        ))}
                    </select>
                </div>
                {error && <p className="error">{error}</p>}
                <button type="submit">Register</button>
            </form>
        </section>
    );
}

export default Register;
