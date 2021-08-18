import React, { Component } from "react";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";

import ChooseName from "./create/create_step1";
import ScanQRCode from "./create/create_step2";
import FirstDeposit from "./create/create_step3";
import { connect } from "redux-zero/react";
import actions from "../redux/actions";
import {
  CONFIG,
  getStorageKey,
  getLocalWallet,
  setLocalWallet,
} from "../config";
import AccountProvider from "./smartvault_provider";

class Home extends Component {
  constructor(props) {
    super(props);
    var walletData =
      JSON.parse(getLocalWallet(this.props.environment, true)) || {};
    // Set the initial input values
    this.state = {
      walletData: walletData,
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
        Home
      </div>
    );
  }
}

const mapToProps = ({ environment }) => ({ environment });
export default connect(mapToProps, actions)(Home);
