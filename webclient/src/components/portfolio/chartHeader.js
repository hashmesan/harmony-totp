import React, { useRef, useEffect } from "react";

const baseCCY = " CHF";

const ChartHeader = (props) => {
  return (
    <div>
      <div className="row">
        <div className="col">
          <div className="row fs-6 text-no-bank-grayscale-iron">Total portfolio value</div>
          <div className="row fs-4 text-no-bank-primary">
            {props.portfolioValue.toLocaleString()} {baseCCY}
          </div>
        </div>
        <div className="col">
          <div className="fs-6 text-no-bank-grayscale-iron">Daily P&L</div>

          <div className="fs-4 text-danger">
            <span>{props.dailyPnL.toLocaleString()}</span>
            <span>{baseCCY}</span>
            <span>
              <i className="bi bi-caret-down-fill text-danger p-1" />
            </span>
          </div>
        </div>
        <div className="col">
          <div className="row fs-6 text-no-bank-grayscale-iron">Unrealized P&L</div>
          <div className="row fs-4 text-success">
            {props.unrealizedPnL.toLocaleString()}
            {baseCCY}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartHeader;
