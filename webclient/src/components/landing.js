import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "redux-zero/react";

import actions from "../redux/actions";

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
        <div className="container-fluid">
          <div className="row my-5 p-3">
            <div className="col-md-6">
              <p className="display-4">
                R-Bank is your trusted partner and gateway to Decentralized
                Finance!
              </p>
              <p className="fs-4 text-r-bank-grayscale-iron">
                Secure, understandable and easy to use – R-Bank enables you to
                make educated financial investments in a world growing ever more
                complex.
              </p>
              <p className="text-black">Interested? Sign up now!</p>
              <Link to="/onboard">
                <button
                  className="btn btn-warning text-r-bank-primary rounded-pill fs-6 "
                  type="button"
                >
                  Onboard
                </button>
              </Link>
            </div>
            <div className="col-md-6">
              <img
                src="public/landing_mockup.svg"
                className="img-fluid w-100"
              />
            </div>
          </div>
          <div className="row p-3 bg-r-bank-grayscale-platin ">
            <div className="col h1 text-r-bank-primary text-center">
              Why R-Bank?
            </div>
            <div className="row">
              <div className="col-md-4 justify-content-center">
                <div className="row">
                  <img src="public/wallet_steffi.svg" className="w-25" />
                </div>
                <div className="row">
                  <p className="fs-3">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Ratione officia hic laboriosam similique accusamus
                    repudiandae?
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <img
                  src="public/compass_steffi.svg"
                  className="img-fluid w-25"
                />
                <p className="fs-3">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Ratione officia hic laboriosam similique accusamus
                  repudiandae?
                </p>
              </div>
              <div className="col-md-4">
                <img src="public/safe_steffi.svg" className="img-fluid w-25" />

                <p className="fs-3">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Ratione officia hic laboriosam similique accusamus
                  repudiandae?
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="footer mt-auto py-3 bg-r-bank-primary ">
          <div className="container-fluid d-flex align-items-center justify-content-between">
            <div>
              <Link to="/" className="navbar-brand m-0">
                <img
                  src="public/logo_R_white.svg"
                  alt=""
                  className="img-fluid m-1 h-75"
                />
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
                className="m-0 text-r-bank-grayscale-silver f-6"
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
