import React, { Component } from 'react';
const {
    toBech32,
    fromBech32,
  } = require('@harmony-js/crypto');
  const web3utils = require("web3-utils");

import wallet from "../../../lib/wallet";
import RelayerClient from "../../../lib/relayer_client";
var Accounts = require('web3-eth-accounts');
import Notifications, {notify} from 'react-notify-toast';

const Transaction = ({data, me})=> {
    if(data.to==me) {
        return (<div className="row mt-3 mb-3">
                    <div  className="col-6">
                        <div>RECEIVED on {new Date(data.timestamp*1000).toISOString()}</div>
                        <div>From: {data.to}</div>
                    </div>
                    <div className="col-6 text-right">
                        {web3utils.fromWei(data.value+"")}
                    </div>
                </div>);
    }
    if(data.from==me) {
        return (<div>
                    <div>
                        <div>SENT on {new Date(data.timestamp*1000).toISOString()}</div>
                        <div>To: {data.from}</div>                
                    </div> 
                </div>);
    }
    return null;
}

class Wallet extends Component {
    constructor(props) {
        super(props)
        this.state = {
            gasLimit: 25000
        }

        this.wallet = JSON.parse(window.localStorage.getItem("SMARTVAULT"))
        this.ownerAccount = new Accounts().privateKeyToAccount(this.wallet.ownerSecret);
        this.relayerClient = new RelayerClient("http://localhost:8080");
    }

    loadHistory() {
        var self = this;
        fetch("https://explorer.pops.one:8888/address?id="+toBech32(this.wallet.walletAddress)+"&pageIndex=0&pageSize=20")
        .then(res=>res.json())
        .then(res=>{
            console.log(res);
            self.setState({accountData: res});
        })
    }
    componentDidMount() {        
        this.loadHistory();
        // load the wallet info && determine if we need to storehashes
        this.getWallet(this.wallet.walletAddress).then(e=>{
            if (e.result.hashStorageID == "") {
                this.storeHashes().then(e=>{
                    console.log(e);
                });        
            }
        })
    }

    transfer(e) {
        e.preventDefault();
        var self = this;
        self.setState({submitting: true});

        //(from, destination, amount, gasPrice, gasLimit, ownerAccount)
        this.relayerClient.transferTX(this.wallet.walletAddress, fromBech32(this.state.destination), web3utils.toWei(this.state.sendAmount), 0, this.state.gasLimit, this.ownerAccount).then(e=>{
            console.log("sigs", e);
            self.setState({submitting: false, destination: "", sendAmount: ""});

            notify.show('Transaction Successful!');     
            self.loadHistory();
        })
    }

    async getWallet(wallet) {
        return fetch("http://localhost:8080/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({
                operation: "getWallet",
                address: wallet,
            })
        })
        .then(res => {
            if(res.ok) {
                return res.json()
            } else {
                return res.json().then(e=>{
                    self.setState({error: e});
                    throw Exception(e);
                })
            }
        })
    }
    async uploadHashes(wallet, hashes) {
        return fetch("http://localhost:8080/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({
                operation: "storeHash",
                data: {
                    wallet: wallet,
                    hashes: hashes
                }
            })
        })
        .then(res => {
            if(res.ok) {
                return res.json()
            } else {
                return res.json().then(e=>{
                    self.setState({error: e});
                    throw Exception(e);
                })
            }
        })   
    }
    async storeHashes() {
        console.log("Storing hashes...");
        var res = await this.uploadHashes(this.wallet.walletAddress, this.wallet.hashes.leaves_arr);
        console.log("Stored at IPFS=", res);
        return await this.relayerClient.setHashStorageId(this.wallet.walletAddress, res.result.Hash, 0, this.state.gasLimit, this.ownerAccount);     
    }

    render() {        
        return (
            <div className="container pt-5 justify-content-md-center" style={{maxWidth: 960}}>
                <div className="row">
                    <div className="col-9">
                        <h3>{this.wallet.name}</h3>
                        {this.wallet.walletAddress} [copy]<br/>
                        {toBech32(this.wallet.walletAddress)}                        
                    </div>
                    <div className="col-3 text-right">
                        <div className="lead">
                            {this.state.accountData && web3utils.fromWei(this.state.accountData.address.balance+"")} ONE
                        </div>
                    </div>
                </div>
                <div className="card mt-3">
                    <div className="card-header">
                        <ul className="nav nav-tabs card-header-tabs">
                        <li className="nav-item">
                            <a className="nav-link active" href="#">Send</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Receive</a>
                        </li>
                        </ul>
                    </div> 
                    <div className="card-body">
                        <form>
                            <div className="form-group row">
                                <label htmlFor="inputEmail3" className="col-sm-4 col-form-label">Destination Address</label>
                                <div className="col-sm-8">
                                    <input type="text" className="form-control" id="inputEmail3" value={this.state.destination} onChange={(e)=>this.setState({destination: e.target.value})}/>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="inputEmail3" className="col-sm-4 col-form-label">Amount</label>
                                <div className="col-sm-8">
                                    <input type="number" className="form-control" id="inputEmail3" value={this.state.sendAmount} onChange={(e)=>this.setState({sendAmount: e.target.value})}/>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="inputEmail3" className="col-sm-4 col-form-label">Gas Limit</label>
                                <div className="col-sm-8">
                                    <input type="number" className="form-control" id="inputEmail3" value={this.state.gasLimit} disabled onChange={(e)=>this.setState({gasLimit: e.target.value})}/>
                                </div>
                            </div>
                            <div className="form-group row mt-4">
                                <label htmlFor="inputEmail3" className="col-sm-4 col-form-label"></label>
                                <div className="col-sm-8">
                                    {!this.state.submitting && <button className="btn btn-primary" onClick={this.transfer.bind(this)}>Submit Transaction</button>}
                                    {this.state.submitting && <button className="btn btn-primary" disabled>Submitting..(wait)</button>}
                                </div>
                            </div>
                        </form>                                           
                        <hr/>
                        <b>Transactions</b>
                        {this.state.accountData && this.state.accountData.address.shardData[0].txs.map(e=>{
                            return <Transaction data={e} me={toBech32(this.wallet.walletAddress)}/>
                        })}
                    </div>
                </div>    
                <Notifications/>            
            </div>
        );
    }
}


/*
 curl -H "Content-Type:application/json" -X GET "https://api.s0.t.hmny.io/address?id=one1mcjmmtystwsr0xtglzhl4vyarsfrdvdn2ecx75&tx_view=ALL"
*/
export default Wallet;