// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyAqm5lgvUSm9RIXYXRUwyz4LFjVaXRHB9E",
//   authDomain: "historicalbattlesar.firebaseapp.com",
//   projectId: "historicalbattlesar",
//   storageBucket: "historicalbattlesar.appspot.com",
//   messagingSenderId: "99894789201",
//   appId: "1:99894789201:web:73f6b3c5f535ff10492470",
//   measurementId: "G-VW8FZPVB5P",
// };
const firebaseConfig = {
  apiKey: "AIzaSyAkccLkxNoZvBEtJV20hdFqXhCvaj3afFc",
  authDomain: "ar-battle-4e540.firebaseapp.com",
  projectId: "ar-battle-4e540",
  storageBucket: "ar-battle-4e540.appspot.com",
  messagingSenderId: "917734713498",
  appId: "1:917734713498:web:0c4b315cd5f5a67302d723",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { storage, auth, db };
