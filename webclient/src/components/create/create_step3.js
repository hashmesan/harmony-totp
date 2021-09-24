import React, { Component } from "react";
import { withRouter } from "react-router-dom";
const web3utils = require("web3-utils");
const { toBech32, fromBech32 } = require("@harmony-js/crypto");

import { connect } from "redux-zero/react";
import actions from "../../redux/actions";
import { getApiUrl, getStorageKey, setLocalWallet } from "../../config";
import {
  SmartVaultContext,
  SmartVaultConsumer,
} from "../../context/SmartvaultContext";

class FirstDeposit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balance: 0,
      deposits: "0",
      continue: false,
      showQR: false,
      busy: false,
      status: "",
    };
  }
  checkBalance() {
    var self = this;
    const depositInfo = this.context.smartvault.getDepositInfo();

    this.context.smartvault
      .getDeposits()
      .then((balance) => {
        console.log("Balance=", balance);

        if (
          new web3utils.BN(balance).gte(new web3utils.BN(depositInfo.totalFee))
        ) {
          self.setState({ deposits: balance, continue: true });
        } else {
          self.setState({ deposits: balance, continue: false });
          setTimeout(self.checkBalance.bind(self), 3000);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  toggleQR(e) {
    e.preventDefault();
    this.setState({ showQR: !this.state.showQR });
  }

  componentDidMount() {
    this.checkBalance();
  }

  saveWalletToLocalStorage() {
    localStorage.removeItem(getStorageKey(this.props.environment, true));
    var storeData = this.context.smartvault.walletData;
    delete storeData["leaves_arr"];
    setLocalWallet(this.props.environment, JSON.stringify(storeData), false);
  }

  createWallet(ev) {
    console.log(this.data);

    var self = this;
    self.setState({ busy: true });
    ev.preventDefault();

    this.context.smartvault
      .submitWallet((status) => {
        self.setState({ status: self.state.status + "\n" + status });
      })
      .then((res) => {
        console.log("Wallet created! ", res);
        self.setState({ busy: false });
        self.saveWalletToLocalStorage();
        self.props.history.push("/wallet");
      })
      .catch((e) => {
        console.log(e);
        if ("reason" in e) {
          self.setState({
            error: "TX: " + e.tx + " (" + e.reason + ")",
            busy: false,
          });
        }
        if (e.response) {
          self.setState({
            error: JSON.stringify(e.response.data),
            busy: false,
          });
        } else {
          self.setState({ error: e.message, busy: false });
        }
      });
  }

  render() {
    const walletData = this.context.smartvault.walletData;
    const depositInfo = this.context.smartvault.getDepositInfo();
    const remainFee = new web3utils.BN(depositInfo.totalFee).sub(
      new web3utils.BN(this.state.deposits)
    );
    console.log(depositInfo);

    return (
      <SmartVaultConsumer>
        {({ smartvault }) => (
          <React.Fragment>
            <h2>YOUR FIRST DEPOSIT</h2>
            <h5 className="mt-4 mb-5">
              There is a network fee to activate your wallet as it is a smart
              contract. <br />
              This fee will be taken from your first deposit
            </h5>
            <div className="mt-5">
              <p>
                <b>Wallet Address:</b> {toBech32(walletData.walletAddress)}{" "}
                {walletData.walletAddress}
                <a
                  href="#"
                  className="btn btn-link"
                  onClick={this.toggleQR.bind(this)}
                >
                  {this.state.showQR ? "Hide QR Code" : "Show QR Code"}
                </a>
                {this.state.showQR && (
                  <div>
                    <img
                      src={
                        "https://chart.googleapis.com/chart?chs=200x200&chld=L|0&cht=qr&chl=" +
                        toBech32(walletData.walletAddress)
                      }
                      width="200"
                      height="200"
                    />
                  </div>
                )}
              </p>
              <p>
                <b>Name Service Fee:</b>{" "}
                {depositInfo.rentPrice &&
                  web3utils.fromWei(depositInfo.rentPrice)}{" "}
                ONE
                <br />
                <b>Network Fee:</b>{" "}
                {depositInfo.createFee &&
                  web3utils.fromWei(depositInfo.createFee)}{" "}
                ONE
                <br />
                <b>TOTAL FEE:</b> {web3utils.fromWei(depositInfo.totalFee)} ONE
              </p>

              {this.state.deposits == "0" ? (
                <div className="text-center">
                  <p>
                    <b>Status:</b> Waiting for deposit...
                  </p>
                  <div className="spinner-grow text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p>
                    <b>Status:</b> Received deposit of{" "}
                    {web3utils.fromWei(this.state.deposits)} ONE
                  </p>
                  {new web3utils.BN(this.state.deposits).lt(
                    new web3utils.BN(depositInfo.totalFee)
                  ) && (
                    <p>
                      Expecting remaining deposit of{" "}
                      {web3utils.fromWei(remainFee)}
                    </p>
                  )}
                </div>
              )}

              <div className="row justify-content-md-center mt-4">
                <pre>{this.state.status}</pre>
              </div>
              {this.state.error && (
                <div className="row justify-content-md-center mt-4">
                  <div className="alert alert-danger w-50" role="alert">
                    {this.state.error && JSON.stringify(this.state.error)}
                  </div>
                </div>
              )}

              {this.state.continue && !this.state.busy && (
                <button
                  className="mt-5 btn btn-lg btn-primary"
                  onClick={this.createWallet.bind(this)}
                >
                  Create Wallet
                </button>
              )}
              {this.state.continue && this.state.busy && (
                <button className="mt-5 btn btn-lg btn-primary">
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Waiting for tx...
                </button>
              )}
            </div>
          </React.Fragment>
        )}
      </SmartVaultConsumer>
    );
  }
}
FirstDeposit.contextType = SmartVaultContext;

const mapToProps = ({ environment }) => ({ environment });
export default connect(mapToProps, actions)(withRouter(FirstDeposit));
