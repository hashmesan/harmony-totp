import React, { useState, useEffect, useContext } from "react";
import { connect } from "redux-zero/react";
import actions from "../../redux/actions";

const ChartBottom = () => {
  return (
    <div className="d-flex align-items-center cancel-col-padding pointer">
      <div className="border-start-0 border border-no-bank-grayscale-silver text-no-bank-grayscale-iron flex-fill py-2 text-center font-sm">1 hour</div>
      <div className="border-start-0 border border-no-bank-grayscale-silver text-no-bank-grayscale-iron flex-fill py-2 text-center font-sm">24 hour</div>
      <div className="border-start-0 border border-no-bank-grayscale-silver text-no-bank-grayscale-iron flex-fill py-2 text-center font-sm">1 week</div>
      <div className="bg-no-bank-grayscale-platin border-start-0 border border-no-bank-grayscale-silver text-no-bank-grayscale-iron flex-fill py-2 text-center font-sm fw-bold">1 month</div>
      <div className="border-start-0 border border-no-bank-grayscale-silver text-no-bank-grayscale-iron flex-fill py-2 text-center font-sm">YTD</div>
      <div className="border-start-0 border border-no-bank-grayscale-silver text-no-bank-grayscale-iron flex-fill py-2 text-center font-sm">1 year</div>
      <div className="border-start-0 border border-no-bank-grayscale-silver text-no-bank-grayscale-iron flex-fill py-2 text-center font-sm">5 years</div>
      <div className="border-start-0 border border-no-bank-grayscale-silver text-no-bank-grayscale-iron flex-fill py-2 text-center font-sm">MAX</div>
    </div>
  );
};

const mapToProps = ({}) => ({});
export default connect(mapToProps, actions)(ChartBottom);
