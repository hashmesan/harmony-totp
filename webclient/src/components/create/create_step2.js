import React, { Component } from "react";
import OtpInput from "react-otp-input";
import styled from "@emotion/styled";
import { withRouter } from "react-router-dom";
import { connect } from "redux-zero/react";
import actions from "../../redux/actions";
import {
  SmartVaultContext,
  SmartVaultConsumer,
} from "../../context/SmartvaultContext";

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
class ScanQRCode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      otp: "",
      busy: false,
    };
  }
  handleChange(otp) {
    this.setState({ otp });
    validate(otp);
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

  render() {
    const uri = this.context.smartvault
      .getOTPScanUrl()
      .replace("?", "%3F")
      .replace("&", "%26");
    const qr_fixed = `https://chart.googleapis.com/chart?chs=200x200&chld=L|0&cht=qr&chl=${uri}`;

    return (
      <SmartVaultConsumer>
        {({ smartvault }) => (
          <React.Fragment>
            <h2>Scan your HOTP Secret</h2>
            <h5 className="mt-4 mb-4">
              Scan this QR code with your Google Authenticator.
              <br />
              This code is used to authorize higher transfers, and recover your
              wallet.
            </h5>
            <div className="mb-4">
              <img
                src={qr_fixed}
                width="128"
                height="128"
                className="img-thumbnail"
              />
              <br />
              <a className="btn btn-link">Generate New Secret</a>
            </div>

            <label>Enter the first OTP Code</label>
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

            {this.state.error && (
              <div className="row justify-content-md-center mt-4">
                <div className="alert alert-danger w-50" role="alert">
                  {this.state.error.toString()}
                </div>
              </div>
            )}

            {!this.state.busy && (
              <button
                className="mt-5 btn btn-lg btn-primary"
                onClick={this.validate.bind(this)}
              >
                Continue
              </button>
            )}
            {this.state.busy && (
              <button
                disabled
                className="mt-5 btn btn-lg btn-primary"
                type="button"
              >
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                Loading...
              </button>
            )}
          </React.Fragment>
        )}
      </SmartVaultConsumer>
    );
  }
}
ScanQRCode.contextType = SmartVaultContext;

const mapToProps = ({ environment }) => ({ environment });
export default connect(mapToProps, actions)(withRouter(ScanQRCode));
