import React, { useRef, useEffect } from "react";

const portfolioValue = 301739;
const dailyPnL = -1294;
const unrealizedPnL = 31851;
const baseCCY = " CHF";

const ChartHeader = () => {
  return (
    <div>
      <div className="row">
        <div className="col">
          <div className="row fs-6 text-no-bank-grayscale-iron">
            Total portfolio value
          </div>
          <div className="row fs-4 text-no-bank-primary">
            {portfolioValue.toLocaleString()} {baseCCY}
          </div>
        </div>
        <div className="col">
          <div className="row fs-6 text-no-bank-grayscale-iron">Daily P&L</div>
          <div className="row">
            <div className="col fs-4 text-danger">
              {" "}
              {dailyPnL.toLocaleString()}
              {baseCCY}
              <i className="bi bi-caret-down-fill text-danger p-1" />
            </div>
          </div>
        </div>
        <div className="col">
          <div className="row fs-6 text-no-bank-grayscale-iron">
            Unrealized P&L
          </div>
          <div className="row fs-4 text-success">
            {unrealizedPnL.toLocaleString()}
            {baseCCY}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartHeader;
