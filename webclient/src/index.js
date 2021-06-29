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
                {"walletAddress" in JSON.parse(getLocalWallet(environment)) ? <Wallet/> : <Redirect to="/create"/>}
            </Route>
            <Route path="/recover">
                <Recover/>
            </Route>
        </Switch>
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