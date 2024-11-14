// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCSVvOR3ww3q839oxBSAScT4x3RPQBr19A",
  authDomain: "onlinevoting-9d6a1.firebaseapp.com",
  projectId: "onlinevoting-9d6a1",
  storageBucket: "onlinevoting-9d6a1.firebasestorage.app",
  messagingSenderId: "354500181652",
  appId: "1:354500181652:web:eed8009b169938700c3e81",
  measurementId: "G-XZ8XS9423E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore(app);
export default app;