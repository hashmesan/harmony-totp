import React from "react";

const FundingSourcesModalElement = ({
  fundingSources,
  walletAddress,
  totalFee,
}) => {
  return (
    <div className="accordion-item">
      <h2 className="accordion-header">
        <div className="d-flex justify-content-between align-items-center px-2 py-3">
          <img src={fundingSources.logo} width="24" height="24" />
          <span className="fs-6 ms-3">{fundingSources.name}</span>
          <button
            className="accordion-button bg-no-bank-white  ms-auto"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target={`#Collapse${fundingSources.name}`}
            aria-expanded="false"
            aria-controls={`Collapse${fundingSources.name}`}
          ></button>
        </div>
      </h2>
      <div
        className="accordion-collapse collapse"
        id={`Collapse${fundingSources.name}`}
        aria-labelledby={`Heading${fundingSources.name}`}
        data-bs-parent="#accordionCryptoFundingSources"
      >
        <div className="accordion-body p-3">
          Please transfer a minimum of {totalFee} ONEs to start the creation of
          your wallet. This screen will be updated, once sufficient funds are
          received.
        </div>
        <div className="d-flex justify-content-center p-3">
          <img
            src={
              "https://chart.googleapis.com/chart?chs=200x200&chld=L|0&cht=qr&chl=" +
              walletAddress
            }
            width="100"
            height="100"
          />
        </div>
        <hr />
        <div className="px-2 py-3">
          <div className="text-no-bank-grayscale-iron pb-2">
            Your no-bank wallet adress:
          </div>
          <div className="border border-no-bank-grayscale-titanium p-3">
            {walletAddress}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundingSourcesModalElement;
