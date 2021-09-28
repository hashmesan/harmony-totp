import React, { useContext, useState, useEffect } from "react";

import PaypalLogo from "../../../public/paypal.svg";
import AppleGoogleLogo from "../../../public/apple_google.svg";

import AddFundsModal from "./addFundsModal";

const addFundingSourceModal = () => {
  return (
    <div
      className="modal fade"
      id="addFundingSourceModal"
      tabIndex="-1"
      aria-labelledby="addFundsModalLabel"
      aria-hidden="false"
    >
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
        <div className="modal-content">
          <div className="modal-header border-bottom-0">
            <div
              className="fs-2 modal-title fw-bold text-no-bank-grayscale-iron"
              id="addFundsModalLabel"
            >
              Add Funds
            </div>
          </div>
          <div className="modal-body">
            <div className="bg-white align-content-center border-top border-no-bank-grayscale-titanium justify-content-start">
              <div className="d-flex flex-column mb-5 ps-2 pt-3 pe-3">
                <div>
                  {/* Add other wallet */}
                  <div className="d-flex align-items-center justify-content-between">
                    <i
                      className="bi bi-wallet pe-4"
                      style={{ fontSize: 60 }}
                    ></i>
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
                    <i
                      className="bi bi-credit-card pe-4"
                      style={{ fontSize: 60 }}
                    ></i>
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
                      <div className="h6 fw-bold">
                        Connect Google / Apple Pay
                      </div>
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
                  <AddFundsModal />
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer border-top-0">
            <button
              type="button"
              className="btn btn-outline-dark rounded-pill"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default addFundingSourceModal;
