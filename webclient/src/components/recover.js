import React, { Component } from 'react';
import { css, jsx } from '@emotion/react'
import styled from '@emotion/styled'
import {
    HashRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

import FindWallet from './recover_step1';
import ProvideCode from './recover_step2';
import AccountProvider from "./smartvault_provider";

class RecoverPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {}
        }
    }

    handleUpdate(data){
        console.log("handleUpdate", this, data);
        var self = this;

        this.setState({data: Object.assign(this.state.data, data)});
    }

    render() {
        return (
            <div className="container text-center pt-5 justify-content-md-center pb-5" style={{maxWidth: 960}}>
                <AccountProvider>
                <Router>
                    <Switch>
                        <Route exact path="/recover">
                            <Start/>
                        </Route>
                        <Route exact path="/recover/step1">
                            <FindWallet handleUpdate={this.handleUpdate.bind(this)}/>
                        </Route>
                        <Route path="/recover/step2/:address">
                            <ProvideCode/>
                        </Route>
                    </Switch>
                </Router>
                </AccountProvider>
            </div>
        );
    }
}

class Start extends Component {
    render() {
        return (
            <React.Fragment>
                <h2>Recover your Wallet</h2>
                <h5 className="mt-4">Recovering your requires your wallet name, and access to your Google Authenticator.</h5>
                <Link className="mt-5 btn btn-lg btn-primary" to="/recover/step1">Start</Link>   
                <div className="mt-4">
                    or <Link to="/create">Create New Wallet</Link>             
                </div>
            </React.Fragment>
        );
    }
}

export default RecoverPage;