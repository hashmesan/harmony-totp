import React, { useEffect } from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import { getAnalytics, logEvent } from "firebase/analytics";

import { connect } from "redux-zero/react";
import actions from "../../redux/actions";

import OnboardingNav from "./onboardingNav";
import OnboardingSteps from "./onboardingSteps";

import Step1 from "./step1";

const Onboarding = ({ setLocation }) => {
  const { path, url } = useRouteMatch();
  const analytics = getAnalytics();

  useEffect(() => {
    setLocation("Onboarding");
    logEvent(analytics, "Onboarding started");
  }, []);

  return (
    <div className="container-fluid p-0 min-vh-100">
      <div className="row align-items-start justify-content-between m-0 min-vh-100">
        <div className="col-md-6 d-none d-md-block p-0 min-vh-100">
          <OnboardingNav />
        </div>
        <div className="col p-0">
          <Switch>
            <Route exact path={path}>
              <Step1 />
            </Route>
            <Route path={`${path}/:onboardingStepId`}>
              <OnboardingSteps />
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  );
};

const mapToProps = ({}) => ({});
export default connect(mapToProps, actions)(Onboarding);
