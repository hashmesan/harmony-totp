import React, { useState, useEffect, useContext } from "react";
import { connect } from "redux-zero/react";
import actions from "../../redux/actions";

const listFundingSources = ({ fundingSources }) => {
  return (
    <u1 className="list-group">
      {fundingSources.map((fundingSource) => {
        return (
          <li className="list-group-item border-start-0 border-end-0 px-0">
            <div className="d-flex align-items-center">
              <span className="text-no-bank-primary fw-bolder">
                {fundingSource.name}
              </span>
              <span
                className={`badge rounded-pill fw-light px-2 ms-2 ${
                  fundingSource.type == "bank account"
                    ? "bg-no-bank-secondary-lavendel text-no-bank-white"
                    : fundingSource.type == "crypto wallet"
                    ? "bg-no-bank-secondary-lemon text-no-bank-primary"
                    : "bg-no-bank-secondary-turquoise-green text-no-bank-white"
                }`}
              >
                {fundingSource.type}
              </span>
              <i className="bi bi-three-dots-vertical ms-auto text-no-bank-greyscale-iron"></i>
            </div>
          </li>
        );
      })}
    </u1>
  );
};

const mapToProps = ({ fundingSources }) => ({ fundingSources });
export default connect(mapToProps, actions)(listFundingSources);
