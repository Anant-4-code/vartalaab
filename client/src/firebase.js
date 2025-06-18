// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyANes8FKvlUWICHscWGTzBMjUNZfGnfcPA",
  authDomain: "vartalaab-1c54e.firebaseapp.com",
  projectId: "vartalaab-1c54e",
  storageBucket: "vartalaab-1c54e.firebasestorage.app",
  messagingSenderId: "186969943185",
  appId: "1:186969943185:web:d14165ed68c09ab98ce330",
  measurementId: "G-MMPLT2JCG6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics }; 