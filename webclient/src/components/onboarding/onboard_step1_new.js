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
          <div className="bg-white vh-100 p-3">
            <div className="container pt-5 pr-5 pb-3 pl-3">
              <div>
                <p className="text-secondary">STEP 1</p>
                <p className="h1">Account setup</p>
              </div>
              
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
                </div>

                <div className="row mb-3">
                  <label htmlFor="UserEmail" className="form-label mb-0 fw-bold">
                    Email
                  </label>
                  <div className=" align-items-start">
                    <input
                      type="email"
                      className={`form-control  ${
                        this.state.user.userEmail.length > 0
                          ? this.state.validity.userEmail
                            ? "is-valid"
                            : "is-invalid"
                          : ""
                      }`}
                      id="UserEmail"
                      placeholder="Please use a valid email address"
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

              </form>

              <button
                  role="submit"
                  className="btn bg-r-bank-blue text-light fs-4"
                  style={{ borderRadius: "2rem" }}
                  to="/landing"
                >
                  <span className="btn-label">Continue with Step 2 </span>
                  <i className="bi bi-caret-right"></i>
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
