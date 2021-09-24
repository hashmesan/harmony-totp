import React, { useState, useEffect, useContext } from "react";
import { connect } from "redux-zero/react";

const web3utils = require("web3-utils");

import { SmartVaultContext } from "../smartvault_provider";

import actions from "../../redux/actions";

import SimpleChart from "./simpleChart";
import ComplexChart from "./complexChart";
import ChartHeader from "./chartHeader";
import Watchlist from "./watchlist";
import Top3Positions from "./top3Positions";
import ChartBottom from "./chartBottom";

import { pnlData } from "./dataMock/pnlData";

const CHFUSD = 1.08;

const Portfolio = ({ setLocation }) => {
  const { smartvault } = useContext(SmartVaultContext);

  const portfolioValue = 301739;
  const dailyPnL = -1294;
  const unrealizedPnL = 31851;

  useEffect(() => {
    setLocation("Portfolio");
  });

  return (
    <div className="container-fluid">
      <div className="row min-h-25">
        <div className="col-4">
          <img src="public/funding_sources_mock.png" className="img-fluid h-100" alt="" />
        </div>
        <div className="col-md-8 border-bottom-0 border border-no-bank-grayscale-silver justify-content-center">
          <div className="row p-4 pb-0">
            <ChartHeader portfolioValue={portfolioValue} dailyPnL={dailyPnL} unrealizedPnL={unrealizedPnL} />
          </div>
          <div className="row p-3">{pnlData && <SimpleChart priceData={pnlData} />}</div>

          <ChartBottom />
        </div>
      </div>
      <div className="row">
        <div className="col-lg-6 border border-no-bank-grayscale-silver p-4">
          <Top3Positions />
        </div>
        <div className="col-lg-6 border-start-0  border border-no-bank-grayscale-silver p-4">
          <Watchlist />
        </div>
      </div>
      <div className="row">
        <div className="col-6">
          {" "}
          <img src="public/news_mock.png" className="img-fluid h-100" alt="" />
        </div>
        <div className="col-3">
          {" "}
          <img src="public/guardians_mock.png" className="img-fluid h-100 " alt="" />
        </div>
        <div className="col-3">
          {" "}
          <img src="public/friends_mock.png" className="img-fluid h-100 " alt="" />
        </div>
      </div>
    </div>
  );
};

const mapToProps = ({}) => ({});
export default connect(mapToProps, actions)(Portfolio);
