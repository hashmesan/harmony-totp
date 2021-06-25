import React, { Component } from 'react';
var ReactDOM = require('react-dom');

import {
    HashRouter as Router,
    Switch,
    Route,
    Redirect,
    Link
  } from "react-router-dom";

import Header from './components/header';
import Create from './components/create';
import Wallet from './components/wallet';

class MainScreen extends Component {
    render() {
        return (
            <Router>
                <Header showCreate={localStorage.getItem("SMARTVAULT") == null}/>
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
                </Switch>
            </Router>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
        );
    }
}

ReactDOM.render(<MainScreen/>, document.getElementById('container'));