import React, { Component } from 'react';
import { css, jsx } from '@emotion/react'
import OtpInput from 'react-otp-input';
import styled from '@emotion/styled'
import {
    HashRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

import ChooseName from './create_step1';
import ScanQRCode from './create_step2';
import FirstDeposit from './create_step3';

class Create extends Component {
    constructor(props) {
        super(props)
        // Set the initial input values
        this.state = {
          currentStep: 4, // Default is Step 1
        }
    }

    // generate HOTP Secret here
    createNewWallet() {

    }

    goNext() {
        this.setState({currentStep: this.state.currentStep+1});
    }

    handleSubmit(e){
        e && e.preventDefault();
        this.goNext();
    }

    render() {
        return (
            <div className="container text-center pt-5 justify-content-md-center" style={{maxWidth: 960}}>
                <Router>
                    <Switch>
                        <Route exact path="/create">
                            <Start/>
                        </Route>
                        <Route path="/create/step1">
                            <ChooseName/>
                        </Route>
                        <Route path="/create/step2">
                            <ScanQRCode/>
                        </Route>
                        <Route path="/create/step3">
                            <FirstDeposit/>
                        </Route>                                        
                    </Switch>
                </Router>
            </div>
        );
    }
}

class Start extends Component {
    render() {
        return (
            <React.Fragment>
                <h2>Create your New Wallet</h2>
                <h5 className="mt-4">SmartVault is a unique smart contract wallet protected by 2FA HOTP (Google Authenticator), guardians, and spending limits.</h5>
                <Link className="mt-5 btn btn-lg btn-primary" to="/create/step1">Start</Link>                
            </React.Fragment>
        );
    }
}

export default Create;