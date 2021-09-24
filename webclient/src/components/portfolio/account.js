import React, { useState, useEffect, useContext } from "react";
import { connect } from "redux-zero/react";

const web3utils = require("web3-utils");

import { SmartVaultContext } from "../smartvault_provider";
import AccountProvider from "../smartvault_provider";

import actions from "../../redux/actions";

import SimpleChart from "./simpleChart";
import ChartHeader from "./chartHeader";

import { volumeData } from "./dataMock/volumeData";

import Positions from "./positions";

const CHFUSD = 1.08;

const Account = ({ setLocation }) => {
  const { smartvault } = useContext(SmartVaultContext);
  let dayPriceData = [];

  const portfolioValue = 301739;
  const dailyPnL = -1294;
  const unrealizedPnL = 31851;

  useEffect(() => {
    setLocation("Account");
  });

  // TODO: should be real P&L data

  return (
    <AccountProvider loadAccount={true}>
      <div className="container-fluid">
        <div className="row min-h-25">
          <div className="col-4">
            <img src="public/funding_sources_mock.png" className="img-fluid h-100" alt="" />
          </div>
          <div className="col-8 border border-no-bank-grayscale-silver justify-content-center">
            <div className="row p-3">
              <ChartHeader portfolioValue={portfolioValue} dailyPnL={dailyPnL} unrealizedPnL={unrealizedPnL} />
            </div>
            <div className="row p-3">
              <SimpleChart priceData={volumeData} />
            </div>

            <div className="row">
              <div className="btn-group" role="group" aria-label="Basic outlined example">
                <button type="button" className="btn btn-outline-no-bank-grayscale-iron">
                  1h
                </button>
                <button type="button" className="btn btn-outline-no-bank-grayscale-iron">
                  24h
                </button>
                <button type="button" className="btn btn-outline-no-bank-grayscale-iron">
                  1 week
                </button>
                <button type="button" className="btn btn-outline-no-bank-grayscale-iron">
                  1 month
                </button>
                <button type="button" className="btn btn-outline-no-bank-grayscale-iron">
                  YTD
                </button>
                <button type="button" className="btn btn-outline-no-bank-grayscale-iron">
                  1 year
                </button>
                <button type="button" className="btn btn-outline-no-bank-grayscale-iron">
                  5 years
                </button>
                <button type="button" className="btn btn-outline-no-bank-grayscale-iron">
                  MAX
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <Positions walletAddress={smartvault.walletData.walletAddress} />
        </div>
      </div>
    </AccountProvider>
  );
};

const mapToProps = ({}) => ({});
export default connect(mapToProps, actions)(Account);
