import React, { useState, useEffect, useContext } from "react";
import { connect } from "redux-zero/react";

const web3utils = require("web3-utils");

import { SmartVaultContext } from "../../context/SmartvaultContext";

import actions from "../../redux/actions";

import SimpleChart from "./simpleChart";
import ComplexChart from "./complexChart";
import ChartHeader from "./chartHeader";
import Watchlist from "./watchlist";
import Top3Positions from "./top3Positions";
import ChartBottom from "./chartBottom";
import FundingSourcesAndContacts from "./fundingSourcesAndContacts";

import { pnlData } from "./dataMock/pnlData";

const CHFUSD = 1.08;

const Portfolio = ({ setLocation }) => {
  const { smartvault } = useContext(SmartVaultContext);

  const portfolioValue = 301739;
  const dailyPnL = -1294;
  const unrealizedPnL = 31851;

  useEffect(() => {
    setLocation("portfolio");
  });

  return (
    <div className="container-fluid">
      <div className="row min-h-25">
        <div className="col-md-4 border-bottom-0 border-end-0 border border-no-bank-grayscale-silver justify-content-center p-0">
          <FundingSourcesAndContacts />
        </div>
        <div className="col-md-8 border-bottom-0 border border-no-bank-grayscale-silver justify-content-center">
          <div className="row p-4 pb-0">
            <ChartHeader
              portfolioValue={portfolioValue}
              dailyPnL={dailyPnL}
              unrealizedPnL={unrealizedPnL}
            />
          </div>
          <div className="row p-3">
            {pnlData && <SimpleChart priceData={pnlData} />}
          </div>

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
      <div className="row border border-top-0 border-no-bank-grayscale-silver">
        <div className="col-6 px-0">
          <img src="public/news_mock.png" className="img-fluid h-100" alt="" />
        </div>

        <div className="col-6 px-0 bg-no-bank-hovergrey">
          <img
            src="public/product_MajorTom.png"
            className="img-fluid border-0"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

const mapToProps = ({}) => ({});
export default connect(mapToProps, actions)(Portfolio);
