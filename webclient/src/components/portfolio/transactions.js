import React, { useState, useEffect, useContext } from "react";
import {
  SmartVaultContext,
  SmartVaultConsumer,
} from "../../context/SmartvaultContext";
import { connect } from "redux-zero/react";
import actions from "../../redux/actions";

const Transactions = (props) => {
  return (
    <>
      <div className="d-flex align-items-center justify-content-between my-3">
        <div className="d-flex align-items-baseline">
          <div className="fs-4 text-no-bank-grayscale-iron">Transactions</div>
          <span className="text-no-bank-grayscale-iron ms-2">All</span>
        </div>
        <i className="bi bi-arrow-up-right"></i>
      </div>
      <hr />
      <div className="row">
        <div className="col-3">
          <p
            className="text-no-bank-primary"
            style={{ overflowWrap: "anywhere" }}
          >
            24.08.21
          </p>
        </div>
        <div className="col-9">
          <div className="d-flex justify-content-between">
            <div className="ms-n3">
              <span className="text-no-bank-primary">noGold</span>
              <span className="ms-2 font-sm text-no-bank-primary bg-no-bank-grayscale-titanium  rounded-pill px-3 py-1">
                stablecoin
              </span>
            </div>
            <div>
              <span className="text-no-bank-primary">41</span>
              <span className="ms-2 text-no-bank-grayscale-iron">RGLD</span>
            </div>
          </div>
          <div className="d-flex justify-content-between">
            <div className="text-no-bank-grayscale-iron text-wrap ms-n3">
              UBS Personal Account
            </div>
            <div>
              <span className="text-no-bank-grayscale-iron">-73’734.40</span>
              <span className="ms-2 text-no-bank-grayscale-iron">CHF</span>
            </div>
          </div>
        </div>
      </div>
      <hr />
    </>
  );
};

const mapToProps = ({}) => ({});
export default connect(mapToProps, actions)(Transactions);
