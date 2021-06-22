import React, { Component } from 'react';
var ReactDOM = require('react-dom');

import {
    HashRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

import Header from './components/header';
import Create from './components/create';


class MainScreen extends Component {
    render() {
        return (
            <Router>
                <Header/>
                <Switch>
                    <Route exact path="/">
                        <Create/>
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