// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {getAuth, GoogleAuthProvider} from "firebase/auth"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "skillbridge-87e1f.firebaseapp.com",
  projectId: "skillbridge-87e1f",
  storageBucket: "skillbridge-87e1f.firebasestorage.app",
  messagingSenderId: "491768271269",
  appId: "1:491768271269:web:c0acde5e04363e0ade984c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


const auth = getAuth(app);
const provider = new GoogleAuthProvider();
 
export {auth, provider};
