import React, { Component, useCallback, useContext } from "react";
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import { connect } from "redux-zero/react";

import { getLocalWallet } from "./config";
import actions from "./redux/actions";

import Header from "./components/header";
import Create from "./components/create";
import Wallet from "./components/wallet";
import Recover from "./components/recover";
import Landing from "./components/landing";
import Onboard from "./components/onboarding/onboard";
import Portfolio from "./components/portfolio";

import { Login } from "./components/temp/login";

import AccountProvider from "./context/SmartvaultContext";
import {
  AuthProvider,
  useAuthState,
  AuthContext,
} from "./context/FirebaseAuthContext";

const AuthenticatedRoute = ({ children, ...props }) => {
  const { isAuthenticated } = useAuthState();
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

const App = ({ environment }) => {
  return (
    <AuthProvider>
      <AccountProvider>
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
                <Onboard />
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
              <Route path="/login">
                <Login />
              </Route>
            </Switch>
          </div>
        </Router>
      </AccountProvider>
    </AuthProvider>
  );
};

const mapToProps = ({ environment }) => ({ environment });
export default connect(mapToProps, actions)(App);
