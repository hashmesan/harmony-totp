import React, { useContext, useState, useEffect } from "react";

import PaypalLogo from "../../../public/paypal.svg";
import AppleGoogleLogo from "../../../public/apple_google.svg";

import AddFundsModal from "./addFundsModal";

const AddFunds = () => {
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
          <AddFundsModal />
        </div>
      </div>
    </div>
  );
};

export default AddFunds;
