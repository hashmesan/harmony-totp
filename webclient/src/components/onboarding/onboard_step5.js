import React, { Component } from "react";
import { connect } from "redux-zero/react";

import actions from "../../redux/actions";

class Step5 extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="bg-white align-content-center border-top border-r-bank-grayscale-titanium justify-content-start p-5 vh-100">
        <div className="d-flex flex-column mb-5 pe-3">
          <div>
            {" "}
            <div className="fs-6 text-r-bank-grayscale-iron text-uppercase">
              step 5
            </div>
            <div className="fs-1 text-r-bank-primary">Add funds </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapToProps = ({ user }) => ({ user });
export default connect(mapToProps, actions)(Step5);
