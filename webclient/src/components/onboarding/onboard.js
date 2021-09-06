import React, { Component } from "react";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";

import { connect } from "redux-zero/react";

import actions from "../../redux/actions";
import OnboardNav from "./onboarding_nav";
import Step1 from "./onboard_step1";
import Step2 from "./onboard_step2";
import Step3 from "./onboard_step3";

import { SmartVaultContext, SmartVaultConsumer } from "../smartvault_provider";

class Onboard extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.setLocation("Onboarding");
    this.props.setOnboardingStep(1);
  }

  render() {
    const onboardingStep = this.props.onboardingStep;

    return (
      <div className="container-fluid p-0">
        <div className="row align-items-center justify-content-between m-0 vh-100">
          <div className="col-6 p-0">
            <OnboardNav />
          </div>
          {onboardingStep == 1 && (
            <div className="col-6 p-0">
              {" "}
              <Step1 />
            </div>
          )}
          {onboardingStep == 2 && (
            <div className="col-6 p-0">
              {" "}
              <Step2 />
            </div>
          )}
          {onboardingStep == 3 && (
            <div className="col-6 p-0">
              {" "}
              <Step3 />
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapToProps = ({ onboardingStep }) => ({ onboardingStep });
export default connect(mapToProps, actions)(Onboard);
