import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "redux-zero/react";
import styled from "@emotion/styled";

const InputWrapper = styled.div`
  @media (min-width: 768px) {
    width: 50%;
  }
`;
class Landing extends Component {
  render() {
    return (
      <div>
        <section className="bg-dark text-light p-5 text-center text-sm-start">
          <div className="container">
            <div className="d-sm-flex align-items-center justify-content-between">
              <div>
                <Link to="/create" className="btn btn-link">
                  <img
                    src="bitcoin.svg"
                    alt=""
                    className="img-fluid m-1"
                    width="24px"
                  />
                  <span>Create your Crypto Portfolio</span>
                  <i className="bi bi-arrow-right-short"></i>
                </Link>
                <h1>
                  Become the <span className="text-warning">MASTER</span> of
                  your wealth
                </h1>
                <p className="lead my-4">
                  Too long did Traditional Banks take your money and benfit from
                  it - we're giving you back{" "}
                  <span className="text-warning">YOUR</span> freedom
                </p>
                <Link to="/create" className="btn btn-primary btn-lg">
                  Enter now
                </Link>
              </div>
              <img
                className="img-fluid w-75"
                src="undraw_wallet_aym5.svg"
                alt=""
              />
            </div>
          </div>
        </section>
        <section className="bg-primary text-light p-5">
          <div className="container">
            <div className="d-md-flex justify-content-between align-items-center">
              <h3 className="mb-3 mb-md-0">Sign up for the latest news</h3>
              <InputWrapper className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter E-mail"
                />
                <button className="btn btn-dark btn-lg" type="button">
                  Sign Up
                </button>
              </InputWrapper>
            </div>
          </div>
        </section>
        <section className="p-5">
          <div className="container">
            <div className="row text-center g-4">
              <div className="col-md">
                <div className="card bg-dark text-light">
                  <div className="card-body text-center">
                    <div className="h1 mb-3">
                      <i className="bi bi-laptop"></i>
                    </div>
                    <h3 className="card-title mb-3">Virtual</h3>
                    <p className="card-text">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Consectetur, ex!
                    </p>
                    <button className="btn btn-primary">Read more</button>
                  </div>
                </div>
              </div>
              <div className="col-md">
                <div className="card bg-secondary text-light">
                  <div className="card-body text-center">
                    <div className="h1 mb-3">
                      <i className="bi bi-person-square"></i>
                    </div>
                    <h3 className="card-title mb-3">Virtual</h3>
                    <p className="card-text">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Consectetur, ex!
                    </p>
                    <button className="btn btn-dark">Read more</button>
                  </div>
                </div>
              </div>
              <div className="col-md">
                <div className="card bg-dark text-light">
                  <div className="card-body text-center">
                    <div className="h1 mb-3">
                      <i className="bi bi-people"></i>
                    </div>
                    <h3 className="card-title mb-3">Virtual</h3>
                    <p className="card-text">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Consectetur, ex!
                    </p>
                    <button className="btn btn-primary">Read more</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default Landing;
