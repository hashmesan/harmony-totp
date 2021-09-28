import React, { useState, useContext, useEffect } from "react";
import { connect } from "redux-zero/react";
import styled from "@emotion/styled";
import OtpInput from "react-otp-input";
import { Link } from "react-router-dom";

import { SmartVaultContext } from "../../context/SmartvaultContext";

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

const Step3 = ({ setOnboardingStep }) => {
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const { smartvault } = useContext(SmartVaultContext);

  useEffect(() => {
    setOnboardingStep(3);
  }, []);

  const handleChange = (otp) => {
    setOtp(otp);
    const match = smartvault.validateOTP(otp);
    if (match) {
      setError("none");
      setValidated(true);
    } else {
      setError("OTP does not match");
      setValidated(false);
      return;
    }
  };

  const handleClick = () => {
    setOnboardingStep(4);
  };

  const uri = smartvault
    .getOTPScanUrl()
    .replace("?", "%3F")
    .replace("&", "%26");

  const qr_fixed = `https://chart.googleapis.com/chart?chs=200x200&chld=L|0&cht=qr&chl=${uri}`;

  return (
    <div className="bg-white align-content-center border-top border-no-bank-grayscale-titanium justify-content-start pt-5 pe-5 ps-4 h-100">
      <div className="d-flex flex-column mb-5 ps-2 pt-3 pe-3">
        <div>
          <div className="fs-6 text-no-bank-grayscale-iron text-uppercase">
            step 3
          </div>

          <div className="fs-1 text-no-bank-primary">
            Link Google Authenticator
          </div>
          <div className="pt-5">
            <div className=" mb-4">
              Scan the QR-Code with the App to link your R Bank account to your
              Authenticator.
            </div>
            <img
              src={qr_fixed}
              width="200"
              height="200"
              className="img-thumbnail my-3"
            />

            <p className="text-no-bank-grayscale-iron fs-6">Code</p>
            <StyledOTPContainer className="row justify-content-start ">
              <OtpInput
                inputStyle="inputStyle"
                value={otp}
                onChange={handleChange}
                numInputs={6}
                isInputNum={true}
                shouldAutoFocus
                separator={<span></span>}
              />
            </StyledOTPContainer>
            {validated && (
              <div className="mt-2">
                <i className="bi bi-check-circle text-success fs-5" />
                <span className="ps-3 text-success">Validation completed</span>
              </div>
            )}
            <div className="d-flex justify-content-end pe-5 pb-3 fixed-bottom">
              <div className="pe-3 pb-3">
                <Link to="/onboard/4">
                  <button
                    type="button"
                    onClick={handleClick}
                    className={`btn rounded-pill ${
                      validated
                        ? "btn-no-bank-highlight text-rb-bank-primary"
                        : "btn-no-bank-grayscale-silver text-white"
                    }`}
                    disabled={!validated && "disabled"}
                  >
                    Continue
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapToProps = ({}) => ({});
export default connect(mapToProps, actions)(Step3);
