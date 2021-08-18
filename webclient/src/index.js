import React, { Component } from "react";
var ReactDOM = require("react-dom");

import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
  Link,
} from "react-router-dom";
import createStore from "redux-zero";
import { Provider, connect } from "redux-zero/react";
import { getLocalWallet } from "./config";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import {
  faHome,
  faAmbulance,
  faChartPie,
  faCogs,
  faExchangeAlt,
  faPiggyBank,
  faHistory,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

import store from "./redux/store";
import Navbar from "./components/navbar";

import Create from "./components/create";
import Wallet from "./components/wallet";
import Recover from "./components/recover";

import Home from "./components/home";

library.add(
  fab,
  faHome,
  faAmbulance,
  faChartPie,
  faCogs,
  faExchangeAlt,
  faPiggyBank,
  faHistory,
  faCheck
);

const mapToProps = ({ environment }) => ({ environment });
const App = connect(mapToProps)(({ environment }) => (
  <Router>
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <Navbar />
        <div className="col py-3">
          <Switch>
            <Route exact path="/">
              {getLocalWallet(environment, false) ? (
                <Redirect to="/portfolio" />
              ) : (
                <Redirect to="/home" />
              )}
            </Route>
            <Route path="/Home">
              <Home />
            </Route>
            <Route path="/create">
              <Create />
            </Route>
            <Route path="/portfolio">
              <Wallet />
            </Route>
            <Route path="/recover">
              <Recover />
            </Route>
          </Switch>
        </div>
      </div>
    </div>
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
