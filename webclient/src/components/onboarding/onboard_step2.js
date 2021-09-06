import React, { Component } from "react";
import { connect } from "redux-zero/react";

import actions from "../../redux/actions";

class Step2 extends Component {
  constructor(props) {
    super(props);
  }

  handleClick = () => {
    this.props.setOnboardingStep(3);
  };

  render() {
    const { userEmail } = this.props.user;

    return (
      <div className="bg-white align-content-center justify-content-start p-5 vh-100">
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
              <form className="needs-validation d-grid gap-4" noValidate>
                <div className="row mb-1">
                  <label
                    htmlFor="emailValidation"
                    className="form-label mb-0 text-r-bank-grayscale-iron"
                  >
                    Code
                  </label>
                  <div className="row ">
                    <input
                      type="text"
                      className="col m-1 form-control text-center"
                      maxLength="1"
                    />
                    <input
                      type="text"
                      className="col m-1 form-control text-center"
                      maxLength="1"
                    />
                    <input
                      type="text"
                      className="col m-1 form-control text-center"
                      maxLength="1"
                    />
                    <input
                      type="text"
                      className="col m-1 form-control text-center"
                      maxLength="1"
                    />
                    <input
                      type="text"
                      className="col m-1 form-control text-center"
                      maxLength="1"
                    />
                    <input
                      type="text"
                      className="col m-1 form-control text-center"
                      maxLength="1"
                    />
                  </div>
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
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapToProps = ({ user }) => ({ user });
export default connect(mapToProps, actions)(Step2);
