import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
const web3utils = require("web3-utils");
import { connect } from "redux-zero/react";
import { CountryDropdown } from "react-country-region-selector";

import actions from "../../redux/actions";
import { SmartVaultContext, SmartVaultConsumer } from "../smartvault_provider";

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
        userName: null,
        userPassword: null,
        userEmail: null,
        userCountryOfResidence: null,
        form: false,
      },
      wallet: {
        isAvailable: true,
        rentPrice: "0",
        loading: false,
        error: "",
      },
      loading: null,
    };
  }

  selectCountry = (value) => {
    const { user } = { ...this.state };
    const currentState = user;

    currentState.userCountryOfResidence = value;

    this.setState({ user: currentState });
  };

  checkRentPriceAsync = async () => {
    const { user } = this.state;
    const { smartvault } = this.context;

    this.setState({ loading: true });

    try {
      const createdWallet = await smartvault.create(
        user.userName + ".crazy.one",
        null,
        null,
        null,
        this.state.password,
        this.state.email,
        this.state.countryOfResidence
      );

      const { wallet } = { ...this.state };

      if (createdWallet === null) {
        wallet.isAvailable = false;
        wallet.error = "Address / wallet already existing";
        this.setState({ wallet: wallet, loading: false });
      } else {
        wallet.isAvailable = true;
        wallet.error = "";
        wallet.rentPrice = createdWallet.rentPrice;

        this.setState({ wallet: wallet, loading: false });
      }
    } catch (e) {
      console.error("Error in creating smart wallet: ", e.message);
    }
  };

  //User form validity function
  handleBlur = (evt) => {
    //Get user-object property from state object before event
    const { user } = { ...this.state };
    const currentState = user;
    
    //Set user state after event
    const { id, value } = evt.target;
    currentState[id] = value;
    this.setState({user: currentState});

    //Validity checks
    //Validity check for user name
    if (id=="userName"){
      const userNamePattern =
      /^([a-zA-Z0-9\-]+)$/; //one wallet can only have chars, numbers and - as a 1 special char
  
      const validityCheck = userNamePattern.exec(value) && value.length > 7;

      const { validity } = { ...this.state };
      const currentState = validity;
      currentState[id] = validityCheck;  //TODO: we use the id here because validity object has the same key names as user object

    this.setState({ validity: currentState });
    }
    //Validity check for password
    else if (id=="userPassword"){
      const passwordPattern = 
      /^(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{7,}$/;

      const validityCheck = passwordPattern.exec(value);

      const { validity } = { ...this.state };
      const currentState = validity;
      currentState[id] = validityCheck;  //TODO: we use the id here because validity object has the same key names as user object

      this.setState({ validity: currentState });
    }
    else if (id=="userEmail"){
      const emailPattern = 
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      
      /*
      RFC 2822 standard email validation
       /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|
\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|
\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:
(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
      */

      const validityCheck = emailPattern.exec(value);

      const { validity } = { ...this.state };
      const currentState = validity;
      currentState[id] = validityCheck;  //TODO: we use the id here because validity object has the same key names as user object

      this.setState({ validity: currentState });
    }

    //Other validity check later on if needed
    else{}

    this.checkRentPriceAsync();
    this.checkForm();
  };

  checkForm = () => {
    const { user, validity } = this.state;
    validity.form =
      user.userName.length *
        user.userPassword.length *
        user.userEmail.length *
        user.userCountryOfResidence.length >
      0
        ? true
        : false;
    this.setState({ validity: validity });
  };

  handleSubmit = () => {
    /*
    for element in this.state.user
      create evt object
        this.handleBlur(evt)
    */
  };

  render() {
    const { userCountryOfResidence } = this.state.user;
    const dropdownPriorityOptions = ["CH"];

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
                                this.state.user.userName.length > 0
                                  ? this.state.validity.userName &&
                                    this.state.wallet.isAvailable
                                    ? "is-valid"
                                    : "is-invalid"
                                  : ""
                              }`}
                              id="userName"
                              placeholder="Please use at least 8 characters"
                              onBlur={this.handleBlur}
                              required
                            />
                            <div className="invalid-feedback">
                              {this.state.validity.userName
                                ? ""
                                : "Please use only letters, numeric digits and hyphen. First and last character can't be a hyphen."}
                              {this.state.wallet.isAvailable
                                ? ""
                                : "Please choose another username! This one is already taken."}
                            </div>
                            {!this.state.loading && (
                              <div className="valid-feedback">
                                Username is valid and available for{" "}
                                {
                                  web3utils
                                    .fromWei(this.state.wallet.rentPrice)
                                    .split(".")[0]
                                }{" "}
                                ONE
                              </div>
                            )}
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
                              className={`form-control  ${
                                this.state.user.userPassword.length > 0
                                  ? this.state.validity.userPassword
                                    ? "is-valid"
                                    : "is-invalid"
                                  : ""
                              }`}
                              id="userPassword"
                              placeholder="Please use more than 6 characters and at least 1 capital letter and 1 special character"
                              onBlur={this.handleBlur}
                              required
                            />
                            <div className="invalid-feedback">
                              {this.state.validity.userPassword
                                ? ""
                                : "Invalid password! Please use more than 6 characters, at least 1 capital letter and 1 special character."}
                            </div>
                            <div className="valid-feedback">
                                Password is valid.
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
                              className={`form-control  ${
                                this.state.user.userEmail.length > 0
                                  ? this.state.validity.userEmail
                                    ? "is-valid"
                                    : "is-invalid"
                                  : ""
                              }`}
                              id="userEmail"
                              placeholder="Please enter a valid email address"
                              onBlur={this.handleBlur}
                              required
                            />
                            <div className="invalid-feedback">
                              {this.state.validity.userEmail
                                ? ""
                                : "Please enter a valid email address."}
                            </div>
                            <div className="valid-feedback">
                                Email is valid.
                            </div>
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
                              priorityOptions={dropdownPriorityOptions}
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
                      src="public/undraw_app_data_re.svg"
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
