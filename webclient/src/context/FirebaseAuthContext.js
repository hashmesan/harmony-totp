import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import React, { useState, useEffect, useContext, createContext } from "react";

import { CONFIG } from "../config";
const { firebaseConfig } = CONFIG;

const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);

//2.
export const AuthContext = createContext({});

//3.
export const AuthProvider = (props) => {
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState();
  const [error, setError] = useState();
  const [loadingAuthState, setLoadingAuthState] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), setUser, setError);

    return () => {
      unsubscribe();
      setLoadingAuthState(false);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        authenticated: user != null,
        setUser,
        error,
        loadingAuthState,
      }}
      {...props}
    />
  );
};

export const useAuthState = () => {
  const auth = useContext(AuthContext);
  return { ...auth, isAuthenticated: auth.user != null };
};

/*
// context/firebaseContext.js

import { useState, createContext, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/analytics";

// Your credentials
import { CONFIG } from "../config";
const { clientCredentials } = CONFIG;

export const FirebaseContext = createContext();

export const AuthProvider = ({ children }) => {
  // The whole app
  const [firebaseApp, setFirebaseApp] = useState();
  // Just the DB
  const [db, setDb] = useState();
  // Just the Auth
  const [auth, setAuth] = useState();
  // BONUS! Current user
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    // Initialize Firebase
    // This checks if the app is already initialized
    if (!firebaseApp && !firebase.apps.length) {
      firebase.initializeApp(clientCredentials);
      // Analytics
      if ("measurementId" in clientCredentials) firebase.analytics();
      setFirebaseApp(firebase);
      setDb(firebase.firestore());
      setAuth(firebase.auth());
      // Listen authenticated user
      firebase.auth().onAuthStateChanged(async (user) => {
        try {
          if (user) {
            // User is signed in.
            const { uid, displayName, email, photoURL } = user;
            setUser({ uid, displayName, email, photoURL });
            setLoadingUser(false);
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error(error);
        }
      });
    }
  }, []);

  return (
    <FirebaseContext.Provider
      value={{ firebaseApp, db, auth, user, setUser, loadingUser }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => useContext(FirebaseContext);*/
