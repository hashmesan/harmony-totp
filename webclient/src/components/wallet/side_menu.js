import React, { Component } from "react";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";

class SideMenu extends Component {
  render() {
    return (
      <div className="text-center mt-3 mb-3">
        <div className="p-1">
          <Link to="/wallet">Send Payment</Link>
        </div>
        <div className="p-1">
          <Link to="/wallet/set_daily_limit">Set Daily Limit</Link>
        </div>
        <div className="p-1">
          <Link to="/wallet/set_drain_address">Set Drain Address</Link>
        </div>
        <div className="p-1">
          <Link to="/wallet/upgrade">Upgrade Wallet</Link>
        </div>
      </div>
    );
  }
}

export default SideMenu;
