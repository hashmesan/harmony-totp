import React, { Component } from 'react';
var ReactDOM = require('react-dom');

import {
    HashRouter as Router,
    Switch,
    Route,
    Redirect,
    Link
  } from "react-router-dom";

import createStore from "redux-zero";
import { Provider, connect } from "redux-zero/react";
import {getLocalWallet} from "./config";

import store from './redux/store';
import Header from './components/header';
import Create from './components/create';
import Wallet from './components/wallet';
import Recover from './components/recover';
import Stats from './components/stats';

Number.prototype.toFixedNoRounding = function(n) {
    const reg = new RegExp("^-?\\d+(?:\\.\\d{0," + n + "})?", "g")
    const a = this.toString().match(reg)[0];
    const dot = a.indexOf(".");
    if (dot === -1) { // integer, insert decimal dot and pad up zeros
        return a + "." + "0".repeat(n);
    }
    const b = n - (a.length - dot) + 1;
    return b > 0 ? (a + "0".repeat(b)) : a;
 }

 
const mapToProps = ({ environment }) => ({ environment });
const App = connect(mapToProps)(({environment}) => (
    <Router>
        <Header/>
        <Switch>
            <Route exact path="/">
                {getLocalWallet(environment, false) ?<Redirect to="/wallet"/> : <Redirect to="/create"/>}
            </Route>
            <Route path="/create">
                <Create/>
            </Route>
            <Route path="/wallet">
                <Wallet/>
            </Route>
            <Route path="/recover">
                <Recover/>
            </Route>
            <Route path="/stats">
                <Stats/>
            </Route>            
        </Switch>
        <footer className="my-5 pt-5 text-muted text-center text-small">
            <p className="mb-1">Smartvault (beta) powered by Harmony Blockchain | Opensource (GPL)</p>
            <ul className="list-inline">
            <li className="list-inline-item"><a href="#/stats">Stats</a></li>
            <li className="list-inline-item"><a href="https://github.com/hashmesan/harmony-totp">Github</a></li>
            <li className="list-inline-item"><a href="https://github.com/hashmesan/harmony-totp/issues">Report issues</a></li>
            </ul>
        </footer>
    </Router>    
))

class MainScreen extends Component {
    render() {
        return (
            <Provider store={store}>
                <App/>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
            </Provider>
        );
    }
}

ReactDOM.render(<MainScreen/>, document.getElementById('container'));