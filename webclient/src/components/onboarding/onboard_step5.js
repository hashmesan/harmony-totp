import React, { Component } from "react";
import { connect } from "redux-zero/react";
import { Modal } from "bootstrap";

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
          {/* show btn Modal */}
          <button
            type="button"
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            Launch demo modal
          </button>

          {/* Modal */}
          <div
            className="modal fade"
            id="exampleModal"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Modal title
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">...</div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button type="button" className="btn btn-primary">
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapToProps = ({ user }) => ({ user });
export default connect(mapToProps, actions)(Step5);
