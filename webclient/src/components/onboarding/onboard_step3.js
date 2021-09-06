import React, { Component } from "react";
import { connect } from "redux-zero/react";
import styled from "@emotion/styled";
import OtpInput from "react-otp-input";

import { SmartVaultContext, SmartVaultConsumer } from "../smartvault_provider";

import actions from "../../redux/actions";

const StyledOTPContainer = styled.div`
  .inputStyle {
    width: 3rem !important;
    height: 3rem;
    margin: 0 1rem;
    font-size: 2rem;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.3);
  }
`;

class Step3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      otp: "",
    };
  }

  handleChange(otp) {
    this.setState({ otp });
  }

  validate(e) {
    e.preventDefault();
    var match = this.context.smartvault.validateOTP(this.state.otp);
    if (!match) {
      this.setState({ error: "OTP does not match" });
      return;
    }

    this.props.history.push("/create/step3");
  }

  handleClick = () => {
    this.props.setOnboardingStep(4);
  };

  render() {
    const uri = this.context.smartvault
      .getOTPScanUrl()
      .replace("?", "%3F")
      .replace("&", "%26");

    const qr_fixed = `https://chart.googleapis.com/chart?chs=200x200&chld=L|0&cht=qr&chl=${uri}`;

    return (
      <SmartVaultConsumer>
        {({ smartvault }) => (
          <div className="bg-white align-content-center justify-content-start p-5 vh-100">
            <div className="d-flex flex-column mb-5 pe-3">
              <div>
                <div className="fs-6 text-r-bank-grayscale-iron text-uppercase">
                  step 3
                </div>

                <div className="fs-1 text-r-bank-primary">
                  Link Google Authenticator
                </div>
                <div className="pt-5">
                  <div className=" mb-4">
                    Scan the QR-Code with the App to link your R Bank account to
                    your Authenticator.
                  </div>
                  <div className="d-flex justify-content-between align-content-center">
                    <img
                      src={qr_fixed}
                      width="200"
                      height="200"
                      className="img-thumbnail"
                    />
                    <StyledOTPContainer className="row justify-content-md-center ">
                      <OtpInput
                        inputStyle="inputStyle"
                        value={this.state.otp}
                        onChange={this.handleChange.bind(this)}
                        numInputs={6}
                        isInputNum={true}
                        shouldAutoFocus
                        separator={<span></span>}
                      />
                    </StyledOTPContainer>
                  </div>

                  <div className="d-flex justify-content-end p-3 fixed-bottom">
                    <button
                      type="button"
                      onClick={this.handleClick}
                      className="btn btn-r-bank-grayscale-silver text-white rounded-pill"
                    >
                      Continue
                    </button>
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

Step3.contextType = SmartVaultContext;

const mapToProps = ({ user }) => ({ user });
export default connect(mapToProps, actions)(Step3);
