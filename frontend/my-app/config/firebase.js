// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyADgkC5qYuDchk_hrX85vIxcd4Q20g46-o",
  authDomain: "xpress-9fb73.firebaseapp.com",
  projectId: "xpress-9fb73",
  storageBucket: "xpress-9fb73.firebasestorage.app",
  messagingSenderId: "162756069338",
  appId: "1:162756069338:web:09a9b7a1497114eb14e2e3",
  measurementId: "G-4CNZQDZRL3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;