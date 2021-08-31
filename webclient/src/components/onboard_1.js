import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "redux-zero/react";
import styled from "@emotion/styled";

class Onboarding1 extends Component {
  render() {
    return (
      <div className="container text-dark text-center text-sm-start align-items-stretch">
        <div className="d-flex align-items-stretch justify-content-between">
          <div className="bg-white vstack gap-2">
            <p className="text-secondary">Step 1:</p>
            <p className="h3 mb-3">Sign up to the R Bank</p>
            <p className="fs-6 fw-bold">Hi there,</p>
            <p>
              Thanks for deciding to open an account with R-Bank! Let us quickly
              tell you how the onboarding works:
            </p>
            <p>
              <span className="fs-6 fw-bold">Step 1: </span>
              <span className="fs-6">
                You provide the essential information in order to open your
                account. We collect nothing that does not provide value to you.
                If you like to understand why you provide what information just
                follow the explanations.{" "}
              </span>
            </p>
            <p>
              <span className="fs-6 fw-bold">Step 2: </span>
              <span className="fs-6">
                If you like you can add additional security features to your
                account. This is by no means required but we warmly recommend
                it. Better safe than sorry is more relevant now than ever!
              </span>
            </p>
            <p>
              So that's enough talking - let's head over to the onboarding -->
            </p>
            <form action="">
              <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">
                  Email address
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                />
                <div id="emailHelp" className="form-text">
                  We'll never share your email with anyone else.
                </div>
              </div>
            </form>
          </div>

          <div className="d-flex bg-gray-600 vh-100 align-items-center justify-content-between">
            <img
              src="undraw_app_data_re.svg"
              alt=""
              className="img-fluid w-100 p-1"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Onboarding1;
