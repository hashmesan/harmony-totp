//import basic stuff
import React, { useState, useEffect } from "react";
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { getAuth } from "firebase/auth";
import { connect } from "redux-zero/react";

//imort NEW components
import Header from "./components/header";
import Landing from "./components/landing";
import Onboarding from "./components/onboarding";
import Login from "./components/login";
import Portfolio from "./components/portfolio";
import Token from "./components/portfolio/token";

//import OLD components
import Create from "./components/create";
import Wallet from "./components/wallet";
import Recover from "./components/recover";

//import actions
import actions from "./redux/actions";

const AuthenticatedRoute = ({ user, children, ...props }) => {
  console.log("user in auth route: ", user);
  return (
    <Route
      {...props}
      render={() => {
        return user ? children : <Redirect to="/login" />;
      }}
    />
  );
};

const UnAuthenticatedRoute = ({ user, children, ...props }) => {
  console.log("user in un-auth route: ", user);

  return (
    <Route
      {...props}
      render={() => {
        return !user ? children : <Redirect to="/portfolio" />;
      }}
    />
  );
};

const App = ({ setEnvironment }) => {
  const auth = getAuth();
  const [user, setUser] = useState(() => {
    const user = auth.currentUser;

    return user;
  });
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setIsAuthLoaded(true);
    });
  }, []);

  setEnvironment("testnet0");

  return (
    <React.Fragment>
      {isAuthLoaded && (
        <Router>
          <div className="container-fluid bg-white p-0">
            <Header />
            <Switch>
              <Route exact path="/">
                <Redirect to="/landing" />
              </Route>
              <UnAuthenticatedRoute path="/landing" user={user}>
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
              <AuthenticatedRoute path="/portfolio" user={user}>
                <Portfolio />
              </AuthenticatedRoute>
              <Route path="/token/:address">
                <Token />
              </Route>
              <UnAuthenticatedRoute path="/login" user={user}>
                <Login />
              </UnAuthenticatedRoute>
            </Switch>
          </div>
        </Router>
      )}
    </React.Fragment>
  );
};

const mapToProps = ({}) => ({});
export default connect(mapToProps, actions)(App);
