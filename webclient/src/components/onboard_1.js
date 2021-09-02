import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
const web3utils = require("web3-utils");
import { connect } from "redux-zero/react";
import { CountryDropdown } from "react-country-region-selector";

import actions from "../redux/actions";
import { SmartVaultContext, SmartVaultConsumer } from "./smartvault_provider";
class Onboarding1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        userName: "",
        userPassword: "",
        userEmail: "",
        userCountryOfResidence: "",
      },
      validity: {
        userName: true,
        userPassword: true,
        userEmail: true,
        userCountryOfResidence: true,
      },
      priorityOptions: ["CH"],
    };
  }

  selectCountry = (value) => {
    const { user } = { ...this.state };
    const currentState = user;

    currentState.userCountryOfResidence = value;

    this.setState({ user: currentState });
  };

  checkRentPrice = () => {
    console.log("checking price: ");
    this.context.smartvault
      .create(
        this.state.name + ".crazy.one",
        null,
        web3utils.toWei(this.state.dailyLimit + ""),
        this.state.drainAddress,
        this.state.password,
        this.state.email,
        this.state.countryOfResidence
      )
      .then((res) => {
        if (res == null) {
          self.setState({ error: "Already exists!" });
        } else {
          self.setState({
            cost: self.context.smartvault.walletData.rentPrice,
            showCost: true,
            error: null,
          });
        }
        self.setState({ busy: false });
      })
      .catch((ex) => {
        self.setState({ error: ex.message });
        self.setState({ busy: false });
      });
  };

  handleChange = (evt) => {
    const { user } = { ...this.state };
    const currentState = user;

    const { id, value } = evt.target;

    currentState[id] = value;

    this.setState({ user: currentState });

    switch (id) {
      case "userName":
        const nameRegex = /^[a-zA-Z\-]+$/;
        const userName = value;

        const validityCheck = nameRegex.exec(userName) && userName.length > 7;

        const { validity } = { ...this.state };
        const currentState = validity;
        currentState.userName = validityCheck;

        // TODO: Check for "existence of HNS"
        const rentPrice = this.checkRentPrice();

        this.setState({ validity: currentState });

      // TODO: Add validity check for PW
      case "userPassword":

      // TODO: Add validity check for Email
      case "userEmail":

      default:
    }
  };

  render() {
    const { userCountryOfResidence } = this.state.user;

    return (
      <SmartVaultConsumer>
        {({ smartvault }) => (
          <div className="container-fluid p-0">
            <div className="text-dark text-start align-items-stretch">
              <div className="d-flex align-items-stretch justify-content-between">
                <div className="col-8 p-3 bg-white">
                  <div className="ms-5">
                    <div>
                      <p className="text-secondary">STEP 1:</p>
                      <p className="h3 mb-5">Sign up to the R Bank</p>
                      <p className="fs-6 fw-bold">Hi there,</p>
                      <p>
                        Thanks for deciding to open an account with R-Bank! Let
                        us quickly tell you how the onboarding works:
                      </p>
                      <p>
                        <span className="fs-6 fw-bold">Step 1: </span>
                        <span className="fs-6">
                          You provide the essential information in order to open
                          your account. We collect nothing that does not provide
                          value to you. If you like to understand why you
                          provide what information just follow the explanations.{" "}
                        </span>
                      </p>
                      <p>
                        <span className="fs-6 fw-bold">Step 2: </span>
                        <span className="fs-6">
                          If you like you can add additional security features
                          to your account. This is by no means required but we
                          warmly recommend it. Better safe than sorry is more
                          relevant now than ever!
                        </span>
                      </p>
                      <p>
                        So that's enough talking - let's head over to the
                        onboarding.
                      </p>
                    </div>
                    <hr />
                    <form className="mt-2 needs-validation" noValidate>
                      <div className="row mb-3">
                        <div className="row">
                          <div className="col">
                            <label
                              htmlFor="userName"
                              className="form-label mb-0 fw-bold"
                            >
                              Username
                            </label>
                          </div>
                        </div>
                        <div className="row align-items-start">
                          <div className="col-md-7">
                            <input
                              type="text"
                              className={`form-control  ${
                                this.state.validity.userName ? "" : "is-invalid"
                              }`}
                              id="userName"
                              placeholder="Please use at least 8 characters"
                              onChange={this.handleChange}
                              required
                            />
                            <div className="invalid-feedback">
                              Please use at least 8 characters, no numbers, no
                              special characters
                            </div>
                          </div>

                          <div className="col-md-5">
                            <p className="text-success fst-italic lh-1 fw-lighter mt-1 mt-md-0">
                              You can choose a username to conveniently log into
                              the R Bank platform. It also enables you to find
                              and be found by your friends.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="row">
                          <div className="col">
                            <label
                              htmlFor="userPassword"
                              className="form-label mb-0 fw-bold"
                            >
                              Password
                            </label>
                          </div>
                        </div>
                        <div className="row align-items start">
                          <div className="col-md-7">
                            <input
                              type="password"
                              className="form-control is-invalid"
                              id="userPassword"
                              placeholder="Please use more than 6 characters, 1 capital letter, 1 special character"
                              onChange={this.handleChange}
                              required
                            />
                            <div className="invalid-feedback">
                              Please use at least 8 characters, no numbers, no
                              special characters
                            </div>
                          </div>

                          <div className="col-md-5">
                            <p className="text-success fst-italic lh-1 fw-ligher mt-1 mt-md-0">
                              Secure your account with a password! Remember to
                              make it unique and use special characters.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="row">
                          <div className="col">
                            <label
                              htmlFor="UserEmail"
                              className="form-label mb-0 fw-bold"
                            >
                              Email
                            </label>
                          </div>
                        </div>
                        <div className="row align-items-start">
                          <div className="col-md-7">
                            <input
                              type="email"
                              className="form-control"
                              id="UserEmail"
                              placeholder="Please use a valid email address"
                              onChange={this.handleChange}
                              required
                            />
                          </div>
                          <div className="col-md-5">
                            <p className="text-success fst-italic lh-1 fw-lighter mt-1 mt-md-0">
                              With e-mail you'll be able to reset your account
                              details and retreive a forgotten password.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="row">
                          <div className="col">
                            <label
                              htmlFor="UserResidence"
                              className="form-label mb-0 fw-bold"
                            >
                              Country of Residence
                            </label>
                          </div>
                        </div>
                        <div className="row algin-items start">
                          <div className="col-md-7">
                            <CountryDropdown
                              value={userCountryOfResidence}
                              priorityOptions={this.state.priorityOptions}
                              onChange={this.selectCountry}
                              className="w-100 form-select"
                            />
                          </div>
                          <div className="col-md-5">
                            <p className="text-success fst-italic lh-1 fw-lighter mt-1 mt-md-0">
                              Depending on your location you are eligible for
                              different services - it's the law :/
                            </p>
                          </div>
                        </div>
                      </div>
                      <Link
                        role="submit"
                        className="btn bg-r-bank-blue text-light fs-4"
                        style={{ borderRadius: "2rem" }}
                        to="/landing"
                      >
                        <span className="btn-label">Continue with Step 2 </span>
                        <i className="bi bi-caret-right"></i>
                      </Link>
                    </form>
                  </div>
                </div>

                <div className="col-4">
                  <div className="d-flex bg-gray-400 vh-100 align-content-center justify-content-center">
                    <img
                      src="undraw_app_data_re.svg"
                      alt=""
                      className="img-fluid w-75"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </SmartVaultConsumer>
    );
  }
}

Onboarding1.contextType = SmartVaultContext;

const mapToProps = ({ environment }) => ({ environment });
export default connect(mapToProps, actions)(withRouter(Onboarding1));
