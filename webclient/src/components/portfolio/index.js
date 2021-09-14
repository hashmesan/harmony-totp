import React, { useState, useEffect, useContext } from "react";
import { connect } from "redux-zero/react";

const web3utils = require("web3-utils");

import { SmartVaultContext } from "../smartvault_provider";

import actions from "../../redux/actions";

import SimpleChart from "./simpleChart";
import ComplexChart from "./complexChart";
import ChartHeader from "./chartHeader";

const Portfolio = ({ setLocation }) => {
  const { smartvault } = useContext(SmartVaultContext);

  useEffect(() => {
    setLocation("Portfolio");
  });

  return (
    <div className="container-fluid">
      <div className="row min-h-25">
        <div className="col-4">
          <img
            src="public/funding_sources_mock.png"
            className="img-fluid h-100"
            alt=""
          />
        </div>
        <div className="col-8 border border-no-bank-grayscale-silver justify-content-center">
          <div className="row p-3">
            <ChartHeader />
          </div>
          <div className="row p-3">
            <SimpleChart />
          </div>

          <div className="row">
            <div
              class="btn-group"
              role="group"
              aria-label="Basic outlined example"
            >
              <button
                type="button"
                class="btn btn-outline-no-bank-grayscale-iron"
              >
                1h
              </button>
              <button
                type="button"
                class="btn btn-outline-no-bank-grayscale-iron"
              >
                24h
              </button>
              <button
                type="button"
                class="btn btn-outline-no-bank-grayscale-iron"
              >
                1 week
              </button>
              <button
                type="button"
                class="btn btn-outline-no-bank-grayscale-iron"
              >
                1 month
              </button>
              <button
                type="button"
                class="btn btn-outline-no-bank-grayscale-iron"
              >
                YTD
              </button>
              <button
                type="button"
                class="btn btn-outline-no-bank-grayscale-iron"
              >
                1 year
              </button>
              <button
                type="button"
                class="btn btn-outline-no-bank-grayscale-iron"
              >
                5 years
              </button>
              <button
                type="button"
                class="btn btn-outline-no-bank-grayscale-iron"
              >
                MAX
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-6">
          {" "}
          <img
            src="public/positions_mock.png"
            className="img-fluid h-100"
            alt=""
          />
        </div>
        <div className="col-6">
          {" "}
          <img
            src="public/watchlist_mock.png"
            className="img-fluid h-100 "
            alt=""
          />
        </div>
      </div>
      <div className="row">
        <div className="col-6">
          {" "}
          <img src="public/news_mock.png" className="img-fluid h-100" alt="" />
        </div>
        <div className="col-3">
          {" "}
          <img
            src="public/guardians_mock.png"
            className="img-fluid h-100 "
            alt=""
          />
        </div>
        <div className="col-3">
          {" "}
          <img
            src="public/friends_mock.png"
            className="img-fluid h-100 "
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

const mapToProps = ({}) => ({});
export default connect(mapToProps, actions)(Portfolio);
