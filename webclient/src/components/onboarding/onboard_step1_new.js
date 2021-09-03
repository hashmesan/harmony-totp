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

  handleBlur = (evt) => {
    const { user } = { ...this.state };
    const currentState = user;

    const { id, value } = evt.target;

    currentState[id] = value;

    this.setState({ user: currentState });

    switch (id) {
      case "userName":
        const nameRegex =
          /^([a-zA-Z0-9\u0600-\u06FF\u0660-\u0669\u06F0-\u06F9 _.-]+)$/;

        const userName = value;

        const validityCheck = nameRegex.exec(userName) && userName.length > 7;

        const { validity } = { ...this.state };
        const currentState = validity;
        currentState[id] = validityCheck;

        this.setState({ validity: currentState });

      // TODO: Add validity check for PW
      case "userPassword":

      // TODO: Add validity check for Email
      case "userEmail":

      default:
    }

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
          <div className="bg-white vh-100 p-2">
            <form className="needs-validation" noValidate>
              <div className="row mb-3">
                <label htmlFor="userName" className="form-label mb-0 fw-bold">
                  Username
                </label>
                <div className=" align-items-start">
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
                    onChange={this.handleChange}
                    onBlur={this.handleBlur}
                    required
                  />
                  <div className="invalid-feedback">
                    {this.state.validity.userName
                      ? ""
                      : "Please use at least 8 characters and no special characters. "}
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
              </div>

              <div className="row mb-3">
                <label
                  htmlFor="userPassword"
                  className="form-label mb-0 fw-bold"
                >
                  Password
                </label>
                <div className=" align-items start">
                  <input
                    type="password"
                    className="form-control is-invalid"
                    id="userPassword"
                    placeholder="Please use more than 6 characters, 1 capital letter, 1 special character"
                    onChange={this.handleChange}
                    required
                  />
                  <div className="invalid-feedback">Please provide XYZ</div>
                </div>
              </div>

              <div className="row mb-3">
                <label htmlFor="UserEmail" className="form-label mb-0 fw-bold">
                  Email
                </label>
                <div className=" align-items-start">
                  <input
                    type="email"
                    className="form-control"
                    id="UserEmail"
                    placeholder="Please use a valid email address"
                    onChange={this.handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row mb-3">
                <label
                  htmlFor="UserResidence"
                  className="form-label mb-0 fw-bold"
                >
                  Country of Residence
                </label>
                <div className=" algin-items start">
                  <CountryDropdown
                    value={userCountryOfResidence}
                    priorityOptions={dropdownPriorityOptions}
                    onChange={this.selectCountry}
                    className="w-100 form-select"
                  />
                </div>
              </div>

              <button
                role="submit"
                className="btn bg-r-bank-blue text-light fs-4"
                style={{ borderRadius: "2rem" }}
                to="/landing"
              >
                <span className="btn-label">Continue with Step 2 </span>
                <i className="bi bi-caret-right"></i>
              </button>
            </form>
          </div>
        )}
      </SmartVaultConsumer>
    );
  }
}

Step1.contextType = SmartVaultContext;

const mapToProps = ({ onboardingStep }) => ({ onboardingStep });
export default connect(mapToProps, actions)(Step1);
