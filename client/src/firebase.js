// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-event-a348d.firebaseapp.com",
  projectId: "mern-event-a348d",
  storageBucket: "mern-event-a348d.firebasestorage.app",
  messagingSenderId: "85780724888",
  appId: "1:85780724888:web:0081baf2eaafb36ea424ed"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };