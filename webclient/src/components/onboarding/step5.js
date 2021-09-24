import React, { useContext, useState } from "react";
import { connect } from "redux-zero/react";
import { Link } from "react-router-dom";
import { Modal } from "bootstrap";
const web3utils = require("web3-utils");

//import { useAuth } from "../../context/AuthContext";

import { SmartVaultContext } from "../../context/SmartvaultContext";
import { useAuthState } from "../../context/FirebaseAuthContext";

import actions from "../../redux/actions";

import PaypalLogo from "../../../public/paypal.svg";
import AppleGoogleLogo from "../../../public/apple_google.svg";

const Step5 = () => {
  const [balance, setBalance] = useState(0);

  const [createFee, setCreateFee] = useState(0);
  const [rentPrice, setRentPrice] = useState(0);
  const [totalFee, setTotalFee] = useState(0);
  const [walletAddress, setWalletAddress] = useState(0);

  const [deposits, setDeposits] = useState("0");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  const { smartvault } = useContext(SmartVaultContext);
  const { user } = useAuthState();

  const checkBalance = async () => {
    const depositInfo = await smartvault.getDepositInfo();
    const balance = await smartvault.harmonyClient.getBalance(
      depositInfo.walletAddress
    );
    console.log("state: ", depositInfo.walletAddress);

    setCreateFee(depositInfo.createFee);
    setRentPrice(depositInfo.rentPrice);
    setTotalFee(depositInfo.totalFee);
    setWalletAddress(depositInfo.walletAddress);
    setBalance(balance);

    const submit = await smartvault.submitWallet((status) =>
      console.log("status: ", status)
    );
  };

  const handleClick = () => {
    console.log("doing sth before");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  console.log(user, smartvault);
  return (
    <div className="bg-white align-content-center border-top border-no-bank-grayscale-titanium justify-content-start pt-5 pe-5 ps-4 h-100">
      <div className="d-flex flex-column mb-5 ps-2 pt-3 pe-3">
        <div>
          {" "}
          <div className="fs-6 text-no-bank-grayscale-iron text-uppercase">
            step 5
          </div>
          <div className="fs-1 text-no-bank-primary">Add funds </div>
        </div>
        <div className="pt-5">
          {/* Add other wallet */}
          <div className="d-flex align-items-center justify-content-between">
            <i className="bi bi-wallet pe-4" style={{ fontSize: 60 }}></i>
            <div>
              <div className="h6 fw-bold">Add other wallet</div>
              <div className="fs-6">
                Fund your account using another Crypto provider such as
                Coinbase, Binance, Argent or Metamask
              </div>
            </div>
            <button
              type="button"
              className="btn"
              data-bs-toggle="modal"
              data-bs-target="#accountModal"
            >
              <i className="bi bi-plus"></i>
            </button>
          </div>
          <hr />
          {/* Add bank account */}
          <div className="d-flex align-items-center justify-content-between">
            <i className="bi bi-credit-card pe-4" style={{ fontSize: 60 }}></i>
            <div>
              <div className="h6 fw-bold">Add bank account</div>
              <div className="fs-6">
                Fund your account using another Crypto provider such as
                Coinbase, Binance, Argent or Metamask
              </div>
            </div>
            <button
              type="button"
              className="btn"
              data-bs-toggle="modal"
              data-bs-target="#accountModal"
            >
              <i className="bi bi-plus"></i>
            </button>
          </div>
          <hr />
          {/* Connect Paypal Account */}
          <div className="d-flex align-items-center justify-content-between">
            <img src={PaypalLogo} alt="" />
            <div>
              <div className="h6 fw-bold">Connect Paypal Account</div>
              <div className="fs-6">
                Fund your account using another Crypto provider such as
                Coinbase, Binance, Argent or Metamask
              </div>
            </div>
            <button
              type="button"
              className="btn"
              data-bs-toggle="modal"
              data-bs-target="#accountModal"
            >
              <i className="bi bi-plus"></i>
            </button>
          </div>
          <hr />
          {/* Connect Google / Apple Pay */}
          <div className="d-flex align-items-center justify-content-between">
            <img src={AppleGoogleLogo} alt="" />{" "}
            <div>
              <div className="h6 fw-bold">Connect Google / Apple Pay</div>
              <div className="fs-6">
                Fund your account using another Crypto provider such as
                Coinbase, Binance, Argent or Metamask
              </div>
            </div>
            <button
              type="button"
              className="btn"
              data-bs-toggle="modal"
              data-bs-target="#accountModal"
            >
              <i className="bi bi-plus"></i>
            </button>
          </div>
          <hr />
          {/* Modal */}
          <div
            className="modal fade"
            id="accountModal"
            tabIndex="-1"
            aria-labelledby="accountModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <div
                    className="h5 modal-title fw-bold"
                    id="accountModalLabel"
                  >
                    Add other wallet
                  </div>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <p>createFee: {createFee}</p>
                  <p>rentPrice: {rentPrice}</p>
                  <p>totalFee: {totalFee}</p>
                  <p>walletAddress: {walletAddress}</p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={checkBalance}
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={checkBalance}
          className="btn rounded-pill btn-no-bank-highlight text-rb-bank-primary"
        >
          TEST
        </button>
      </div>
      <div className="d-flex justify-content-end pe-5 pb-3 fixed-bottom">
        <div className="pe-3 pb-3">
          <Link to="/portfolio">
            <button
              type="button"
              onClick={handleClick}
              className="btn rounded-pill btn-no-bank-highlight text-rb-bank-primary"
            >
              Continue
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const mapToProps = () => ({});
export default connect(mapToProps, actions)(Step5);
