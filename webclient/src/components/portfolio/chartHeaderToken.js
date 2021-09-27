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

          <div className={"fs-4 " + (props.priceChange > 0 ? "text-success" : "text-danger")}>
            <span>{props.priceChange.toLocaleString()} %</span>
            <i className={"p-1 bi " + (props.priceChange > 0 ? "bi-caret-up-fill text-success" : "bi-caret-down-fill text-danger")} />
          </div>
        </div>
        <div className="col"></div>
      </div>
    </div>
  );
};

export default ChartHeaderToken;
