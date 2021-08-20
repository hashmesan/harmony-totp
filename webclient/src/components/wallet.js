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
import SideMenu from "./wallet/side_menu";
import Transactions from "./wallet/transactions";
import WalletInfo from "./wallet/wallet_info";
import SendPayment from "./wallet/send_payment";
import SetDailyLimit from "./wallet/set_daily_limit";
import SetDrainAddress from "./wallet/set_drain_address";
import Upgrade from "./wallet/upgrade";
import Assets from "./wallet/assets";

import AccountProvider from "./smartvault_provider";
import { SmartVaultContext, SmartVaultConsumer } from "./smartvault_provider";

class Wallet extends Component {
    constructor(props) {
        super(props)
        this.state = {}        
    }

    loadHistory() {
        var self = this;
        this.context.smartvault.getDeposits().then(balance=>{
            self.setState({balance: balance})
        })

        this.context.smartvault.getTransactions().then(data=>{
            self.setState({transactionsData: data})
        })
    }
    componentDidMount() {
        this.loadHistory();
    }

    render() {
        //console.log(this.context.smartvault)
        var walletData = this.context.smartvault.walletData;
        if (walletData == null || walletData.created != true) {
            return <Redirect to="/create"/>
        }

        return (
            <SmartVaultConsumer>
                {({smartvault}) => (
                
                <div className="container-xl justify-content-md-center">
                    <div className="row">
                        <div className="col-12">
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
                        </div>
                        <div className="col-8 mt-5">
                            <Router>
                                <Switch>
                                    <Route exact path="/wallet">
                                        <Assets/>
                                        <Transactions data={this.state.transactionsData}/>                                    
                                    </Route>
                                    <Route path="/wallet/send_one">
                                        <SendPayment/>
                                        <Transactions data={this.state.transactionsData}/>                                    
                                    </Route>
                                    <Route path="/wallet/set_daily_limit">
                                        <SetDailyLimit/>
                                    </Route>
                                    <Route path="/wallet/set_drain_address">
                                        <SetDrainAddress/>
                                    </Route>
                                    <Route path="/wallet/upgrade">
                                        <Upgrade/>
                                    </Route>
                                </Switch>
                            </Router>                            
                        </div>                    
                        <div className="col-4 mt-5">
                            <WalletInfo walletAddress={walletData.walletAddress}/>
                            <SideMenu/>
                        </div> 
                    </div>
                    <Notifications/>     
                </div>
                )}
            </SmartVaultConsumer>
        );
    }
}
Wallet.contextType = SmartVaultContext;

export default function WalletWithProvider() {
    return (<AccountProvider loadAccount={true}><Wallet/></AccountProvider>)
}
/*
 curl -H "Content-Type:application/json" -X GET "https://api.s0.t.hmny.io/address?id=one1mcjmmtystwsr0xtglzhl4vyarsfrdvdn2ecx75&tx_view=ALL"
*/
