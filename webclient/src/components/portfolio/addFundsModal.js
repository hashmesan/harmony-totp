import React, { useContext, useState, useEffect } from "react";
import FundingSourcesModalElement from "./fundingSourcesModalElement";

import FundingProgress from "../../../public/fundingProgress.svg";
import FundingSuccess from "../../../public/funding_success.svg";
import MetamaskLogo from "../../../public/metamask.svg";
import CoinbaseLogo from "../../../public/coinbase.svg";
import ArgentLogo from "../../../public/argent.svg";
import BinanceLogo from "../../../public/binance.svg";

const cryptoFundingSources = [
  { name: "Metamask", logo: MetamaskLogo },
  { name: "Coinbase", logo: CoinbaseLogo },
  { name: "Argent", logo: ArgentLogo },
  { name: "Binance", logo: BinanceLogo },
];
const AddFundsModal = () => {
  return (
    <div
      className="modal fade"
      id="accountModal"
      tabIndex="-1"
      aria-labelledby="accountModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
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
              <div className="accordion" id="accordionCryptoFundingSources">
                {cryptoFundingSources.map((fundingSource) => (
                  <FundingSourcesModalElement
                    fundingSources={fundingSource}
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
        </div>
      </div>
    </div>
  );
};

export default AddFundsModal;
