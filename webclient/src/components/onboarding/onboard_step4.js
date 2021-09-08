import React, { Component } from "react";
import { connect } from "redux-zero/react";
import { Collapse } from "bootstrap";

import { SmartVaultContext } from "../smartvault_provider";

import actions from "../../redux/actions";

class Step4 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      guardians: [],
      collapsed: false,
    };
  }

  setGuardian = () => {
    this.setState({});
  };

  toggleCollapse = () => {
    this.setState({
      collapsed: !this.state.collapsed,
      guardians: [{ name: "xy" }],
    });
  };

  render() {
    return (
      <div className="bg-white align-content-center border-top border-r-bank-grayscale-titanium justify-content-start p-5 vh-100">
        <div className="d-flex mb-5 pe-3">
          <div>
            {" "}
            <div className="fs-6 text-r-bank-grayscale-iron text-uppercase">
              step 4
            </div>
            <div className="fs-1 text-r-bank-primary">
              Fortify wallet security{" "}
            </div>
            <div className="d-flex justify-content-start pt-5">
              <img
                src="public/add_guardian.svg"
                height="96"
                width="120"
                className="me-3"
                alt=""
              />{" "}
              <div>
                <p className="fw-bold">Add a guardian</p>
                <p>
                  Guardians are people you trust. They will not have access to
                  your funds but enable safety features such as wallet recovery
                  and blocking of unexpected transfers. You decide what they can
                  do.
                </p>
              </div>
            </div>
            {this.state.guardians.length > 0 && (
              <div>
                <p className="text-r-bank-grayscale-iron pt-3">
                  Added guardians{" "}
                </p>
                <div
                  className={(this.state.collapsed ? "show" : "") + "collapse"}
                  id="collapse-Target"
                >
                  <div className="card card-body">some content here</div>
                </div>
              </div>
            )}
            <div className="justify-content-start pt-3">
              <p className="text-r-bank-grayscale-iron pt-5">
                Who would you want to add?
              </p>

              <input
                type="text"
                className="form-control is-valid my-3"
                id="guardianName"
                placeholder="Please enter a guardian's username or address"
                required
              />
              <button
                className="btn btn-outline-dark rounded-pill"
                type="button"
                onClick={this.toggleCollapse}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Step4.contextType = SmartVaultContext;

const mapToProps = ({ user }) => ({ user });
export default connect(mapToProps, actions)(Step4);
