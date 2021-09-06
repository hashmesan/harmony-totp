import React, { Component } from "react";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";

import { connect } from "redux-zero/react";

import actions from "../../redux/actions";
import OnboardNav from "./onboarding_nav";
import Step1 from "./onboard_step1_new";

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
      <React.Fragment>
        <div className="container-fluid p-0">
          <div className="row align-items-center justify-content-between m-0">
            <div className="col-6 p-0">
              <OnboardNav />
            </div>
            <div className="col-6 p-0">{onboardingStep == 1 && <Step1 />}</div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapToProps = ({ onboardingStep }) => ({ onboardingStep });
export default connect(mapToProps, actions)(Onboard);
