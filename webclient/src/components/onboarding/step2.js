import React, { useEffect, useState } from "react";
import { connect } from "redux-zero/react";
import { Link } from "react-router-dom";

import actions from "../../redux/actions";
import { getAuth, sendEmailVerification } from "firebase/auth";
import { getAnalytics, logEvent } from "firebase/analytics";

import EmailWait from "../../../public/email_wait.svg";
import EmailSuccess from "../../../public/email_success.svg";

const Step2 = ({ setOnboardingStep }) => {
  const [emailValidated, setEmailValidated] = useState(false);
  const auth = getAuth();
  const analytics = getAnalytics();

  useEffect(() => {
    const checkEmailValidity = () => {
      if (auth.currentUser != null) {
        auth.currentUser.reload();
        auth.currentUser.emailVerified && setEmailValidated(true);
        console.log("checking email");
      }
    };

    checkEmailValidity();

    const interval = setInterval(() => {
      checkEmailValidity();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    logEvent(analytics, "onboarding", { step: 2 });
    setOnboardingStep(2);
  }, []);

  const handleEmail = () => {
    sendEmailVerification(auth.currentUser, {
      url: window.location.href,
      handleCodeInApp: true,
    });
    console.log("handling email");
  };

  return (
    <div className="bg-white align-content-center border-top border-no-bank-grayscale-titanium justify-content-start pt-5 pe-5 ps-4 h-100">
      <div className="d-flex flex-column mb-5 ps-2 pt-3 pe-3">
        <div>
          <div className="fs-6 text-no-bank-grayscale-iron text-uppercase">
            step 2
          </div>

          <div className="fs-1 text-no-bank-primary">Verify email address</div>
          <div className="pt-5">
            {emailValidated && (
              <div>
                <span>
                  Your email has been successfully validated. You are now ready
                  to continue.
                </span>
                <div className="d-flex justify-content-center">
                  <img
                    src={EmailSuccess}
                    height="96"
                    width="120"
                    className="m-5"
                    alt=""
                  />
                  <span className="text-no-bank-grayscale-iron">
                    Email successfully verified.
                  </span>
                </div>
              </div>
            )}
            {!emailValidated && (
              <div>
                <div className=" ">
                  Please verify your email using the link we just sent you.
                </div>

                <p className="">
                  <span className="text-no-bank-grayscale-iron">
                    Didn’t receive an email?{" "}
                    <button
                      className="btn fw-bold text-no-bank-primary text-decoration-none"
                      onClick={handleEmail}
                    >
                      Resend
                    </button>
                  </span>
                </p>
                <div className="d-flex justify-content-center">
                  <img
                    src={EmailWait}
                    height="96"
                    width="120"
                    className="m-5"
                    alt=""
                  />
                </div>
              </div>
            )}
            <div className="d-flex justify-content-end pe-5 pb-3 fixed-bottom">
              <div className="pe-3 pb-3">
                <Link to="/onboard/1">
                  <button
                    id="backButton"
                    type="button"
                    className="btn rounded-pill btn-no-bank-white text-rb-bank-primary pe-4 me-1"
                  >
                    Back
                  </button>
                </Link>
                <Link to="/onboard/3">
                  <button
                    id="continueButton"
                    type="button"
                    className={`btn rounded-pill ${
                      emailValidated
                        ? "btn-no-bank-highlight text-rb-bank-primary"
                        : "btn-no-bank-grayscale-silver text-white"
                    }`}
                    disabled={!emailValidated && "disabled"}
                  >
                    Continue
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapToProps = ({}) => ({});
export default connect(mapToProps, actions)(Step2);
