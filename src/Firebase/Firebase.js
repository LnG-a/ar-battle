// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAqm5lgvUSm9RIXYXRUwyz4LFjVaXRHB9E",
  authDomain: "historicalbattlesar.firebaseapp.com",
  projectId: "historicalbattlesar",
  storageBucket: "historicalbattlesar.appspot.com",
  messagingSenderId: "99894789201",
  appId: "1:99894789201:web:73f6b3c5f535ff10492470",
  measurementId: "G-VW8FZPVB5P",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
