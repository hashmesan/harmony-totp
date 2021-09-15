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
import SendHRC20 from "./wallet/send_erc20";
import SetDailyLimit from "./wallet/set_daily_limit";
import SetDrainAddress from "./wallet/set_drain_address";
import Upgrade from "./wallet/upgrade";
import Assets from "./wallet/assets";
import Dapps from "./wallet/dapps";
import Viper from "./wallet/viper";
import Address from "./common/address";
import AccountProvider from "./smartvault_provider";
import { SmartVaultContext, SmartVaultConsumer } from "./smartvault_provider";
import ThemeProvider from "./Theme";
import {ConfirmModal, ConfirmMulticall } from './wallet/confirm_modal.tsx';
import { connect } from "redux-zero/react";
import { SmartConfirmModal } from './wallet/confirm_modal';

class Wallet extends Component {
    constructor(props) {
        super(props)
        this.state = {}        
    }

    loadHistory() {
        this.context.smartvault.getDeposits().then(balance=>{
            this.setState({balance: balance})
        })

        this.context.smartvault.getTransactions().then(data=>{
            console.log("tx=", data)
            this.setState({transactionsData: data})
        })
    }
    componentDidMount() {
        this.loadHistory();
    }

    render() {
        //console.log(this.props)

        var walletData = this.context.smartvault.walletData;
        if (walletData == null || walletData.created != true) {
            return <Redirect to="/create"/>
        }

        return (
            <ThemeProvider>
            <SmartVaultConsumer>
                {({smartvault}) => (
                
                <div className="container-xl justify-content-md-center">
                    <div className="row">
                        <div className="col-12">
                            <div className="row">
                                <div className="col-9">
                                    <h3>{walletData.name}</h3>
                                    <Address walletAddress={walletData.walletAddress}/>
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
                                    <Route exact path="/wallet/dapps">
                                        <Dapps/>
                                    </Route>                                  
                                    <Route exact path="/wallet/viper">
                                        <Viper/>
                                    </Route>                                      
                                    <Route path="/wallet/send_hrc20/:address">
                                        <SendHRC20/>
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
                    <SmartConfirmModal opened={this.props.showSignModal} confirmMessage={this.props.confirmMessage} />
                </div>
                )}
            </SmartVaultConsumer>
            </ThemeProvider>
        );
    }
}
Wallet.contextType = SmartVaultContext;

const mapToProps = ({ showSignModal, confirmMessage }) => ({ showSignModal, confirmMessage });
const WalletWithProps = connect(mapToProps, null)(Wallet);

export default function WalletWithProvider() {
    return (<AccountProvider loadAccount={true}><WalletWithProps/></AccountProvider>)
}
/*
 curl -H "Content-Type:application/json" -X GET "https://api.s0.t.hmny.io/address?id=one1mcjmmtystwsr0xtglzhl4vyarsfrdvdn2ecx75&tx_view=ALL"
*/
