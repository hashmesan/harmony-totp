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

const mapToProps = ({ environment }) => ({ environment });
const App = connect(mapToProps)(({environment}) => (
    <Router>
        <Header/>
        <Switch>
            <Route exact path="/">
                {getLocalWallet(environment) ?<Redirect to="/wallet"/> : <Redirect to="/create"/>}
            </Route>
            <Route path="/create">
                <Create/>
            </Route>
            <Route path="/wallet">
                {(getLocalWallet(environment) && JSON.parse(getLocalWallet(environment)).active == true) ? <Wallet/> : <Redirect to="/create"/>}
            </Route>
            <Route path="/recover">
                <Recover/>
            </Route>
        </Switch>
        <footer className="my-5 pt-5 text-muted text-center text-small">
            <p className="mb-1">Smartvault (beta) powered by Harmony Blockchain | Opensource (GPL)</p>
            <ul className="list-inline">
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