// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { browserLocalPersistence, getAuth, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBtM06wq0Y_KPB1F-jQnWtLgiL9hA036RY",
  authDomain: "todo-391e5.firebaseapp.com",
  projectId: "todo-391e5",
  storageBucket: "todo-391e5.appspot.com",
  messagingSenderId: "542436459686",
  appId: "1:542436459686:web:c68c9526e6ce5a161aa067"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore();
const auth = getAuth(app);

setPersistence(auth, browserLocalPersistence)
.then(() => {
  console.log("Persistence mode set to local.");
})
.catch((error) => {
  console.error("Failed to set persistence:", error);
});

export default db;
