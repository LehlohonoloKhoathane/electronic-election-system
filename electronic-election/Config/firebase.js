// Import required libraries
const axios = require('axios');
//const firebase = require('firebase/app');
//require('firebase/auth');
const admin = require('firebase-admin');
//const { getAuth } = require('firebase-admin/auth');

require('dotenv').config(); // Load environment variables from .env

// Initialize Firebase Admin SDK using environment variables
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Handle newline characters
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
});

// Initialize Firebase client SDK using environment variables
// firebase.initializeApp({
//   apiKey: process.env.FIREBASE_API_KEY,
//   authDomain: `${process.env.FIREBASE_PROJECT_ID}.firebaseapp.com`,
//   projectId: process.env.FIREBASE_PROJECT_ID,
// });

// Function to verify if the email is valid using MailCheck API
async function verifyEmail(email) {
  const apiKey = process.env.MAILCHECK_API_KEY;
  try {
    const response = await axios.get(`https://api.mailcheck.ai/email/${email}?key=${apiKey}`);
    return response.data.valid;
  } catch (error) {
    console.error('Error verifying email:', error);
    return false;
  }
}

// Controller to register a new voter
async function registerVoter(req, res) {
  try {
    const { id, email } = req.body;

    // Step 1: Verify email with MailCheck
    const isValid = await verifyEmail(email);
    if (!isValid) {
      return res.status(400).send('Invalid email');
    }

    // Step 2: Check if the user already exists in Firebase Auth
    try {
      const userRecord = await getAuth().getUserByEmail(email);
      return res.status(409).send('User already registered');
    } catch (error) {
      // If the user does not exist, proceed with registration
      if (error.code !== 'auth/user-not-found') {
        throw error; // Any other error should be handled
      }
    }

    // Step 3: Create a new user in Firebase Auth
    await getAuth().createUser({ uid: id, email });

    // Step 4: Send success response
    res.status(201).send('Voter registered successfully');
  } catch (error) {
    console.error('Error registering voter:', error);
    res.status(500).send('Internal server error');
  }
}

// Controller to sign up a new user (Firebase Authentication)
exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userRecord = await getAuth().createUser({ email, password });
    res.status(201).json({ message: 'User registered successfully', userId: userRecord.uid });
  } catch (error) {
    console.error('Error signing up user:', error);
    res.status(500).json({ error: error.message });
  }
};

// Controller to log in a user (Firebase Authentication)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Use Firebase Auth client SDK for sign-in
    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
    res.status(200).json({ message: 'User logged in successfully', userId: userCredential.user.uid });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(401).json({ error: 'Invalid credentials' });
  }
};

// Export the registerVoter function
module.exports = { registerVoter, signup: exports.signup, login: exports.login };
