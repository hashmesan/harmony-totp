import React, { Component } from 'react';
import {
    HashRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

import ChooseName from './create/create_step1';
import ScanQRCode from './create/create_step2';
import FirstDeposit from './create/create_step3';
import { connect } from "redux-zero/react";
import actions from "../redux/actions";
import {CONFIG, getStorageKey, getLocalWallet, setLocalWallet} from "../config";
import AccountProvider from "./smartvault_provider";

class Create extends Component {
    constructor(props) {
        super(props)
        var data = JSON.parse(getLocalWallet(this.props.environment, true)) || {};
        // Set the initial input values
        this.state = {
          data: data
        }
    }

    componentDidMount() {
    }

    render() {
        console.log("state=", this.state);

        return (
            <div className="container text-center pt-5 justify-content-md-center" style={{maxWidth: 960}}>
                <AccountProvider loadPending={true}>
                    <Router>
                        <Switch>
                            <Route exact path="/create">
                                <Start/>
                            </Route>
                            <Route path="/create/step1">
                                <ChooseName/>
                            </Route>
                            <Route path="/create/step2">
                                <ScanQRCode data={this.state.data} />
                            </Route>
                            <Route path="/create/step3">
                                <FirstDeposit data={this.state.data}/>
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
                <h2>Create your New Wallet</h2>
                <h5 className="mt-4">SmartVault is a unique smart contract wallet protected by 2FA HOTP (Google Authenticator), guardians, and spending limits.</h5>
                <Link className="mt-5 btn btn-lg btn-primary" to="/create/step1">Start</Link>             
                <div className="mt-4">
                    or <Link to="/recover">Recover Wallet</Link>             
                </div>   
            </React.Fragment>
        );
    }
}

const mapToProps = ({ environment }) => ({ environment });
export default connect(mapToProps, actions)(Create);