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
                <Header/>
                <Switch>
                    <Route exact path="/">
                        {localStorage.getItem("SMARTVAULT") ?<Wallet/> : <Redirect to="/create"/>}
                    </Route>
                    <Route path="/create">
                        <Create/>
                    </Route>
                </Switch>
            </Router>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
        );
    }
}

function Home() {
    return <h2>abc</h2>;
  }
  

ReactDOM.render(<MainScreen/>, document.getElementById('container'));