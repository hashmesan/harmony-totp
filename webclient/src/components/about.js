import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "redux-zero/react";
import { getAnalytics, logEvent } from "firebase/analytics";
import actions from "../redux/actions";

import SpaceX from "../../public/about_spacex.svg";
import LogoWhite from "../../public/logo_no_white.svg";

const About = ({ setLocation }) => {
  const analytics = getAnalytics();

  useEffect(() => {
    setLocation("about");
    logEvent(analytics, "About");
  }, []);

  return (
    <div>
      <div className="container-fluid ps-0 pe-0">
        <img src={SpaceX} className="img-fluid w-100" />
        <div className="d-flex p-5">
          <div className="row p-4">
            <h1 className="text-no-bank-primary fw-bolder py-0 pt-5 pb-5 m-0">
              About
            </h1>
            <p className="fs-3 text-no-bank-grayscale-iron py-0 mb-4">
              In 2021, a time of low to negative interest rates, risk-averse
              investors are struggling to find simple but steady investment
              opportunities or even organizations to safely place their money.
              The traditional savings account does no longer yield any interest
              and leaves many retail investors with little to no alternatives
              due to a lack of knowledge and access to other investment
              opportunities.
            </p>
            <p className="fs-3 text-no-bank-grayscale-iron py-0 mb-4">
              At the same time, a vibrant crypto environment with centralized as
              well as decentralized service providers offers opportunities to
              fill this void – if only presented and marketed in the simplest
              possible way and built in the most reliable way.
            </p>
            <h1 className="fw-bolder py-0 mt-4 mt-5 mb-5">
              <u>no</u>bank aims to bring back your traditional savings account
              with steady interest, but in the decentralized crypto world. Built
              around a truly simplified user experience and step by step
              explanations of transactions and mechanisms, customers will be
              able to:
            </h1>
            <div className="d-flex flex-row align-items-center p-0 mt-4 mb-4 bg-no-bank-grayscale-platin">
              <div className="p-4" style={{ fontSize: "80px" }}>
                1
              </div>
              <div className="fs-3">
                Buy crypto assets such as stablecoins (USDC), coins (Bitcoin),
                and tokens (ETH) via Credit Card.
              </div>
            </div>
            <div className="d-flex flex-row align-items-center p-0 mb-4 bg-no-bank-grayscale-platin">
              <div className="p-4" style={{ fontSize: "80px" }}>
                2
              </div>
              <div className="fs-3">
                Transfer existing crypto assets from other platforms to the
                Renaissance Bank
              </div>
            </div>
            <div className="d-flex flex-row align-items-center p-0 mb-4 bg-no-bank-grayscale-platin">
              <div className="p-4" style={{ fontSize: "80px" }}>
                3
              </div>
              <div className="fs-3">
                Lock-in your crypto assets to gain up to 10% interest on them
                through different protocols built or supported by the
                Renaissance Bank acting as a Savings Account: Saving through
                Lending, Saving through Staking or Saving through simple
                structured products
              </div>
            </div>

            <h1 className="fw-bolder py-0 mt-5 mb-5">
              <u>no</u>bank offers Self Custody of assets by the customers
              through Smart Wallets and as such does not act as a safe-keeper
              but as a service provider.
            </h1>

            <div className="row align-items-center p-0 mt-4 mb-5 gap-4">
              <div className="fs-3 col align-self-stretch p-4 bg-no-bank-grayscale-platin">
                The customer retains full ownership of the assets, forever, in
                any event (e.g., regulatory changes, bankruptcy, etc.) as they
                are safely stored on the blockchain – protected by the
                underlying cryptography.
              </div>
              <div className="fs-3 col align-self-stretch p-4 bg-no-bank-grayscale-platin">
                The customer has full account management functionalities at hand
                and can recover his cryptic keys, add spend limits, limit target
                addresses, etc.
              </div>
            </div>

            <p className="fs-3 text-no-bank-grayscale-iron py-0 mt-4 mb-0">
              Traditional banks have left many retail investors no choice but to
              accept 0% interest on a savings account or to expose themselves to
              an unpredictable stock market. <u>no</u>bank will bring long-term
              investing back with risk-averse products for crypto-interested
              investors: Simple, safe, fair.
            </p>
          </div>
        </div>
        <div className="bg-no-bank-highlight">
          <h1 className="p-5 mb-5 fw-bolder">
            Our vision is to provide traditional banking services in a
            decentralized financial world at almost no cost to customers –
            giving access to yield where access is traditionally blocked. The
            savings account is the starting point of an ever-expanding product
            portfolio.
          </h1>
        </div>
        <div className="p-4"></div>
      </div>
      <div className="footer mt-auto py-3 bg-no-bank-primary ">
        <div className="container-fluid d-flex align-items-center justify-content-between">
          <div>
            <Link to="/" className="navbar-brand m-0">
              <img src={LogoWhite} alt="" className="img-fluid m-1 h-75" />
            </Link>
          </div>
          <div className="d-flex align-items-center justify-content-between">
            <Link to="/" className="text-white text-decoration-none fs-6 px-3 ">
              Home
            </Link>
            <Link to="/" className="text-white text-decoration-none fs-6 px-3">
              Features
            </Link>

            <Link to="/" className="text-white text-decoration-none fs-6 px-3">
              Pricing
            </Link>

            <Link
              to="/about"
              className="text-white text-decoration-none fs-6 px-3"
            >
              About
            </Link>
          </div>
          <div>
            <Link
              to="/impressum"
              className="m-0 text-no-bank-grayscale-silver text-decoration-none f-6"
            >
              impressum
            </Link>
            <i className="bi bi-twitter text-white mx-2"></i>
            <i className="bi bi-linkedin text-white mx-2"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapToProps = ({ location }) => ({ location });
export default connect(mapToProps, actions)(About);
