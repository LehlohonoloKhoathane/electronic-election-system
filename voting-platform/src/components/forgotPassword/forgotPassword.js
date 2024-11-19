// ForgotPassword.js
import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import Swal from 'sweetalert2'; // Import Swal
import { auth } from '../firebase';
import './forgotPassword.css'; // Import CSS for styling

function ForgotPassword() {
    const [email, setEmail] = useState('');

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        try {
            await sendPasswordResetEmail(auth, email);

            // Show success message
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'A password reset link has been sent to your email.',
                confirmButtonText: 'OK',
            });

            // Clear the input field
            setEmail('');
        } catch (error) {
            // Show error message
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Error sending password reset email. Please try again.',
                confirmButtonText: 'OK',
            });
        }
    };

    return (
        <section className='forgot-password-section'>
            <h2>Forgot Password</h2>
            <form onSubmit={handlePasswordReset}>
                <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                />
                <button className='resetPassword' type="submit">Reset Password</button>
            </form>
        </section>
    );
}

export default ForgotPassword;
