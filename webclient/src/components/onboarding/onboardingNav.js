import React from "react";
import NavElement from "./navElement";

const navElementContent = [
  {
    nr: "1",
    title: "Account setup",
    text: "Choose a username and secure your account with a password - Remember to make it unique and use special characters. We will need to verify your email address to set up your account and for recovery features.",
  },
  {
    nr: "2",
    title: "Verify email address",
    text: "We will verify your email adress by sending you a one time code to your adress.",
  },
  {
    nr: "3",
    title: "Link Google Authenticator",
    text: "nobank uses Google Authenticator for our 2 Factor Authentication. Click here to download the app from the appstore to your phone. What is Google Authenticator?",
  },
  {
    nr: "4",
    title: "Fortify security",
    text: "Make sure to secure your wallet with state-of-the-art security features.",
  },
  {
    nr: "5",
    title: "Add funds",
    text: "Adding funds will activate your wallet and you’re all set up to start investing in the space of decentralized finance! <u>no</u>bank only charges the fees of third party providers and does not earn anything on top-ups.",
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
