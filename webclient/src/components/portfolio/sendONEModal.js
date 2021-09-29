import React, { useState, useEffect, useContext } from "react";
import { connect } from "redux-zero/react";
import actions from "../../redux/actions";
import AddGuardianFriendModal from "./addGuardianFriendModal";
import { SmartVaultContext } from "../../context/SmartvaultContext";
const web3utils = require("web3-utils");

const { toBech32, fromBech32 } = require("@harmony-js/crypto");

const SendONEModal = ({ guardians, friends }) => {
  const { smartvault } = useContext(SmartVaultContext);
  //const gasLimit = web3utils.toBN(smartvault.config.gasLimit);
  const gasLimit = smartvault.config.gasLimit;
  //const gasPrice = web3utils.toBN(smartvault.config.gasPrice);
  const gasPrice = web3utils.fromWei(smartvault.config.gasPrice + "", "gwei");
  const gasPriceWEIWEI = smartvault.config.gasPrice;
  //const gasFee = gasLimit.mul(gasPrice);
  const walletAddress = smartvault.walletData.walletAddress;
  const ownerAccount = smartvault.ownerAccount;

  const [destination, setDestination] = useState(
    fromBech32("one1qrgrp4mcdt8ha2kfn7m7tph5udv2j576qd2eun")
  );
  const [amount, setAmount] = useState(web3utils.toWei("1"));

  const transferONE = async () => {
    console.log("arrived here");
    try {
      const transfer = await smartvault.relayClient.transferTX(
        walletAddress,
        destination,
        amount,
        parseInt(gasPriceWEIWEI),
        gasLimit,
        ownerAccount
      );
      console.log("transfer");
    } catch (e) {
      alert(e.message);
    }
  };
  return (
    <div>
      <div
        className="modal fade"
        id="addFundingSourceModal"
        tabIndex="-1"
        aria-labelledby="addFundsModalLabel"
        aria-hidden="false"
      >
        {" "}
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
          <div className="modal-content">
            <button onClick={transferONE}>CLICKME</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendONEModal;
