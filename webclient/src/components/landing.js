import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "redux-zero/react";
import styled from "@emotion/styled";

class Landing extends Component {
  render() {
    return (
      <div>
        <section className=" text-dark p5 text-center text-sm-start">
          <div className="container">
            <div className="card my-5 p-3">
              <div className=" d-flex align-items-start justify-content-between">
                <div className="card-body">
                  <h3 className="card-title">
                    Your access to decentralized finance
                  </h3>
                  <p className="card-text">
                    Some quick example text to build on the card title and make
                    up the bulk of the card's content. Lorem ipsum dolor sit
                    amet consectetur adipisicing elit. Consectetur eos a labore,
                    nemo iure atque.
                  </p>
                </div>
                <img src="undraw_wallet_aym5.svg" className="img-fluid w-25" />
              </div>
            </div>
          </div>
          <div className="container">
            <div className="card my-5 p-3">
              <div className=" d-flex align-items-start justify-content-between">
                <img src="undraw_wallet_aym5.svg" className="img-fluid w-25" />
                <div className="card-body">
                  <h3 className="card-title">Smart Wallet blabla </h3>
                  <p className="card-text">
                    Some quick example text to build on the card title and make
                    up the bulk of the card's content. Lorem ipsum dolor sit
                    amet consectetur adipisicing elit. Consectetur eos a labore,
                    nemo iure atque.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-r-bank-blue text-light p-5">
          <div className="container">
            <div className="d-md-flex justify-content-between align-items-center">
              <div>
                <h3 className="">Get your account today!</h3>
                <p className="fs-6 fw-lighter">
                  {" "}
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Modi, quod! Lorem ipsum dolor, sit amet consectetur
                </p>
              </div>

              <Link
                className="btn btn-light fs-3"
                style={{ borderRadius: "2rem" }}
                role="button"
                to="/onboarding1"
              >
                Sign up now
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default Landing;
