import React from "react";
import NavElement from "./navElement";

const navElementContent = [
  {
    nr: "1",
    title: "Account setup",
    text: "We need your email adress to verify your account as well as for recovery. Depending on your location you are eligible for different services – it's the law :/",
  },
  {
    nr: "2",
    title: "Verify email address",
    text: "We will verify your email adress by sending you a one time code to your adress.",
  },
  {
    nr: "3",
    title: "Link Google Authenticator",
    text: " R Bank uses Google Authenticator for our 2 Factor Authentication. Click here to download the app from the appstore to your phone.",
  },
  {
    nr: "4",
    title: "Fortify security",
    text: "Make sure to secure your wallet with state-of-the-art security features.",
  },
  {
    nr: "5",
    title: "Add funds",
    text: "Adding funds will activate your wallet and you’re all set up to start investing in the space of decentralized finance! nobank only charges the fees of third party providers and does not earn anything on top-ups.",
  },
];

const OnboardingNav = () => {
  return (
    <React.Fragment>
      <div className="bg-no-bank-grayscale-platin border border-no-bank-grayscale-titanium align-content-center justify-content-start p-5 min-vh-100">
        <div className="d-flex flex-column ps-3 pt-3">
          <div>
            <div className="fs-6 text-no-bank-grayscale-iron text-uppercase">
              Open an account
            </div>

            <div className="fs-1 text-no-bank-grayscale-iron">How it works</div>
          </div>
          <div className="pt-5">
            {navElementContent.map((element) => (
              <div key={element.nr}>
                <NavElement
                  nr={element.nr}
                  title={element.title}
                  text={element.text}
                />
                <hr />
              </div>
            ))}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default OnboardingNav;
