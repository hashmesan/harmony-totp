import React from "react";
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import Header from "./components/header";
import Create from "./components/create";
import Wallet from "./components/wallet";
import Recover from "./components/recover";
import Landing from "./components/landing";
import Onboarding from "./components/onboarding";
import Portfolio from "./components/portfolio";
import Token from "./components/portfolio/token";
import About from "./components/about";

import Login from "./components/login";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useAuthState } from "./context/FirebaseAuthContext";

const AuthenticatedRoute = ({ children, ...props }) => {
  const { isAuthenticated } = useAuthState();
  const auth = getAuth();
  const user = auth.currentUser;

  console.log("authenticated state [auth route]: ", user);
  return (
    <Route
      {...props}
      render={() => {
        return user ? children : <Redirect to="/login" />;
      }}
    />
  );
};

const UnAuthenticatedRoute = ({ children, ...props }) => {
  const { isAuthenticated } = useAuthState();
  console.log("authenticated state [un-auth route]: ", isAuthenticated);
  return (
    <Route
      {...props}
      render={() => {
        return isAuthenticated === false ? (
          children
        ) : (
          <Redirect to="/portfolio" />
        );
      }}
    />
  );
};

const App = () => {
  return (
    <Router>
      <div className="container-fluid bg-white p-0">
        <Header />
        <Switch>
          <Route exact path="/">
            <Redirect to="/landing" />
          </Route>
          <UnAuthenticatedRoute path="/landing">
            <Landing />
          </UnAuthenticatedRoute>
          <Route path="/create">
            <Create />
          </Route>
          <Route path="/onboard">
            <Onboarding />
          </Route>
          <Route path="/wallet">
            <Wallet />
          </Route>
          <Route path="/recover">
            <Recover />
          </Route>
          <AuthenticatedRoute path="/portfolio">
            <Portfolio />
          </AuthenticatedRoute>
          <Route path="/token/:address">
            <Token />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/about">
            <About />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
