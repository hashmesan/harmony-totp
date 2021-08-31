import React, { Component } from "react";
var ReactDOM = require("react-dom");

import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import "./custom.scss";

import { Provider, connect } from "redux-zero/react";
import { getLocalWallet } from "./config";

import store from "./redux/store";
import Header from "./components/header";
import Create from "./components/create";
import Wallet from "./components/wallet";
import Recover from "./components/recover";
import Landing from "./components/landing";
import Onboarding1 from "./components/onboard_1";

const mapToProps = ({ environment }) => ({ environment });
const App = connect(mapToProps)(({ environment }) => (
  <Router>
    <Header />
    <Switch>
      <Route exact path="/">
        {getLocalWallet(environment, false) ? (
          <Redirect to="/wallet" />
        ) : (
          <Redirect to="/landing" />
        )}
      </Route>
      <Route path="/landing">
        <Landing />
      </Route>
      <Route path="/create">
        <Create />
      </Route>
      <Route path="/onboarding1">
        <Onboarding1 />
      </Route>
      <Route path="/wallet">
        <Wallet />
      </Route>
      <Route path="/recover">
        <Recover />
      </Route>
    </Switch>
  </Router>
));

class MainScreen extends Component {
  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}

ReactDOM.render(<MainScreen />, document.getElementById("container"));
