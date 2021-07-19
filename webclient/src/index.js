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

import store from './redux/store';
import Header from './components/header';
import Create from './components/create';
import Wallet from './components/wallet';
import Recover from './components/recover';

class MainScreen extends Component {
    render() {
        return (
            <Router>
                <Provider store={store}>
                    <Header/>
                    <Switch>
                        <Route exact path="/">
                            {localStorage.getItem("SMARTVAULT") ?<Redirect to="/wallet"/> : <Redirect to="/create"/>}
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
                    </Switch>
                </Provider>
            </Router>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
        );
    }
}

ReactDOM.render(<MainScreen/>, document.getElementById('container'));