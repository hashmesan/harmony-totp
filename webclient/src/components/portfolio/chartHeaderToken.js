import React, { useRef, useEffect } from "react";

const baseCCY = "CHF";

const ChartHeaderToken = (props) => {
  return (
    <div>
      <div className="row">
        <div className="col">
          <div className="row fs-6 text-no-bank-grayscale-iron">Current {props.tokenName} price</div>
          <div className="row fs-4 text-no-bank-primary">
            {props.currentPrice.toLocaleString()} {baseCCY}
          </div>
        </div>
        <div className="col">
          <div className="fs-6 text-no-bank-grayscale-iron">Change</div>

          <div className="fs-4 text-danger">
            <span>{props.priceChange.toLocaleString()} %</span>
            <span>{baseCCY}</span>
            <span>
              <i className="bi bi-caret-down-fill text-danger p-1" />
            </span>
          </div>
        </div>
        <div className="col"></div>
      </div>
    </div>
  );
};

export default ChartHeaderToken;
