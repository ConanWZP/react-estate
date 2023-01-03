// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBYL5SB0JkmLSzD2-IlyEMWel-UmRUH13w",
    authDomain: "react-estate-45b92.firebaseapp.com",
    projectId: "react-estate-45b92",
    storageBucket: "react-estate-45b92.appspot.com",
    messagingSenderId: "823418751457",
    appId: "1:823418751457:web:846ed7e2c6a937e8292aa0"
};

// Initialize Firebase
initializeApp(firebaseConfig);

export const database = getFirestore()
export const auth = getAuth()