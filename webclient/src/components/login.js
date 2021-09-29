import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
} from "firebase/auth";
import React, { useContext, useState, useEffect, useCallback } from "react";

import styled from "@emotion/styled";
import OtpInput from "react-otp-input";

import { SmartVaultContext } from "../context/SmartvaultContext";
import { useHistory } from "react-router-dom";

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

const Login = () => {
  const { smartvault } = useContext(SmartVaultContext);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [validated, setValidated] = useState(false);

  const [formData, setFormData] = useState({});
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const history = useHistory();

  const auth = getAuth();

  const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: "https://no-bank.finance/portfolio",
    // This must be true.
    handleCodeInApp: true,
  };

  const togglePassword = () => setPasswordVisibility(!passwordVisibility);

  const handleOTPChange = (otp) => {
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

  const handleChange = (e) => {
    console.log("formdata: ", formData);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value.trim(),
    });
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const { email, password } = e.target.elements;

    try {
      await signInWithEmailAndPassword(auth, email.value, password.value);
      history.push("/portfolio");
    } catch (e) {
      alert(e.message);
    }
  }, []);

  return (
    <div>
      <div className="container ">
        <div className="d-flex justify-content-center mt-5">
          <form onSubmit={handleSubmit} className="col-6">
            <div className="d-grid gap-5 pb-5">
              <h1 className="mb-5 ">
                Sign in to <u>no</u>bank
              </h1>
              <div className="form-group ">
                <label className="text-no-bank-grayscale-iron">E-mail</label>
                <input
                  name="email"
                  placeholder="email or username"
                  type="email"
                  className="form-control"
                  onChange={handleChange}
                />
              </div>
              <div className="form-group ">
                <label className="text-no-bank-grayscale-iron">Password</label>
                <div className="input-group">
                  <input
                    name="password"
                    placeholder="password"
                    type={passwordVisibility ? "text" : "password"}
                    className="form-control"
                    onChange={handleChange}
                  />
                  <span className="input-group-text">
                    <i
                      className="bi bi-eye"
                      id="togglePassword"
                      onClick={togglePassword}
                      style={{ cursor: "pointer" }}
                    ></i>
                  </span>
                </div>
              </div>
              {/*<div className="form-group">
                <label className="text-no-bank-grayscale-iron fs-6">
                  Google TOTP
                </label>
                <StyledOTPContainer className="row justify-content-start ">
                  <OtpInput
                    inputStyle="inputStyle"
                    value={otp}
                    onChange={handleOTPChange}
                    numInputs={6}
                    isInputNum={true}
                    shouldAutoFocus
                    separator={<span></span>}
                  />
                </StyledOTPContainer>
              </div>
              */}
              <button
                type="submit"
                className="btn rounded-pill btn-no-bank-highlight col-3"
              >
                Login
              </button>
            </div>
            <div
              className="text-no-bank-grayscale-iron pt-5"
              style={{ cursor: "pointer" }}
            >
              <span
                onClick={() => sendPasswordResetEmail(auth, formData.email)}
              >
                Forgot your password?{" "}
              </span>
              <span onClick={() => history.push("/onboard")}>
                Don't have an account?{" "}
              </span>
              <span onClick={() => history.push("/recover")}>
                Recover using a guardian?
              </span>
            </div>
            <div
              className="text-no-bank-grayscale-iron"
              style={{ cursor: "pointer" }}
            >
              <span
                onClick={() =>
                  sendSignInLinkToEmail(
                    auth,
                    formData.email,
                    actionCodeSettings
                  )
                }
              >
                Rather receive e-mail for login instead of using a password?
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
