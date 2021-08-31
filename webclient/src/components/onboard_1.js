import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "redux-zero/react";
import styled from "@emotion/styled";


class Onboarding1 extends Component {
  render() {
    return (
      
      <div className="container-fluid p-0">
        <div className="text-dark text-center text-sm-start align-items-stretch">
          <div className="d-flex align-items-stretch justify-content-between">
            <div className="col-8 p-5 mt-5">
              <div className="vstack ms-5">
                <p className="text-secondary mt-5">STEP 1:</p>
                <p className="h3 mb-5">Sign up to the R Bank</p>
                <p className="fs-6 fw-bold">Hi there,</p>
                <p>
                  Thanks for deciding to open an account with R-Bank! Let us
                  quickly tell you how the onboarding works:
                </p>
                <p>
                  <span className="fs-6 fw-bold">Step 1: </span>
                  <span className="fs-6">
                    You provide the essential information in order to open your
                    account. We collect nothing that does not provide value to
                    you. If you like to understand why you provide what
                    information just follow the explanations.{" "}
                  </span>
                </p>
                <p>
                  <span className="fs-6 fw-bold">Step 2: </span>
                  <span className="fs-6">
                    If you like you can add additional security features to your
                    account. This is by no means required but we warmly
                    recommend it. Better safe than sorry is more relevant now
                    than ever!
                  </span>
                </p>
                <p>
                  So that's enough talking - let's head over to the onboarding
                  -->
                </p>
 
                <form className="mt-5" action="">
                  <div className="row">
                    <div className="col-7">
                      <div className="mb-3">
                        <label for="Input_Username" className="form-label">
                          Username
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="UserName"
                          placeholder="rbankuser1"
                        />
                        <div id="UserName" className="form-text">
                          Please use at least 8 characters
                        </div>
                      </div>
                    </div>
                    <div className="col-5 align-self-center">
                      <div className="text-success">
                        You can choose a username to conveniently log into the R Bank platform. It also enables you to find and be found by your friends.
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-7">
                      <div className="mb-3">
                        <label for="Input_Pwd" className="form-label">
                          Password
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          id="UserPw"
                          placeholder="6+ Characters, 1 Capital letter, 1 special Character"
                        />
                        <div id="UserPw" className="form-text">
                          Please include 6+ Characters, 1 Capital letter, 1 special Character  
                        </div>
                      </div>
                    </div>
                    <div className="col-5 align-self-center">
                      <div className="text-success">
                        Secure your account with a password! Remember to make it unique and use special characters.
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-7">
                      <div className="mb-3">
                        <label for="Input_Email" className="form-label">
                          Email
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          id="UserEmail"
                          placeholder="name@mail.com"
                          //aria-describedby="emailHelp"
                        />
                      </div>
                    </div>
                    <div className="col-5 align-self-center">
                      <div className="text-success">
                        With e-mail you'll be able to reset your account details and retreive a forgotten password.
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-7">
                      <div className="mb-3">
                        <label for="Input_Residence" className="form-label">
                          Country of Residence
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="UserResidence"
                          placeholder="Switzerland"
                        />
                      </div>
                    </div>
                    <div className="col-5 align-self-center">
                      <div className="text-success">
                        Depending on your location you are eligible for different services - it's the law :/
                      </div>
                    </div>
                  </div>

                </form>
              </div>
            </div>
            <div className="col-4">
              <div className="d-flex bg-gray-600 vh-100 align-items-center justify-content-between">
                <img
                  src="undraw_app_data_re.svg"
                  alt=""
                  className="img-fluid w-100 p-1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Onboarding1;
