import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "redux-zero/react";
import styled from "@emotion/styled";

import actions from "../redux/actions";

import LandingMockup from "../../public/landing_mockup.svg";
import WalletSteffi from "../../public/wallet_steffi.svg";
import CompassSteffi from "../../public/compass_steffi.svg";
import SafeSteffi from "../../public/safe_steffi.svg";
import LogoWhite from "../../public/logo_no_white.svg";

class Landing extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.setLocation("landing");
  }

  render() {
    return (
      <div>
        <div className="container-fluid pe-0">
          <div className="row my-5">
            <div className="col-md-6">
              <p className="display-4">
                nobank is your trusted partner and gateway to Decentralized
                Finance!
              </p>
              <p className="fs-4 text-no-bank-grayscale-iron">
                Secure, understandable and easy to use – nobank enables you to
                make educated financial investments in a world growing ever more
                complex.
              </p>
              <p className="text-black">Interested? Sign up now!</p>
              <Link to="/onboard">
                <button
                  className="btn btn-no-bank-highlight text-no-bank-primary rounded-pill fs-6 "
                  type="button"
                >
                  Onboard
                </button>
              </Link>
            </div>
            <div className="col-md-6">
              <img src={LandingMockup} className="img-fluid w-100" />
            </div>
          </div>
          <div className="row p-3 bg-no-bank-grayscale-platin ">
            <div className="row justify-content-center">
              <div className="col h1 text-no-bank-primary text-center">
                Why nobank?
              </div>
            </div>
            <div className="row py-3">
              <div className="col-md-4 px-3 pt-5">
                <div className="card bg-no-bank-grayscale-platin border-0">
                  <img
                    src={WalletSteffi}
                    className="card-img-top thumbnail image-fluid mx-auto"
                    style={{ maxHeight: "80px" }}
                    alt="..."
                  />
                  <div className="card-body mt-3">
                    <p className="card-text text-center fs-6">
                      <span className="fw-bold">
                        nobank offers you a bullet proof smart wallet,
                      </span>
                      with advanced safety features natively available e.g.
                      wallet recovery or locking in case of an emergency.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 px-3 pt-5">
                <div className="card bg-no-bank-grayscale-platin border-0">
                  <img
                    src={CompassSteffi}
                    className="card-img-top  mx-auto"
                    style={{ maxHeight: "80px" }}
                    alt="..."
                  />
                  <div className="card-body mt-3">
                    <p className="card-text text-center fs-6">
                      <span className="fw-bold">
                        nobank takes you by the hand and guides you through the
                        complex world of crypto investments.{" "}
                      </span>
                      We offer comprehensive product descriptions and highlight
                      chances and risks. If you are interested to deepen your
                      understanding, we’re at your service.{" "}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 px-3 pt-5">
                <div className="card bg-no-bank-grayscale-platin border-0">
                  <img
                    src={SafeSteffi}
                    className="card-img-top mx-auto"
                    style={{ maxHeight: "80px" }}
                    alt="..."
                  />
                  <div className="card-body mt-3">
                    <p className="card-text text-center fs-6">
                      <span className="fw-bold">
                        nobank offers you a bullet proof smart wallet,
                      </span>
                      with advanced safety features natively available e.g.
                      wallet recovery or locking in case of an emergency.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer mt-auto py-3 bg-no-bank-primary ">
          <div className="container-fluid d-flex align-items-center justify-content-between">
            <div>
              <Link to="/" className="navbar-brand m-0">
                <img src={LogoWhite} alt="" className="img-fluid m-1 h-75" />
              </Link>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <Link to="/" className="text-white fs-6 px-3">
                Home
              </Link>
              <Link to="/" className="text-white fs-6 px-3">
                Features
              </Link>

              <Link to="/" className="text-white fs-6 px-3">
                Pricing
              </Link>

              <Link to="/" className="text-white fs-6 px-3">
                About
              </Link>
            </div>
            <div>
              <Link
                to="/impressum"
                className="m-0 text-no-bank-grayscale-silver f-6"
              >
                impressum
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapToProps = ({ location }) => ({
  location,
});
export default connect(mapToProps, actions)(Landing);
