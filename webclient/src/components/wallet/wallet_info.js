import React, { Component } from "react";
import HarmonyClient from "../../../../lib/harmony_client";
import { connect } from "redux-zero/react";
import {
  getStorageKey,
  getLocalWallet,
  getApiUrl,
  getExplorerUrl,
  CONFIG,
} from "../../config";
const ethers = require("ethers");
const web3utils = require("web3-utils");
const { toBech32, fromBech32 } = require("@harmony-js/crypto");

class WalletInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.client = new HarmonyClient(
      CONFIG[props.environment].RPC_URL,
      CONFIG[props.environment].ENS_ADDRESS
    );
  }

  componentDidMount() {
    const self = this;
    this.client.getSmartVaultInfo(this.props.walletAddress).then((e) => {
      self.setState({ data: e });
    });
  }

  render() {
    if (!this.state.data) return null;
    return (
      <div className="accordion" id="accordionExample">
        <div className="card">
          <div className="card-header text-center" id="headingOne">
            <a
              data-toggle="collapse"
              data-target="#collapseOne"
              aria-expanded="true"
              aria-controls="collapseOne"
            >
              Wallet Info
            </a>
          </div>
          <div
            id="collapseOne"
            className="collapse show"
            aria-labelledby="headingOne"
            data-parent="#accordionExample"
          >
            <div className="card-body">
              <div className="text-center">
                <h6>
                  <b>Spending Limit</b>
                </h6>
                <div>
                  {web3utils.fromWei(this.state.data.spentToday)} /{" "}
                  {web3utils.fromWei(this.state.data.dailyLimit)} ONE
                </div>
                resets in {this.state.data.lastDay}
              </div>
              <hr />
              <div className="text-center">
                <h6>
                  <b>Two-Factor (2FA)</b>
                </h6>
                <table className="table table-sm table-borderless text-left">
                  <tbody>
                    <tr>
                      <td>OTP Tokens</td>
                      <td>
                        {this.state.data.counter} /{" "}
                        {Math.pow(2, parseInt(this.state.data.merkelHeight))}
                      </td>
                    </tr>
                    <tr>
                      <td># of Guardians</td>
                      <td>{this.state.data.guardians.length}</td>
                    </tr>
                    <tr>
                      <td>IPFS Merkle Backup</td>
                      <td>
                        {this.state.data.hashStorageID.startsWith("Q")
                          ? "YES"
                          : "NO"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <hr />
              <div className="text-center">
                <h6>
                  <b>Drain Address</b>
                </h6>
                <div>
                  {this.state.data.drainAddr == ethers.constants.AddressZero
                    ? "Not set"
                    : toBech32(this.state.data.drainAddr)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapToProps = ({ environment }) => ({ environment });
export default connect(mapToProps)(WalletInfo);
