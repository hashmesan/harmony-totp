import React from "react";
import { useParams } from "react-router-dom";

import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import Step4 from "./step4";
import Step5 from "./step5";

const OnboardingSteps = () => {
  let { onboardingStepId } = useParams();
  return (
    <div>
      {
        {
          1: <Step1 />,
          2: <Step2 />,
          3: <Step3 />,
          4: <Step4 />,
          5: <Step5 />,
        }[onboardingStepId]
      }
    </div>
  );
};

export default OnboardingSteps;
