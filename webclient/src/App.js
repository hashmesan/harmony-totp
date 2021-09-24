import React, { Component, useCallback, useContext } from "react";
import {
  BrowserRouter as Router,
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

import Login from "./components/login";

import { useAuthState } from "./context/FirebaseAuthContext";

const AuthenticatedRoute = ({ children, ...props }) => {
  const { isAuthenticated } = useAuthState();
  console.log("authenticated state [auth route]: ", isAuthenticated);
  return (
    <Route
      {...props}
      render={() => {
        return isAuthenticated === true ? children : <Redirect to="/login" />;
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
        </Switch>
      </div>
    </Router>
  );
};

export default App;