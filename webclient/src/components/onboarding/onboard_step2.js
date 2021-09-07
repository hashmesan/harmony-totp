import React, { Component } from "react";
import { connect } from "redux-zero/react";
import OtpInput from "react-otp-input";
import styled from "@emotion/styled";

import actions from "../../redux/actions";

const StyledOTPContainer = styled.div`
  .inputStyle {
    width: 3rem !important;
    height: 3rem;
    margin: 0 1rem 0 0;
    font-size: 2rem;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.3);
  }
`;
class Step2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      validated: false,
      otp: "",
    };
  }

  handleChange = (otp) => {
    this.setState({ otp });
    if (this.state.otp.length > 4) {
      this.setState({ validated: true });
    }
  };

  handleInput = () => {
    this.setState({ count: this.state.count + 1 });
    if (this.state.count > 4) {
      this.setState({ validated: true });
    }
  };

  handleEmail = () => {
    console.log("handling email");
  };

  handleClick = () => {
    this.props.setOnboardingStep(3);
  };

  render() {
    const { userEmail } = this.props.user;

    return (
      <div className="bg-white align-content-center border-top border-r-bank-grayscale-titanium justify-content-start p-5 vh-100">
        <div className="d-flex flex-column mb-5 pe-3">
          <div>
            <div className="fs-6 text-r-bank-grayscale-iron text-uppercase">
              step 2
            </div>

            <div className="fs-1 text-r-bank-primary">Verify email address</div>
            <div className="pt-5">
              <div className=" mb-4">
                Enter the code we just sent you at{" "}
                <span className="fw-bold">{userEmail}</span>
              </div>
              <p className="text-r-bank-grayscale-iron fs-6">Code</p>

              <StyledOTPContainer className="row justify-content-start ">
                <OtpInput
                  inputStyle="inputStyle"
                  value={this.state.otp}
                  onChange={this.handleChange}
                  numInputs={6}
                  isInputNum={true}
                  shouldAutoFocus
                  separator={<span></span>}
                />
              </StyledOTPContainer>
              <p className="mt-5">
                <span className="text-r-bank-grayscale-iron">
                  Didn’t receive a code?{" "}
                  <span
                    className="fw-bold text-r-bank-primary"
                    onClick={this.handleEmail}
                  >
                    {" "}
                    Resend
                  </span>
                </span>
              </p>
              {this.state.validated && (
                <div className="mt-2">
                  <i className="bi bi-check-circle text-r-bank-secondary-yellow-green fs-5" />
                  <span className="ps-3 text-r-bank-secondary-yellow-green">
                    Validation completed
                  </span>
                </div>
              )}
              <div className="d-flex justify-content-end p-3 fixed-bottom">
                <button
                  type="button"
                  onClick={this.handleClick}
                  className="btn btn-r-bank-grayscale-silver text-white rounded-pill"
                  disabled={!this.state.validated && "disabled"}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapToProps = ({ user }) => ({ user });
export default connect(mapToProps, actions)(Step2);
