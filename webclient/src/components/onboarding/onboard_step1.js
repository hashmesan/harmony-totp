import React, { Component } from "react";

import web3utils from "web3-utils";
import { CountryDropdown } from "react-country-region-selector";
import { connect } from "redux-zero/react";

import actions from "../../redux/actions";
import { SmartVaultContext } from "../smartvault_provider";

class Step1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
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

  componentDidMount() {
    this.checkValidity();
  }

  selectCountry = (value) => {
    const { user } = this.props;
    user.userCountryOfResidence = value;
    this.props.setUser(user);

    const { validity } = { ...this.state };
    const currentState = validity;
    currentState.userCountryOfResidence = true; //TODO: we use the id here because validity object has the same key names as user object

    this.setState({ validity: currentState });
    const { userName, userPassword, userEmail, userCountryOfResidence, form } =
      this.state.validity;

    if (userName && userPassword && userEmail && userCountryOfResidence) {
      const { validity } = { ...this.state };
      validity["form"] = true;
      this.setState({ validity: validity });
    }
  };

  checkRentPriceAsync = async () => {
    const { userName, userPassword, userEmail, userCountryOfResidence } =
      this.props.user;
    const { smartvault } = this.context;

    this.setState({ loading: true });

    try {
      const createdWallet = await smartvault.create(
        userName + ".crazy.one",
        null,
        null,
        null,
        userPassword,
        userEmail,
        userCountryOfResidence
      );

      const address = await smartvault.harmonyClient.ens
        .name(userName)
        .getAddress();

      const { wallet } = { ...this.state };
      console.log("address (should be 0x00.. if not existing: ", address);

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

  checkValidity = () => {
    const { validity } = { ...this.state };
    const currentValidity = validity;

    const { user } = this.props;

    const userNamePattern = /^([a-zA-Z0-9\-]+)$/;
    const passwordPattern = /^(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{7,}$/;
    const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    userNamePattern.test(user.userName) && user.userName.length > 7
      ? (currentValidity["userName"] = true)
      : (currentValidity["userName"] = false);

    passwordPattern.test(user.userPassword)
      ? (currentValidity["userPassword"] = true)
      : (currentValidity["userPassword"] = false);

    emailPattern.test(user.userEmail)
      ? (currentValidity["userEmail"] = true)
      : (currentValidity["userEmail"] = false);

    user.userCountryOfResidence
      ? (currentValidity["userCountryOfResidence"] = true)
      : (currentValidity["userCountryOfResidence"] = false);

    currentValidity.userName &&
    currentValidity.userPassword &&
    currentValidity.userEmail &&
    currentValidity.userCountryOfResidence
      ? (currentValidity["form"] = true)
      : (currentValidity["form"] = false);

    this.setState({ validity: currentValidity });

    currentValidity.form && this.checkRentPriceAsync();
  };

  handleChange = (evt) => {
    const { user } = this.props;
    const { id, value } = evt.target;
    user[id] = value;
    this.props.setUser(user);
  };

  //User form validity function
  handleBlur = (evt) => {
    const { id, value } = evt.target;

    //Form validity checks
    //Validity check for user name
    if (id == "userName") {
      const userNamePattern = /^([a-zA-Z0-9\-]+)$/; //one wallet can only have chars, numbers and - as a 1 special char

      const validityCheck = userNamePattern.test(value) && value.length > 7;

      const { validity } = { ...this.state };
      const currentState = validity;
      currentState[id] = validityCheck; //TODO: we use the id here because validity object has the same key names as user object

      this.setState({ validity: currentState });
      validityCheck && this.checkRentPriceAsync();
    }
    //Validity check for password
    else if (id == "userPassword") {
      const passwordPattern = /^(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{7,}$/;

      const validityCheck = passwordPattern.test(value);

      const { validity } = { ...this.state };
      const currentState = validity;
      currentState[id] = validityCheck; //TODO: we use the id here because validity object has the same key names as user object

      this.setState({ validity: currentState });
    }
    //Validity check for email
    else if (id == "userEmail") {
      const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

      const validityCheck = emailPattern.test(value);

      const { validity } = { ...this.state };
      const currentState = validity;
      currentState[id] = validityCheck;

      this.setState({ validity: currentState });
    }

    //Other validity check later on if needed
    else {
    }
    const { userName, userPassword, userEmail, userCountryOfResidence, form } =
      this.state.validity;

    if (userName && userPassword && userEmail && userCountryOfResidence) {
      const { validity } = { ...this.state };
      validity["form"] = true;
      this.setState({ validity: validity });
    }
  };

  handleClick = () => {
    const { userName, userPassword, userEmail, userCountryOfResidence } =
      this.state.validity;
    if (userName && userPassword && userEmail && userCountryOfResidence) {
      this.checkRentPriceAsync();
      this.props.setOnboardingStep(2);
    }
  };

  passwordShowHide = () => {
    var x = document.getElementById("userPassword");
    var show_eye = document.getElementById("show_eye");
    var hide_eye = document.getElementById("hide_eye");
    hide_eye.classList.remove("d-none");
    if (x.type === "password") {
      x.type = "text";
      show_eye.style.display = "none";
      hide_eye.style.display = "block";
    } else {
      x.type = "password";
      show_eye.style.display = "block";
      hide_eye.style.display = "none";
    }
  };

  render() {
    const { userName, userPassword, userEmail, userCountryOfResidence } =
      this.props.user;
    const { validity, wallet, loading } = this.state;
    const dropdownPriorityOptions = ["CH"];

    return (
      <div className="bg-white align-content-center border-top border-no-bank-grayscale-titanium justify-content-start pt-5 pe-5 ps-4 h-100">
        <div className="d-flex flex-column mb-5 ps-2 pt-3 pe-3">
          <div>
            <div className="fs-6 text-no-bank-grayscale-iron text-uppercase">
              Step 1
            </div>

            <div className="fs-1 text-no-bank-primary">Account setup</div>
          </div>

          <div className="pt-5">
            <form className="needs-validation d-grid gap-4" noValidate>
              <div className="form-group align-items-start mb-1">
                <label
                  htmlFor="userName"
                  className="form-label mb-0 text-no-bank-grayscale-iron"
                >
                  Username
                </label>
                <div className="d-flex align-items-center gap-2">
                  <input
                    type="text"
                    defaultValue={userName}
                    className={`form-control  ${
                      userName.length > 0
                        ? validity.userName && wallet.isAvailable
                          ? "" //"is-valid" -> Designer doesn't want green border if OK
                          : "is-invalid"
                        : ""
                    }`}
                    id="userName"
                    placeholder="Required"
                    onChange={this.handleChange}
                    onBlur={this.handleBlur}
                    required
                  />
                  <div>
                    {userName.length > 0 ? (
                      validity.userName && wallet.isAvailable ? (
                        <i className="bi bi-check-circle text-success fs-5"></i>
                      ) : (
                        <i className="bi bi-x-circle text-danger fs-5"></i>
                      )
                    ) : (
                      <i className="bi bi-question text-white fs-5"></i>
                    )}
                  </div>
                </div>
                <small
                  className={`form-text ${
                    userName.length > 0
                      ? validity.userName && wallet.isAvailable
                        ? "text-success"
                        : "text-danger"
                      : ""
                  }`}
                >
                  {userName.length > 0 &&
                    validity.userName &&
                    wallet.isAvailable &&
                    !loading && (
                      <div>
                        Username is available for{" "}
                        {web3utils.fromWei(wallet.rentPrice).split(".")[0]} ONE
                      </div>
                    )}
                  {userName.length > 0 &&
                    validity.userName &&
                    !wallet.isAvailable && (
                      <div>
                        Please choose another username - this one is already
                        taken
                      </div>
                    )}
                  {userName.length > 0 && !validity.userName && (
                    <div>
                      Please use at least 8 characters. They must be letters,
                      numbers or hyphen. First and last character can't be a
                      hyphen.
                    </div>
                  )}
                </small>
              </div>

              <div className="form-group has-feedback align-items-start mb-1">
                <label
                  htmlFor="userPassword"
                  className="form-label mb-0 text-no-bank-grayscale-iron"
                >
                  Password
                </label>
                <div className="d-flex align-items-center gap-2">
                  <div className="input-group input-group-seamless-append">
                    <input
                      type="password"
                      defaultValue={userPassword}
                      className={`form-control border-end-0 rounded-0 rounded-start ${
                        userPassword.length > 0
                          ? validity.userPassword
                            ? "" //"is-valid" -> Designer doesn't want green border if OK
                            : "is-invalid"
                          : ""
                      }`}
                      id="userPassword"
                      placeholder="Required"
                      onChange={this.handleChange}
                      onBlur={this.handleBlur}
                      required
                    />
                    <div className="input-group-append">
                      <span
                        className={`input-group-text bg-no-bank-white border-start-0 rounded-0 rounded-end ${
                          userPassword.length > 0
                            ? validity.userPassword
                              ? "" //"is-valid" -> Designer doesn't want green border if OK
                              : "border-danger"
                            : ""
                        }`}
                        onClick={this.passwordShowHide}
                      >
                        <i
                          className="bi bi-eye text-no-bank-black fs-5"
                          id="show_eye"
                        ></i>
                        <i
                          className="bi bi-eye-slash d-none text-no-bank-black fs-5"
                          id="hide_eye"
                        ></i>
                      </span>
                    </div>
                  </div>
                  <div>
                    {userPassword.length > 0 ? (
                      validity.userPassword ? (
                        <i className="bi bi-check-circle text-success fs-5"></i>
                      ) : (
                        <i className="bi bi-x-circle text-danger fs-5"></i>
                      )
                    ) : (
                      <i className="bi bi-question text-white fs-5"></i>
                    )}
                  </div>
                </div>
                <small
                  className={`form-text ${
                    userPassword.length > 0
                      ? validity.userPassword
                        ? "text-success"
                        : "text-danger"
                      : ""
                  }`}
                >
                  {userPassword.length > 0 && !validity.userPassword && (
                    <div>
                      Please use more than 6 characters, at least 1 capital
                      letter and 1 special character
                    </div>
                  )}
                </small>
              </div>

              <div className="form-group align-items-start mb-1">
                <label
                  htmlFor="userEmail"
                  className="form-label mb-0 text-no-bank-grayscale-iron"
                >
                  Email
                </label>
                <div className="d-flex align-items-center gap-2">
                  <input
                    type="email"
                    defaultValue={userEmail}
                    className={`form-control  ${
                      userEmail.length > 0
                        ? validity.userEmail
                          ? "" //"is-valid" -> Designer doesn't want green border if OK
                          : "is-invalid"
                        : ""
                    }`}
                    id="userEmail"
                    placeholder="Required"
                    onChange={this.handleChange}
                    onBlur={this.handleBlur}
                    required
                  />
                  <div>
                    {userEmail.length > 0 ? (
                      validity.userEmail ? (
                        <i className="bi bi-check-circle text-success fs-5"></i>
                      ) : (
                        <i className="bi bi-x-circle text-danger fs-5"></i>
                      )
                    ) : (
                      <i className="bi bi-question text-white fs-5"></i>
                    )}
                  </div>
                </div>
                <small
                  className={`form-text ${
                    userEmail.length > 0
                      ? validity.userEmail
                        ? "text-success"
                        : "text-danger"
                      : ""
                  }`}
                >
                  {userEmail.length > 0 && !validity.userEmail && (
                    <div>Please enter a valid email address</div>
                  )}
                </small>
              </div>

              <div className="form-group align-items-start mb-1">
                <label
                  htmlFor="UserResidence"
                  className="form-label mb-0 text-no-bank-grayscale-iron"
                >
                  Country of Residence
                </label>
                <div className="d-flex align-items-center gap-2">
                  <CountryDropdown
                    value={userCountryOfResidence}
                    priorityOptions={dropdownPriorityOptions}
                    onChange={this.selectCountry}
                    className={`w-100 form-select ${
                      userCountryOfResidence
                        ? "no-bank-primary"
                        : "text-no-bank-grayscale-iron"
                    }`}
                  />
                  <div>
                    {userCountryOfResidence ? (
                      <i className="bi bi-check-circle text-success fs-5"></i>
                    ) : (
                      <i className="bi bi-question text-white fs-5"></i>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="d-flex justify-content-end pe-5 pb-3 fixed-bottom">
          <div className="pe-3 pb-3">
            <button
              type="button"
              onClick={this.handleClick}
              className={`btn rounded-pill ${
                validity.form
                  ? "btn-no-bank-highlight text-rb-bank-primary"
                  : "btn-no-bank-grayscale-silver text-white"
              }`}
              disabled={!validity.form && "disabled"}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }
}

Step1.contextType = SmartVaultContext;

const mapToProps = ({ onboardingStep, user }) => ({ onboardingStep, user });
export default connect(mapToProps, actions)(Step1);
