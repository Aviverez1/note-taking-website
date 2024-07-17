import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAU73a0Ah0FLHQJE8ku9O1gTb68k9RM5c8",
    authDomain: "note-taking-ea55f.firebaseapp.com",
    projectId: "note-taking-ea55f",
    storageBucket: "note-taking-ea55f.appspot.com",
    messagingSenderId: "600662050304",
    appId: "1:600662050304:web:cb3e808398b384b4c07ae5",
    measurementId: "G-5PSET8VYSR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);