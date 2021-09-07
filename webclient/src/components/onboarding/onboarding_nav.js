import React, { Component } from "react";

import { connect } from "redux-zero/react";
import actions from "../../redux/actions";
import styled from "@emotion/styled";

const Number = styled.div((props) => ({
  width: "2em",
  height: "2em",
  boxSizing: "initial",

  background: props.filled ? "#06232D" : "#efefee",
  border: props.filled ? "0.1em solid #06232D" : "0.1em solid #92918f",
  color: props.filled ? "#fff" : "#92918f",
  textAlign: "center",
  borderRadius: "50%",

  lineHeight: "2em",
  boxSizing: "content-box",

  marginRight: "2em",
}));

class OnboardNav extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { onboardingStep } = this.props;

    return (
      <React.Fragment>
        <div className="bg-r-bank-grayscale-platin border border-r-bank-grayscale-titanium align-content-center justify-content-start p-5 vh-100">
          <div className="d-flex flex-column ps-3">
            <div>
              <div className="fs-6 text-r-bank-grayscale-iron text-uppercase">
                pen an account
              </div>

              <div className="fs-1 text-r-bank-grayscale-iron">
                How it works
              </div>
            </div>
            <div className="pt-5">
              <div className="d-flex align-items-start">
                <Number
                  filled={onboardingStep == 1 && "filled"}
                  className="fs-6 flex-shrink-0"
                >
                  1
                </Number>
                <div className="d-flex align-items-start flex-column">
                  <span
                    className={
                      onboardingStep !== 1
                        ? "text-r-bank-grayscale-iron"
                        : "fw-bold"
                    }
                  >
                    Account setup
                  </span>
                  {onboardingStep == 1 && (
                    <div>
                      <p className="my-1">
                        We need your <span className="fw-bold">email</span>{" "}
                        adress to verify your account as well as for recovery.
                      </p>
                      <p className="my-1">
                        Depending on your{" "}
                        <span className="fw-bold">location</span> you are
                        eligible for different services – it's the law :/
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <hr />
              <div className="d-flex align-items-start py-2">
                <Number
                  filled={onboardingStep == 2 && "filled"}
                  className="fs-6 flex-shrink-0"
                >
                  2
                </Number>
                <div className="d-flex align-items-start flex-column">
                  <span
                    className={
                      onboardingStep !== 2
                        ? "text-r-bank-grayscale-iron"
                        : "fw-bold"
                    }
                  >
                    Verify email address
                  </span>
                  {onboardingStep == 2 && (
                    <div>
                      <p className="my-1">
                        We will verify your email adress by sending you a one
                        time code to your adress.
                      </p>
                    </div>
                  )}
                </div>{" "}
              </div>
              <hr />
              <div className="d-flex align-items-start py-2">
                <Number
                  filled={onboardingStep == 3 && "filled"}
                  className="fs-6 flex-shrink-0"
                >
                  3
                </Number>
                <div className="d-flex align-items-start flex-column">
                  <span
                    className={
                      onboardingStep !== 3
                        ? "text-r-bank-grayscale-iron"
                        : "fw-bold"
                    }
                  >
                    Link Google Authenticator
                  </span>
                  {onboardingStep == 3 && (
                    <div>
                      <p className="my-1">
                        R Bank uses Google Authenticator for our 2 Factor
                        Authentication. Click here to download the app from the
                        appstore to your phone.
                      </p>
                    </div>
                  )}
                </div>{" "}
              </div>
              <hr />
              <div className="d-flex align-items-start py-2">
                <Number
                  filled={onboardingStep == 4 && "filled"}
                  className="fs-6 flex-shrink-0"
                >
                  4
                </Number>
                <div className="d-flex align-items-start flex-column">
                  <span
                    className={
                      onboardingStep !== 4
                        ? "text-r-bank-grayscale-iron"
                        : "fw-bold"
                    }
                  >
                    Fortify security
                  </span>
                  {onboardingStep == 4 && (
                    <div>
                      <p className="my-1">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Neque libero, dolorem natus ratione beatae asperiores.
                      </p>
                    </div>
                  )}
                </div>{" "}
              </div>
              <hr />
              <div className="d-flex align-items-start py-2">
                <Number
                  filled={onboardingStep == 5 && "filled"}
                  className="fs-6 flex-shrink-0"
                >
                  5
                </Number>
                <div className="d-flex align-items-start flex-column">
                  <span
                    className={
                      onboardingStep !== 5
                        ? "text-r-bank-grayscale-iron"
                        : "fw-bold"
                    }
                  >
                    Add funds
                  </span>
                  {onboardingStep == 5 && (
                    <div>
                      <p className="my-1">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Neque libero, dolorem natus ratione beatae asperiores.
                      </p>
                    </div>
                  )}
                </div>{" "}
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapToProps = ({ onboardingStep }) => ({ onboardingStep });
export default connect(mapToProps, actions)(OnboardNav);
