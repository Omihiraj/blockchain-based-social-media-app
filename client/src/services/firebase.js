// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDJWH-5TNOXyQGIkgjLR_jtg27G0T2aPVo",
    authDomain: "socialmedia-blockchain-app.firebaseapp.com",
    projectId: "socialmedia-blockchain-app",
    storageBucket: "socialmedia-blockchain-app.appspot.com",
    messagingSenderId: "281565420443",
    appId: "1:281565420443:web:420611dbd2c2d2b2fc1f3e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const storage = getStorage();