import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
const web3utils = require("web3-utils");
const {
    toBech32,
    fromBech32,
  } = require('@harmony-js/crypto');

class FirstDeposit extends Component {
    constructor(props) {
        super(props)
        this.state = {
          balance: 0,
          continue: false,
          showQR: false,
          busy: false,
          totalFee: new web3utils.BN(this.props.data.cost).add(new web3utils.BN(this.props.data.networkFee))
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
            if(new web3utils.BN(res.result.balance).gte(self.state.totalFee)) {
                self.setState({deposits: res.result.balance, continue: true});
            }
        })
    }

    toggleQR(e) {
        e.preventDefault(); 
        this.setState({showQR: !this.state.showQR});
    }

    componentDidMount() {
        this.checkBalance();
    }


    saveWalletToLocalStorage() {
        localStorage.setItem("SMARTVAULT", JSON.stringify(this.props.data));
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
        console.log(this.data);
        
        var self = this;
        self.setState({busy: true});
        ev.preventDefault();
        fetch("http://localhost:8080/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({
                operation: "createWallet",
                config: {
                    domain: [this.props.data.name.split(".")[0], this.props.data.name.split(".")[1]],
                    owner: this.props.data.ownerAddress,
                    rootHash: this.props.data.hashes.root_arr,
                    merkelHeight: this.props.data.merkleHeight,
                    drainAddr: "0x0000000000000000000000000000000000000000",
                    dailyLimit: web3utils.toWei("1000"),
                    salt: this.props.data.salt
                }
            })
        })
        .then(res => {
            if(res.ok) {
                return res.json()
            } else {
                return res.json().then(e=>{
                    throw e;
                })
            }
        })
        .then(res=>{
            self.setState({busy: false});
            console.log("Wallet created! ", res);
            self.saveWalletToLocalStorage();
            self.props.history.push("/wallet");
        })
        .catch(e=>{
            console.log(e);
            if ('reason' in e) {
                console.log("HERE!!");
                self.setState({error: "TX: " + e.tx + " (" + e.reason + ")", busy: false});
            } else {
                self.setState({error: e, busy: false});
            }
        })
    }

    render() {
        console.log(this.props);

        return (
            <React.Fragment>
                <h2>YOUR FIRST DEPOSIT</h2>
                <h5 className="mt-4 mb-5">There is a network fee to activate your wallet as it is a smart contract. <br/>This fee will be taken from your first deposit</h5>
                <div className="mt-5">
                    <p>
                        <b>Wallet Address:</b> {toBech32(this.props.data.walletAddress)} {this.props.data.walletAddress}
                        <a href="#" className="btn btn-link" onClick={this.toggleQR.bind(this)}>{this.state.showQR ? "Hide QR Code": "Show QR Code"}</a>
                        {this.state.showQR && <div><img src={"https://chart.googleapis.com/chart?chs=200x200&chld=L|0&cht=qr&chl=" + this.props.data.walletAddress} width="200" height="200"/></div>}
                    </p>
                    <p>
                        <b>Name Service Fee:</b> {this.props.data.cost && web3utils.fromWei(this.props.data.cost).split(".")[0]} ONE<br/>
                        <b>Network Fee:</b> {this.props.data.networkFee && web3utils.fromWei(this.props.data.networkFee)} ONE<br/>
                        <b>TOTAL FEE:</b> {web3utils.fromWei(this.state.totalFee)}
                    </p>
                    
                    {!this.state.continue ? 
                    <div className="text-center">
                        <p><b>Status:</b> Waiting for deposit...</p>
                        <div className="spinner-grow text-primary" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                    : <div className="text-center">
                            <p><b>Status:</b> Received deposit of  {web3utils.fromWei(this.state.deposits)} ONE</p> 
                        </div>
                        }
                    {this.state.error &&                
                    <div className="row justify-content-md-center mt-4">
                        <div className="alert alert-danger w-50" role="alert">
                            {this.state.error && JSON.stringify(this.state.error)}
                        </div>
                    </div>}

                    {(this.state.continue && !this.state.busy)&& <button className="mt-5 btn btn-lg btn-primary" onClick={this.createWallet.bind(this)}>Create Wallet</button>} 
                    {(this.state.continue && this.state.busy) && <button className="mt-5 btn btn-lg btn-primary">
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Waiting for tx...                            
                        </button>}
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(FirstDeposit);