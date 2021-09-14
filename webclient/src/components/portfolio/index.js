import React, { useState, useEffect, useContext } from "react";
import { connect } from "redux-zero/react";

const web3utils = require("web3-utils");

import { SmartVaultContext } from "../smartvault_provider";

import actions from "../../redux/actions";

import SimpleChart from "./simpleChart";
import ComplexChart from "./complexChart";

const Portfolio = ({ setLocation }) => {
  const { smartvault } = useContext(SmartVaultContext);

  useEffect(() => {
    setLocation("Portfolio");
  });

  return (
    <div className="container-fluid">
      <div className="row min-h-25">
        <div className="col-6">
          <SimpleChart />
        </div>
        <div className="col-6">
          {/*<img src="public/chart_mock.png" className="img-fluid h-100" alt="" /> */}
          <ComplexChart />
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
