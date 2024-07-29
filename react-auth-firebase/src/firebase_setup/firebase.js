// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, addDoc, collection } from "firebase/firestore";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignout,
} from "firebase/auth";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    // https://firebase.google.com/docs/projects/api-keys#api-keys-for-firebase-are-different
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const signUp = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = userCredential.user;
        await addDoc(collection(db, "users"), { uid: user.uid, email: user.email });
        return true;
    } catch (error) {
        return { error: error.message };
    }
};
const signIn = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = userCredential.user;
        return true;
    } catch (error) {
        return { error: error.message };
    }
};
const signOut = async () => {
    try {
        await firebaseSignout(auth);
        return true;
    } catch (error) {
        return false;
    }
};
export { app, signUp, signIn, signOut };
