import React, { Component } from "react";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";
import { connect } from "redux-zero/react";
import actions from "./redux/actions";
import {
  CONFIG,
  getStorageKey,
  getLocalWallet,
  setLocalWallet,
} from "./config";
import AccountProvider from "./components/smartvault_provider";

import Navbar from "./components/navbar";

import Create from "./components/create";
import Wallet from "./components/wallet";
import Recover from "./components/recover";

import Home from "./components/home";
import Dashboard from "./components/dashboard";

class Main extends Component {
  constructor(props) {
    super(props);
    var data = JSON.parse(getLocalWallet(this.props.environment, true)) || {};
    // Set the initial input values
    this.state = {
      data: data,
    };
  }

  componentDidMount() {}

  render() {
    console.log("state=", this.state);

    return (
      <div
        className="container text-center pt-5 justify-content-md-center"
        style={{ maxWidth: 960 }}
      >
        <AccountProvider loadPending={true}>
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
        </AccountProvider>
      </div>
    );
  }
}

const mapToProps = ({ environment }) => ({ environment });
export default connect(mapToProps, actions)(Main);
