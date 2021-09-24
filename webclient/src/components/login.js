import { useCallback } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import React, { useContext, useState } from "react";

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
  let history = useHistory();

  const uri = smartvault
    .getOTPScanUrl()
    .replace("?", "%3F")
    .replace("&", "%26");

  const qr_fixed = `https://chart.googleapis.com/chart?chs=200x200&chld=L|0&cht=qr&chl=${uri}`;

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    console.log("handing submit");

    const { email, password } = e.target.elements;
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email.value, password.value);
      history.push("/portfolio");
    } catch (e) {
      alert(e.message);
    }
  }, []);

  const handleChange = () => {
    console.log("handling change");
  };

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="row">
                <input
                  name="email"
                  placeholder="email or username"
                  type="email"
                />
              </div>
              <div className="row">
                <input name="password" placeholder="password" type="password" />
              </div>
              <div className="row">
                <button type="submit">Login</button>
              </div>
            </div>
            <div className="col">
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
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default Login;
