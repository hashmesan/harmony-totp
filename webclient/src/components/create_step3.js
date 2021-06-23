import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
const web3utils = require("web3-utils");

class FirstDeposit extends Component {
    constructor(props) {
        super(props)
        this.state = {
          balance: 0,
          continue: false
        }
    }
    checkBalance() {
        var self = this;
        fetch("http://localhost:8080/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({
                operation: "getBalance",
                address: this.props.data.walletAddress
            })
        })
        .then(res => res.json())
        .then(res=>{
            if(res.result.balance == '0') {
                setTimeout(self.checkBalance.bind(self), 3000);
            }
            if(new web3utils.BN(res.result.balance).gte(new web3utils.BN(self.props.data.networkFee))) {
                self.setState({deposits: res.result.balance, continue: true});
            }
        })
    }

    componentDidMount() {
        this.checkBalance();
    }

    /*
        address   owner;     
        bytes32[] rootHash;
        uint8 	  merkelHeight;
        address	  drainAddr;
        uint 	  dailyLimit;
        uint      salt;
    */    
    createWallet(ev) {
        ev.preventDefault();
        fetch("http://localhost:8080/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({
                operation: "createWallet",
                config: {
                    owner: this.props.data.ownerAddress,
                    rootHash: this.props.data.wallet.root_arr,
                    merkelHeight: this.props.data.merkleHeight,
                    drainAddr: "0x0000000000000000000000000000000000000000",
                    dailyLimit: web3utils.toWei("1000"),
                    salt: this.props.data.salt
                }
            })
        })
        .then(res => res.json())
        .then(res=>{
            console.log("Wallet created! ", res);
        })
    }

    render() {
        console.log(this.props);

        return (
            <React.Fragment>
                <h2>YOUR FIRST DEPOSIT</h2>
                <h5 className="mt-4 mb-5">There is a network fee to activate your wallet as it is a smart contract. <br/>This fee will be taken from your first deposit</h5>
                <div className="mt-5">
                    <p><b>Wallet Address:</b>{this.props.data.walletAddress} <a href="#" className="btn btn-link">Show QR Code</a></p>
                    <p><b>Network Fee:</b> {this.props.data.networkFee && web3utils.fromWei(this.props.data.networkFee)} ONE</p>
                    
                    {!this.state.continue ? 
                    <div className="text-center">
                        <p>Status: Waiting for deposit...</p>
                        <div className="spinner-grow text-primary" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                    : <div className="text-center">
                            <p>Status: Received deposit of  {web3utils.fromWei(this.state.deposits)} ONE</p>                            
                        </div>
                        }
                
                    {this.state.continue && <button className="mt-5 btn btn-lg btn-primary" onClick={this.createWallet.bind(this)}>Continue</button>} 
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(FirstDeposit);