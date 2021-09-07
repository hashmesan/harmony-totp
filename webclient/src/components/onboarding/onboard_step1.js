import React, { Component } from "react";

import { connect } from "redux-zero/react";
import web3utils from "web3-utils";
import { CountryDropdown } from "react-country-region-selector";

import actions from "../../redux/actions";
import { SmartVaultContext, SmartVaultConsumer } from "../smartvault_provider";

class Step1 extends Component {
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
    this.setState({
      validity: { ...this.state.validity, userCountryOfResidence: true },
    });
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
    this.setState({ user: currentState });

    //Form validity checks
    //Validity check for user name
    if (id == "userName") {
      const userNamePattern = /^([a-zA-Z0-9\-]+)$/; //one wallet can only have chars, numbers and - as a 1 special char

      const validityCheck = userNamePattern.exec(value) && value.length > 7;

      const { validity } = { ...this.state };
      const currentState = validity;
      currentState[id] = validityCheck; //TODO: we use the id here because validity object has the same key names as user object

      this.setState({ validity: currentState });
    }
    //Validity check for password
    else if (id == "userPassword") {
      const passwordPattern = /^(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{7,}$/;

      const validityCheck = passwordPattern.exec(value);

      const { validity } = { ...this.state };
      const currentState = validity;
      currentState[id] = validityCheck; //TODO: we use the id here because validity object has the same key names as user object

      this.setState({ validity: currentState });
    }
    //Validity check for email
    else if (id == "userEmail") {
      const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

      const validityCheck = emailPattern.exec(value);

      const { validity } = { ...this.state };
      const currentState = validity;
      currentState[id] = validityCheck; //TODO: we use the id here because validity object has the same key names as user object

      this.setState({ validity: currentState });
    }

    //Other validity check later on if needed
    else {
    }

    id == "userName" ? this.checkRentPriceAsync() : "";
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

  handleClick = () => {
    // TODO: Check if all values valid
    const { user } = this.state;
    this.props.setUser(user);
    this.props.setOnboardingStep(2);
  };

  render() {
    const { userCountryOfResidence } = this.state.user;
    const dropdownPriorityOptions = ["CH"];

    return (
      <SmartVaultConsumer>
        {({ smartvault }) => (
          <div className="bg-white align-content-center border-top border-r-bank-grayscale-titanium justify-content-start p-5 vh-100">
            <div className="d-flex flex-column mb-5 pe-3">
              <div>
                <div className="fs-6 text-r-bank-grayscale-iron text-uppercase">Step 1</div>
                <div className="fs-1 text-r-bank-primary">Account setup</div>
              </div>
              <div className="pt-5">
                <form className="needs-validation d-grid gap-4" noValidate>
                  <div className="row mb-1">
                    <label
                      htmlFor="userName"
                      className="form-label mb-0 text-r-bank-grayscale-iron"
                    >
                      Username
                    </label>
                    <div className="d-flex">
                      <div className="col align-items-start">
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
                            : "Please choose another username - this one is already taken"}
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
                      <div className="col-1 text-center pt-1">
                        {this.state.user.userName.length > 0 ? (
                          this.state.validity.userName &&
                          this.state.wallet.isAvailable ? (
                            <i className="bi bi-check-circle text-success fs-5"></i>
                          ) : (
                            <i className="bi bi-x-circle text-danger fs-5"></i>
                          )
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="row mb-1">
                    <label
                      htmlFor="userPassword"
                      className="form-label mb-0 text-r-bank-grayscale-iron"
                    >
                      Password
                    </label>
                    <div className="row">
                      <div className="col align-items start">
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
                            : "Please use more than 6 characters, at least 1 capital letter and 1 special character"}
                        </div>
                      </div>
                      <div className="col-1 text-center pt-1">
                        {this.state.user.userPassword.length > 0 ? (
                          this.state.validity.userPassword ? (
                            <i className="bi bi-check-circle text-success fs-5"></i>
                          ) : (
                            <i className="bi bi-x-circle text-danger fs-5"></i>
                          )
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="row mb-1">
                    <label
                      htmlFor="userEmail"
                      className="form-label mb-0 text-r-bank-grayscale-iron"
                    >
                      Email
                    </label>
                    <div className="row">
                      <div className="col align-items-start">
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
                          placeholder="Please use a valid email address"
                          onBlur={this.handleBlur}
                          required
                        />
                        <div className="invalid-feedback text-warning">
                          {this.state.validity.userEmail
                            ? ""
                            : "Please enter a valid email address."}
                        </div>
                      </div>
                      <div className="col-1 text-center pt-1">
                        {this.state.user.userEmail.length > 0
                          ? this.state.validity.userEmail
                            ? <i className="bi bi-check-circle text-success fs-5"></i> 
                            : <i className="bi bi-x-circle text-warning fs-5"></i>
                          : ""
                          }
                      </div>
                    </div>
                  </div>

                  <div className="row mb-1">
                    <label
                      htmlFor="UserResidence"
                      className="form-label mb-0 text-r-bank-grayscale-iron"
                    >
                      Country of Residence
                    </label>
                    <div className="row">
                      <div className="col algin-items start">
                        <CountryDropdown
                          value={userCountryOfResidence}
                          priorityOptions={dropdownPriorityOptions}
                          onChange={this.selectCountry}
                          className={`w-100 form-select ${this.state.user.userCountryOfResidence ? "r-bank-primary": "text-r-bank-grayscale-iron"}`}
                        />
                      </div>
                      <div className="col-1 text-center pt-1">
                        {
                          this.state.user.userCountryOfResidence ? (
                            <i className="bi bi-check-circle text-success fs-5"></i>
                          ) : (
                            ""
                          ) //<i className="bi bi-x-circle text-danger fs-5"></i>
                        }
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="d-flex justify-content-end pe-3 fixed-bottom">
              <button
                type="button"
                onClick={this.handleClick}
                className="btn btn-r-bank-grayscale-silver text-white rounded-pill"
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </SmartVaultConsumer>
    );
  }
}

Step1.contextType = SmartVaultContext;

const mapToProps = ({ onboardingStep }) => ({ onboardingStep });
export default connect(mapToProps, actions)(Step1);
