
import React, { Component } from 'react';
import {
    HashRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

class SideMenu extends Component {
    render() {
        return (
            <div>
                <Link to="/wallet/set_drain">Set Drain Address</Link>
            </div>
        );
    }
}

export default SideMenu;