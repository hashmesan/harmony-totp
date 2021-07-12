import React, { Component } from 'react';
const {
    toBech32,
    fromBech32,
  } = require('@harmony-js/crypto');
  const web3utils = require("web3-utils");
  import {
    HashRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
  } from "react-router-dom";
import Notifications, {notify} from 'react-notify-toast';
import { connect } from "redux-zero/react";
import actions from "../redux/actions";
import {getStorageKey, getLocalWallet, getApiUrl, getExplorerUrl, CONFIG} from "../config";
import SmartVault from '../../../lib/smartvault_lib';
import SideMenu from "./side_menu";

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
            gasLimit: 200000
        }

        var walletData = JSON.parse(getLocalWallet(this.props.environment, false))
        this.smartvault = new SmartVault(CONFIG[this.props.environment])
        this.smartvault.loadFromWalletData(walletData);
    }

    loadHistory() {
        var self = this;
        this.smartvault.getDeposits().then(balance=>{
            self.setState({balance: balance})
        })

        // var self = this;
        // if(this.smartvault.walletData && this.smartvault.smartvault.walletAddress) {
        //     fetch(getExplorerUrl(this.props.environment) + "/address?id="+toBech32(this.smartvault.smartvault.walletAddress)+"&pageIndex=0&pageSize=20")
        //     .then(res=>res.json())
        //     .then(res=>{
        //         console.log(res);
        //         self.setState({accountData: res});
        //     })    
        // }
    }
    componentDidMount() {        
        this.loadHistory();
        var self = this;
    }

    transfer(e) {
        e.preventDefault();
        var self = this;
        self.setState({submitting: true});

        try {            
            this.smartvault.relayClient.transferTX(this.smartvault.walletData.walletAddress, fromBech32(this.state.destination), web3utils.toWei(this.state.sendAmount), 0, this.state.gasLimit, this.smartvault.ownerAccount).then(e=>{
                console.log("sigs", e);
                setTimeout(()=>{
                    self.setState({submitting: false, destination: "", sendAmount: ""});
                    notify.show('Transaction Successful!');         
                    self.loadHistory();
                }, 3000);
                
            }).catch(e=>{
                console.error(e);
                self.setState({submitting: false, error: e});
            })
        }catch(e){
            console.error(e);
            self.setState({submitting: false, error: e.message});            
        }
    }

    render() {
        var walletData = this.smartvault.walletData;
        if (walletData == null || walletData.created != true) {
            return <Redirect to="/create"/>
        }
        return (
            <div className="container-xl pt-5 justify-content-md-center">
                <div className="row">
                    <div className="col-9">
                        <div className="row">
                            <div className="col-9">
                                <h3>{walletData.name}</h3>
                                {walletData.walletAddress} [copy]<br/>
                                {toBech32(walletData.walletAddress)}                        
                            </div>
                            <div className="col-3 text-right">
                                <div className="lead">
                                    {this.state.balance && Number(web3utils.fromWei(this.state.balance+"")).toFixed(4)} ONE
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
                                    {this.state.error &&                
                                    <div className="row justify-content-md-center mt-4">
                                        <div className="alert alert-danger w-50" role="alert">
                                            {this.state.error && JSON.stringify(this.state.error)}
                                        </div>
                                    </div>}
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
                    </div>
                    <div className="col-3">
                        <SideMenu/>
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
const mapToProps = ({ environment }) => ({ environment });
export default connect(mapToProps, actions)(Wallet);