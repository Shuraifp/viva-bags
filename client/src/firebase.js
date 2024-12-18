import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD50zacboR04RS1jMluD0ffH5pQYQ6MRTc",
  authDomain: "vivabags-aa156.firebaseapp.com",
  projectId: "vivabags-aa156",
  storageBucket: "vivabags-aa156.firebasestorage.app",
  messagingSenderId: "719311521316",
  appId: "1:719311521316:web:f7e08e82db9fa99f23bab1",
  measurementId: "G-9ZG9M642GP"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
