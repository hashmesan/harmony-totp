import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import React, { useState, useEffect, useContext, createContext } from "react";

import { CONFIG } from "../config";
const { firebaseConfig } = CONFIG;

export const firebaseApp = initializeApp(firebaseConfig);
export const analytics = getAnalytics(firebaseApp);

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
