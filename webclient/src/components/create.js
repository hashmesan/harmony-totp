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

  import crypto from "crypto";
import b32 from "thirty-two";
import ChooseName from './create_step1';
import ScanQRCode from './create_step2';
import FirstDeposit from './create_step3';
import {createHOTP} from '../../../lib/wallet';
import Web3EthAccounts from 'web3-eth-accounts';

class Create extends Component {
    constructor(props) {
        super(props)
        var data = JSON.parse(localStorage.getItem("SMARTVAULT")) || {};
        // Set the initial input values
        this.state = {
          currentStep: 1, // Default is Step 1
          data: data
        }
        this.worker = new Worker("worker.js");
        this.worker.onmessage = this.receivedWorkerMessage.bind(this);
    }

    receivedWorkerMessage(event) {
        console.log(event);
        const self = this;
        this.setState(Object.assign(this.state.data,{hashes: event.data.mywallet}), ()=>{
            localStorage.setItem("SMARTVAULT", JSON.stringify(self.state.data));
        })
    }

    // generate HOTP Secret here
    createNewWallet() {
        const account = new Web3EthAccounts().create();
        const bin = crypto.randomBytes(20);
        const base32 = b32.encode(bin).toString("utf8").replace(/=/g, "");
        const merkleHeight = 12;
        const self = this;

        const secret = base32
          .toLowerCase()
          .replace(/(\w{4})/g, "$1 ")
          .trim()
          .split(" ")
          .join("")
          .toUpperCase();
        this.worker.postMessage({secret: secret, depth: merkleHeight});
        const newData = {merkleHeight: merkleHeight, secret: secret, ownerAddress: account.address, ownerSecret: account.privateKey, salt: bin.readUIntLE(0, 6)}
        this.setState(Object.assign(this.state.data, newData), ()=>{
            localStorage.setItem("SMARTVAULT", JSON.stringify(self.state.data));
        })
    }

    componentDidMount() {
        if(!("secret" in this.state.data)) {
            this.createNewWallet();
        }
    }

    goNext() {
        this.setState({currentStep: this.state.currentStep+1});
    }

    handleUpdate(data){
        console.log("handleUpdate", this, data);
        var self = this;

        this.setState({data: Object.assign(this.state.data, data)}, ()=>{
            localStorage.setItem("SMARTVAULT", JSON.stringify(self.state.data));
        });
    }
    handleSubmit(e){
        e && e.preventDefault();
        this.goNext();
    }

    render() {
        console.log("state=", this.state);

        return (
            <div className="container text-center pt-5 justify-content-md-center" style={{maxWidth: 960}}>
                <Router>
                    <Switch>
                        <Route exact path="/create">
                            <Start/>
                        </Route>
                        <Route path="/create/step1">
                            <ChooseName handleUpdate={this.handleUpdate.bind(this)}/>
                        </Route>
                        <Route path="/create/step2">
                            <ScanQRCode data={this.state.data} handleUpdate={this.handleUpdate.bind(this)} />
                        </Route>
                        <Route path="/create/step3">
                            <FirstDeposit data={this.state.data}/>
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
                <div className="mt-4">
                    or <Link to="/recover">Recover Wallet</Link>             
                </div>   
            </React.Fragment>
        );
    }
}

export default Create;