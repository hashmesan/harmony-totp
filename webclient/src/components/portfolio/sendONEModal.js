import React, { useState, useEffect, useContext, useCallback } from "react";
import { connect } from "redux-zero/react";
import actions from "../../redux/actions";
import AddGuardianFriendModal from "./addGuardianFriendModal";
import { SmartVaultContext } from "../../context/SmartvaultContext";
const web3utils = require("web3-utils");

const { toBech32, fromBech32 } = require("@harmony-js/crypto");

const SendONEModal = ({ selected = { hns: "" } }) => {
  console.log("selected", selected.address);
  const { smartvault } = useContext(SmartVaultContext);
  //const gasLimit = web3utils.toBN(smartvault.config.gasLimit);
  const gasLimit = smartvault.config.gasLimit;
  //const gasPrice = web3utils.toBN(smartvault.config.gasPrice);
  const gasPrice = web3utils.fromWei(smartvault.config.gasPrice + "", "gwei");
  const gasPriceWEIWEI = smartvault.config.gasPrice;
  //const gasFee = gasLimit.mul(gasPrice);
  const walletAddress = smartvault.walletData.walletAddress;
  const ownerAccount = smartvault.ownerAccount;
  const [amount, setAmount] = useState(web3utils.toWei("1"));

  const transferONE = useCallback(async () => {
    if (selected.address) {
      try {
        const transfer = await smartvault.relayClient.transferTX(
          walletAddress,
          selected.address,
          amount,
          parseInt(gasPriceWEIWEI),
          gasLimit,
          ownerAccount
        );
        console.log("transfer");
      } catch (e) {
        alert(e.message);
      }
    }
  }, [selected, fromBech32]);
  return (
    <div
      className="modal fade"
      id="sendONEModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              Transfer Funds to {selected.hns}
            </h5>
          </div>
          <div className="modal-body">
            <form action="">
              <div className="input-group">
                <input
                  placeholder="Amount in ONE"
                  className="form-control m-0 text-no-bank-grayscale-iron"
                  required
                  onChange={(e) => setAmount(web3utils.toWei(e.target.value))}
                />
                <button
                  data-bs-dismiss="modal"
                  type="button"
                  onClick={transferONE}
                  className="btn btn-no-bank-highlight text-rb-bank-primary rounded-pill ms-3"
                >
                  Execute Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendONEModal;

/*
<div>
      <div
        className="modal fade"
        id="sendONEModal"
        aria-labelledby="sendONEModalLabel"
        aria-hidden="false"
      >
        {" "}
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
          <div className="modal-header">
            <div
              className="h2 modal-title fw-bold text-no-bank-grayscale-iron"
              id="accountModalLabel"
            >
              Transfer Funds to {selected.hns}
            </div>
            <button onClick={transferONE}>KICK ME</button>
          </div>
        </div>
      </div>
    </div>

*/
