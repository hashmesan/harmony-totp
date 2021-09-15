import React, { useState, useEffect } from "react";

import { connect } from "redux-zero/react";

import actions from "../../redux/actions";
import OnboardNav from "./onboarding_nav";
import Step1 from "./onboard_step1";
import Step2 from "./onboard_step2";
import Step3 from "./onboard_step3";
import Step4 from "./onboard_step4";
import Step5 from "./onboard_step5";

const Onboard = ({ onboardingStep, setLocation, setOnboardingStep }) => {
  useEffect(() => {
    setLocation("Onboarding");
  });

  return (
    <div className="container-fluid p-0 min-vh-100">
      <div className="row align-items-start justify-content-between m-0 min-vh-100">
        <div className="col-md-6 d-none d-md-block p-0 min-vh-100">
          <OnboardNav />
        </div>
        <div className="col p-0">
          {
            {
              1: <Step1 />,
              2: <Step2 />,
              3: <Step3 />,
              4: <Step4 />,
              5: <Step5 />,
            }[onboardingStep]
          }
        </div>
      </div>
    </div>
  );
};

const mapToProps = ({ onboardingStep }) => ({ onboardingStep });
export default connect(mapToProps, actions)(Onboard);
