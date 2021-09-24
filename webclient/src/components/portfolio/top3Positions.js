import React, { useState, useEffect, useContext } from "react";
import { SmartVaultContext, SmartVaultConsumer } from "../smartvault_provider";
import { connect } from "redux-zero/react";
import actions from "../../redux/actions";
import { useHistory } from "react-router-dom";

import TokenCategory from "./tokenCategory";

const Top3Positions = (props) => {
  const history = useHistory();
  const handleRowClick = (address) => {
    history.push(`/token/${address}`);
  };

  return (
    <>
      <div className="d-flex align-items-center justify-content-between">
        <div className="fs-4 text-no-bank-grayscale-iron">Top 3 portofolio Positions</div>

        <i className="bi bi-arrow-up-right fs-5"></i>
      </div>

      <div style={{ height: 172 }}>
        <table className="table">
          <thead>
            <tr className="fw-normal font-sm text-no-bank-grayscale-iron">
              <th scope="col"></th>
              <th scope="col" className="fw-normal">
                Last
              </th>
              <th scope="col" className="fw-normal">
                24h Change
              </th>
              <th scope="col" className="fw-normal">
                Total volume
              </th>
            </tr>
          </thead>
          <tbody>
            {/* <tr className="pointer" onClick={() => handleRowClick("0x6983d1e6def3690c4d616b13597a09e6193ea013")}>
              <td>
                <div className="d-flex  align-items-center">
                  <span className="me-3">ONE</span>
                  <TokenCategory category={"coin"} />
                  <i className="bi bi-star-fill ms-3"></i>
                </div>
              </td>
              <td>
                <span className="text-no-bank-primary">2.19</span>
                <span className="ms-1 text-no-bank-grayscale-iron">CHF</span>
              </td>
              <td>
                <span className="text-success">+2.3%</span>
              </td>
              <td>
                <span className="text-no-bank-primary">4.3</span>
                <span className="ms-1 text-no-bank-grayscale-iron">bn</span>
                <span className="ms-1 text-no-bank-grayscale-iron">CHF</span>
              </td>
            </tr> */}

            <tr className="pointer" onClick={() => handleRowClick("0x0e80905676226159cc3ff62b1876c907c91f7395")}>
              <td>
                <div className="d-flex  align-items-center">
                  <span className="me-3">oneBUSD</span>
                  <TokenCategory category={"stablecoin"} />
                  <i className="bi bi-star-fill ms-3"></i>
                </div>
              </td>
              <td>
                <span className="text-no-bank-primary">0.92</span>
                <span className="ms-1 text-no-bank-grayscale-iron">CHF</span>
              </td>
              <td>
                <span className="text-danger">-0.003%</span>
              </td>
              <td>
                <span className="text-no-bank-primary">2.9</span>
                <span className="ms-1 text-no-bank-grayscale-iron">bn</span>
                <span className="ms-1 text-no-bank-grayscale-iron">CHF</span>
              </td>
            </tr>

            <tr className="pointer" onClick={() => handleRowClick("0x268d6ff391b41b36a13b1693bd25f87fb4e4b392")}>
              <td>
                <div className="d-flex  align-items-center">
                  <span className="me-3">1ETH</span>
                  <TokenCategory category={"token"} />
                  <i className="bi bi-star-fill ms-3"></i>
                </div>
              </td>
              <td>
                <span className="text-no-bank-primary">0.22</span>
                <span className="ms-1 text-no-bank-grayscale-iron">CHF</span>
              </td>
              <td>
                <span className="text-danger">-3.24%</span>
              </td>
              <td>
                <span className="text-no-bank-primary">1.2</span>
                <span className="ms-1 text-no-bank-grayscale-iron">bn</span>
                <span className="ms-1 text-no-bank-grayscale-iron">CHF</span>
              </td>
            </tr>

            <tr className="pointer" onClick={() => handleRowClick("0x6c4387c4f570aa8cadcaffc5e73ecb3d0f8fc593")}>
              <td>
                <div className="d-flex  align-items-center">
                  <span className="me-3">1WBTC</span>
                  <TokenCategory category={"coin"} />
                  <i className="bi bi-star-fill ms-3"></i>
                </div>
              </td>
              <td>
                <span className="text-no-bank-primary">41353</span>
                <span className="ms-1 text-no-bank-grayscale-iron">CHF</span>
              </td>
              <td>
                <span className="text-danger">-1.24%</span>
              </td>
              <td>
                <span className="text-no-bank-primary">1.2</span>
                <span className="ms-1 text-no-bank-grayscale-iron">bn</span>
                <span className="ms-1 text-no-bank-grayscale-iron">CHF</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

const mapToProps = ({}) => ({});
export default connect(mapToProps, actions)(Top3Positions);
