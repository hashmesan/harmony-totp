import React, { Component } from "react";

import { connect } from "redux-zero/react";
import actions from "../../redux/actions";

class OnboardNav extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { onboardingStep } = this.props;

    return (
      <React.Fragment>
        <div className="d-flex bg-gray-400 vh-100 align-content-center justify-content-center p-2">
          <ul>
            <li className="">el 1</li>
            <li>el 1</li>
            <li>el 1</li>
          </ul>
        </div>
      </React.Fragment>
    );
  }
}

const mapToProps = ({ onboardingStep }) => ({ onboardingStep });
export default connect(mapToProps, actions)(OnboardNav);
