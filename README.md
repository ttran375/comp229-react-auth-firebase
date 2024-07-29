# Authenticating Users With Firebase & React

## Create a React Application

```sh
npx create-react-app react-auth-firebase
cd react-auth-firebase
npm i firebase --save
npm start
```

## Authenticate Users With Firebase Functions

### `src/firebase_setup/firebase.js`

```js
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
```

## Create React Forms – Signup.js

### `src/firebase_setup/Signup.js`

```js
import { useState } from "react";
import { Link } from "react-router-dom";
import { signUp } from "./firebase";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== password2) {
            setError("Passwords do not match");
        } else {
            setEmail("");
            setPassword("");
            setPassword2("");
            const res = await signUp(email, password);
            if (res.error) setError(res.error);
        }
    };

    return (
        <>
            <h2>Sign Up</h2>
            <div>
                {error ? <div>{error}</div> : null}
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        placeholder="Your Email"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        name="password"
                        value={password}
                        placeholder="Your Password"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        type="password"
                        name="password2"
                        value={password2}
                        placeholder="Confirm Password"
                        required
                        onChange={(e) => setPassword2(e.target.value)}
                    />
                    <button type="submit">Submit</button>
                </form>
                <p>
                    Already registered? <Link to="/login">Login</Link>
                </p>
            </div>
        </>
    );
};

export default Signup;
```

### `src/firebase_setup/Signin.js`

```js
import { useState } from "react";
import { signIn } from "./firebase";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, seterror] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        setEmail("");
        setPassword("");
        const res = await signIn(email, password);
        if (res.error) seterror(res.error);
    };
    return (
        <>
            {error ? <div>{error}</div> : null}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="email"
                    value={email}
                    placeholder="Your Email"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    name="password"
                    value={password}
                    placeholder="Your Password"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input type="submit" value="submit" />
            </form>
        </>
    );
};

export default Login;
```

### `src/firebase_setup/Profile.js`

```js
import { signOut } from "./firebase";

const Profile = () => {
    const handleLogout = async () => {
        await signOut();
    };
    return (
        <>
            <h1>Profile</h1>
            <button onClick={handleLogout}>Logout</button>
        </>
    );
};

export default Profile;
```

## Create Authentication Routes

```sh
npm i react-router-dom --save
```

### `src/index.js`

```js
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./firebase_setup/Signin";
import Profile from "./firebase_setup/Profile";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="login" element={<Login />} />
        <Route path="profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
```

### `src/AuthContext.js`

```js
import { createContext } from "react";
const AuthContext = createContext();
export default AuthContext;
```

### `src/AuthProvider.js`

```js
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import { app } from "./firebase_setup/firebase";
const auth = getAuth(app);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            setUser(user);
        });
    }, []);
    return (
        <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
    );
};
```

### `src/index.js`

```js
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.js";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./firebase_setup/Signin";
import Profile from "./firebase_setup/Profile";
import { AuthProvider } from "./AuthProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="login" element={<Login />} />
          <Route path="profile" element={<Profile />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
```

## Create Protected Routes

### `src/firebase_setup/Profile.js`

```js
import { useContext } from "react";
import AuthContext from "../AuthContext";
import { Navigate } from "react-router-dom";
import { signOut } from "./firebase";

const Profile = () => {
    const { user } = useContext(AuthContext);
    const handleLogout = async () => {
        await signOut();
    };
    if (!user) {
        return <Navigate replace to="/login" />;
    }
    return (
        <>
            <h1>Profile</h1>
            <button onClick={handleLogout}>Logout</button>
        </>
    );
};
export default Profile;
```
