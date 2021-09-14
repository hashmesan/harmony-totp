import React, { useState, useContext } from "react";
import { connect } from "redux-zero/react";
import { Collapse } from "bootstrap";
const web3utils = require("web3-utils");

import { SmartVaultContext } from "../smartvault_provider";

import actions from "../../redux/actions";

const RenderAccordion = (props) => {
  console.log("guardian details: ", props.guardian);

  const { guardian } = props;

  return (
    <div className="accordion" id="accordionGuardians">
      <div className="accordion-item">
        <h2 className="accordion-header">
          <button
            className="accordion-button bg-r-bank-white p-3"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseOne"
            aria-expanded="true"
            aria-controls="collapseOne"
          >
            <div>
              <p className="text-r-bank-primary pt-2 pb-1 m-0">
                <strong>{guardian.hns}</strong>
              </p>
              <p className="text-r-bank-grayscale-iron pt-1 pb-2 m-0">
                {guardian.address}
              </p>
            </div>
          </button>
        </h2>
        <div
          id={`collapseOne`}
          className="accordion-collapse collapse show"
          aria-labelledby="headingOne"
          data-bs-parent="#accordionExample"
        >
          <div className="accordion-body p-3">
            <div className="form-check form-switch m-0 pt-2 pb-3">
              <input
                id="canRestoreAccount"
                type="checkbox"
                value=""
                className="form-check-input"
                data-onstyle="primary"
                defaultChecked="true"
              />
              <label className="form-check-label" htmlFor="canRestoreAccount">
                Authorization to restore account
              </label>
            </div>
            <div className="form-check form-switch m-0 pt-2 pb-3">
              <input
                id="canApproveTransaction"
                type="checkbox"
                className="form-check-input"
              />
              <label
                className="form-check-label"
                htmlFor="canApproveTransaction"
              >
                Guardian approved transactions
              </label>
            </div>
            <div className="pt-2 pb-2">
              <button
                className="btn rounded-pill btn-r-bank-highlight text-rb-bank-primary"
                type="button"
              >
                Remove guardian
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Step4 = ({ user, guardians, setOnboardingStep, addGuardian }) => {
  const [formData, setFormData] = useState({});

  const { smartvault } = useContext(SmartVaultContext);
  const zero = "0x0000000000000000000000000000000000000000";

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hns = formData.guardianName + ".crazy.one";
    const address = await smartvault.harmonyClient.ens.name(hns).getAddress();
    const guardian = {
      hns: hns,
      address: address,
      canApproveTransaction: false,
      canRestoreAccount: true,
    };

    // TODO: Check if hns not already in guardians.hns
    if (address !== zero) {
      addGuardian(guardian);
    }
  };

  const handleClick = () => {
    setOnboardingStep(5);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      // Trimming any whitespace
      [e.target.name]: e.target.value.trim(),
    });
  };

  return (
    <div className="bg-white align-content-center border-top border-no-bank-grayscale-titanium justify-content-start pt-5 pe-5 ps-4 h-100">
      <div className="d-flex mb-5 ps-2 pt-3 pe-3">
        <div>
          {" "}
          <div className="fs-6 text-no-bank-grayscale-iron text-uppercase">
            step 4
          </div>
          <div className="fs-1 text-no-bank-primary">
            Fortify wallet security{" "}
          </div>
          <div className="d-flex justify-content-start pt-5 pb-2">
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
          <div className="justify-content-start pt-3">
            <div>
              {guardians.length > 0 && (
                <div>
                  <p className="text-r-bank-grayscale-iron pt-3">
                    Added guardians{" "}
                  </p>
                  {guardians.map((guardian) => {
                    return <RenderAccordion guardian={guardian} />;
                  })}
                </div>
              )}
            </div>

            <p className="text-r-bank-grayscale-iron pt-3">
              Who would you want to add?
            </p>

            <input
              type="text"
              className="form-control my-3"
              id="guardianName"
              name="guardianName"
              placeholder="Please enter a guardian's username or address"
              onChange={handleChange}
              required
            />
            <button
              className="btn btn-outline-dark rounded-pill"
              type="button"
              onClick={handleSubmit}
            >
              Add
            </button>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-end pe-5 pb-3 fixed-bottom">
        <div className="pe-3 pb-3">
          <button
            type="button"
            onClick={handleClick}
            className="btn rounded-pill btn-no-bank-highlight text-rb-bank-primary"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

const mapToProps = ({ user, guardians }) => ({ user, guardians });
export default connect(mapToProps, actions)(Step4);
