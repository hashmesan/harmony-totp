import React, { Component } from "react";

import { connect } from "redux-zero/react";

import actions from "../../redux/actions";
import OnboardNav from "./onboarding_nav";
import Step1 from "./onboard_step1";
import Step2 from "./onboard_step2";
import Step3 from "./onboard_step3";
import Step4 from "./onboard_step4";
import Step5 from "./onboard_step5";

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
      <div className="container-fluid p-0 min-vh-100">
        <div className="row align-items-start justify-content-between m-0 min-vh-100">
          <div className="col-md-6 d-none d-md-block p-0 min-vh-100">
            <OnboardNav />
          </div>
          {onboardingStep == 1 && (
            <div className="col col-md-6 p-0">
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
          {onboardingStep == 4 && (
            <div className="col-6 p-0">
              {" "}
              <Step4 />
            </div>
          )}
          {onboardingStep == 5 && (
            <div className="col-6 p-0">
              {" "}
              <Step5 />
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapToProps = ({ onboardingStep }) => ({ onboardingStep });
export default connect(mapToProps, actions)(Onboard);
