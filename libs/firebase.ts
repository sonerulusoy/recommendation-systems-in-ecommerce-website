// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA6SND-gCj-7qZ2KIBJ8MM4KMN8Ph9i0-g",
  authDomain: "ulusoy-e-commerce.firebaseapp.com",
  projectId: "ulusoy-e-commerce",
  storageBucket: "ulusoy-e-commerce.appspot.com",
  messagingSenderId: "95755793841",
  appId: "1:95755793841:web:12bef8ef6577ba0d413990",
  measurementId: "G-PCP0TJG9CX",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);

export default firebaseApp;
