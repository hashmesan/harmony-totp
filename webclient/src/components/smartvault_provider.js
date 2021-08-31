import React, { Component } from 'react';
import {CONFIG, DEFAULT_TOKEN_LIST, getStorageKey, getLocalWallet, setLocalWallet} from "../config";
import SmartVault from "../../../lib/smartvault_lib";
import { connect } from "redux-zero/react";

export const SmartVaultContext = React.createContext({})
SmartVaultContext.displayName = 'MyDisplayName';

class AccountProvider extends Component {
    constructor(props) {
        super(props)
        this.smartvault = new SmartVault(CONFIG[this.props.environment]);
        if(props.loadPending) {
            var data = JSON.parse(getLocalWallet(this.props.environment, true)) || {};
            console.log("Loaded...", data.name);
            this.smartvault.loadFromWalletData(data);
        }
        if(props.loadAccount) {
            var data = JSON.parse(getLocalWallet(this.props.environment, false));
            if(data) {
                console.log("Loaded...", data.name);
                this.smartvault.loadFromWalletData(data);    
            }
        }
        this.state = {}
    }

    componentDidMount() {
        // getTokenList(DEFAULT_TOKEN_LIST, CONFIG[this.props.environment].chainId).then(tokens => {
        //     this.setState({tokens})
        // })
    }
    savePending() {
        console.log("Save pending data...");
        setLocalWallet(this.props.environment, JSON.stringify(this.smartvault.walletData), true);
    }

    saveWallet() {
        console.log("Save data...");
        setLocalWallet(this.props.environment, JSON.stringify(this.smartvault.walletData), false);
    }

    render () {
        return (
           <SmartVaultContext.Provider value={{smartvault: this.smartvault, saveWallet: this.saveWallet.bind(this), savePending: this.savePending.bind(this)}}>
            {this.props.children}
          </SmartVaultContext.Provider>
        )
    }    
}

const mapToProps = ({ environment }) => ({ environment });
export default connect(mapToProps)(AccountProvider);
//export default AccountProvider;

export const SmartVaultConsumer = SmartVaultContext.Consumer;