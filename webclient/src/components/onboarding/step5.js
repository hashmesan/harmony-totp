import React, { useContext, useState, useEffect } from "react";
import { connect } from "redux-zero/react";
import { Link } from "react-router-dom";
const web3utils = require("web3-utils");
const { toBech32, fromBech32 } = require("@harmony-js/crypto");

import { SmartVaultContext } from "../../context/SmartvaultContext";
import { getStorageKey, setLocalWallet } from "../../config";

import actions from "../../redux/actions";

import FundingSourcesModalElement from "./fundingSourcesModalElement";

import PaypalLogo from "../../../public/paypal.svg";
import AppleGoogleLogo from "../../../public/apple_google.svg";
import MetamaskLogo from "../../../public/metamask.svg";
import CoinbaseLogo from "../../../public/coinbase.svg";
import ArgentLogo from "../../../public/argent.svg";
import BinanceLogo from "../../../public/binance.svg";

import FundingProgress from "../../../public/fundingProgress.svg";
import FundingSuccess from "../../../public/funding_success.svg";

const cryptoFundingSources = [
  { name: "Metamask", logo: MetamaskLogo },
  { name: "Coinbase", logo: CoinbaseLogo },
  { name: "Argent", logo: ArgentLogo },
  { name: "Binance", logo: BinanceLogo },
];

const Step5 = ({ environment, setOnboardingStep }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [balance, setBalance] = useState(0);
  const [totalFee, setTotalFee] = useState(0);
  const [status, setStatus] = useState("checking balance");
  const [visualStatus, setVisualStatus] = useState("");
  const [initiated, setInitiated] = useState(false);
  const [validated, setValidated] = useState(false);
  const [statusPercentage, setStatusPercentage] = useState("0%");

  const { smartvault } = useContext(SmartVaultContext);
  const depositInfo = smartvault.getDepositInfo();

  useEffect(() => {
    const checkFees = async () => {
      setTotalFee(web3utils.fromWei(depositInfo.totalFee));
      setWalletAddress(depositInfo.walletAddress);
    };

    const checkBalance = async () => {
      const balance = await smartvault.harmonyClient.getBalance(
        depositInfo.walletAddress
      );

      setBalance(web3utils.fromWei(balance));
    };
    checkFees();
    checkBalance();

    const interval = setInterval(() => {
      checkBalance();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setOnboardingStep(5);
  }, []);

  useEffect(() => {
    if (balance > totalFee && !initiated) {
      setInitiated(true);
      submitWalletCreation();
    }
  }, [balance]);

  useEffect(() => {
    switch (status) {
      case "Deploying wallet, waiting for tx":
        setVisualStatus("Fund’s received! – You’re wallet is being built");
        setStatusPercentage("33%");

      case "setup complete, waiting for IPFS":
        setVisualStatus("Configuring access");
        setStatusPercentage("66%");

      case "Successful stored hash on contract.":
        setVisualStatus("All set, your wallet is ready!");
        setStatusPercentage("100%");
    }
  }, [status]);

  const submitWalletCreation = async () => {
    if (balance > totalFee) {
      const submit = await smartvault.submitWallet((status) => {
        setStatus(status);
        console.log("status: ", status);
      });
      saveWalletToLocalStorage();
      setValidated(true);
    } else {
      console.log("not enough money");
      setValidated(false);
    }
  };

  const saveWalletToLocalStorage = () => {
    localStorage.removeItem(getStorageKey(environment, true));
    var storeData = smartvault.walletData;
    delete storeData["leaves_arr"];
    setLocalWallet(environment, JSON.stringify(storeData), false);
  };

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
                {!initiated && (
                  <div>
                    <div className="modal-header">
                      <div
                        className="h2 modal-title fw-bold text-no-bank-grayscale-iron"
                        id="accountModalLabel"
                      >
                        Add other wallet
                      </div>
                    </div>
                    <div className="modal-body">
                      <p>Which wallet would you like to connect?</p>
                      <div
                        className="accordion"
                        id="accordionCryptoFundingSources"
                      >
                        {cryptoFundingSources.map((fundingSource) => (
                          <FundingSourcesModalElement
                            fundingSources={fundingSource}
                            walletAddress={
                              walletAddress || "wallet address undefined"
                            }
                            totalFee={totalFee || 0}
                            key={fundingSource.name}
                          />
                        ))}
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-bs-dismiss="modal"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {initiated && (
                  <div>
                    <div className="modal-body">
                      {" "}
                      <div
                        className="h2 modal-title fw-bold text-no-bank-grayscale-iron"
                        id="accountModalLabel"
                      >
                        Funding your account...
                      </div>
                      <div className="d-flex justify-content-center p-3">
                        {!validated && (
                          <img src={FundingProgress} width="100" height="100" />
                        )}
                        {validated && (
                          <img src={FundingSuccess} width="100" height="100" />
                        )}
                      </div>
                      <div className="text-no-bank-grayscale-iron">
                        {visualStatus}
                      </div>
                      {!validated && (
                        <div className="d-flex justify-content-center p-3">
                          <div className="progress">
                            {" "}
                            <div
                              className="progress-bar progress-bar-striped "
                              role="progressbar"
                              aria-valuemin="0"
                              aria-valuemax="100"
                              style={{ width: statusPercentage }}
                            ></div>
                          </div>
                        </div>
                      )}
                      {validated && (
                        <div className="d-flex justify-content-center p-3">
                          <button
                            type="button"
                            className={`btn rounded-pill ${
                              validated
                                ? "btn-no-bank-highlight text-rb-bank-primary"
                                : "btn-no-bank-grayscale-silver text-white"
                            }`}
                          >
                            Close
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-end pe-5 pb-3 fixed-bottom">
          <div className="pe-3 pb-3">
            <Link to="/onboard/4">
              <button
                id="backButton"
                type="button"
                className="btn rounded-pill btn-no-bank-white text-rb-bank-primary pe-4 me-1"
              >
                Back
              </button>
            </Link>
            <Link to="/portfolio">
              <button
                type="button"
                className={`btn rounded-pill ${
                  validated
                    ? "btn-no-bank-highlight text-rb-bank-primary"
                    : "btn-no-bank-grayscale-silver text-white"
                }`}
                //disabled={!validated && "disabled"}
              >
                Skip
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapToProps = ({ environment }) => ({ environment });
export default connect(mapToProps, actions)(Step5);
