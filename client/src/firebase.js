import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCSrXg8-rhmniXZNG3_zstyCo_PUV7Z3CM",
    authDomain: "naya-assingment.firebaseapp.com",
    projectId: "naya-assingment",
    storageBucket: "naya-assingment.appspot.com",
    messagingSenderId: "335872001577",
    appId: "1:335872001577:web:d2afd74b2e70a0583cbe38",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
