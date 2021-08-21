import React, { Component } from "react";
import {
  CONFIG,
  getStorageKey,
  getLocalWallet,
  setLocalWallet,
} from "../config";
import SmartVault from "../../../lib/smartvault_lib";
import { connect } from "redux-zero/react";

export const SmartVaultContext = React.createContext({});
SmartVaultContext.displayName = "MyDisplayName";

class AccountProvider extends Component {
  constructor(props) {
    super(props);
    this.smartvault = new SmartVault(CONFIG[this.props.environment]);
    if (props.loadPending) {
      var data = JSON.parse(getLocalWallet(this.props.environment, true)) || {};
      console.log("Loaded...", data.name);
      this.smartvault.loadFromWalletData(data);
    }
    if (props.loadAccount) {
      var data = JSON.parse(getLocalWallet(this.props.environment, false));
      if (data) {
        console.log("Loaded...", data.name);
        this.smartvault.loadFromWalletData(data);
      }
    }
  }

  savePending() {
    console.log("Save pending data...");
    setLocalWallet(
      this.props.environment,
      JSON.stringify(this.smartvault.walletData),
      true
    );
  }

  render() {
    return (
      <SmartVaultContext.Provider
        value={{
          smartvault: this.smartvault,
          savePending: this.savePending.bind(this),
        }}
      >
        {this.props.children}
      </SmartVaultContext.Provider>
    );
  }
}

const mapToProps = ({ environment }) => ({ environment });
export default connect(mapToProps)(AccountProvider);
//export default AccountProvider;

export const SmartVaultConsumer = SmartVaultContext.Consumer;
