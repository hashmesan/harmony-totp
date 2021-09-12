import React, { useState, useContext } from "react";
import { connect } from "redux-zero/react";
import { Collapse } from "bootstrap";
const web3utils = require("web3-utils");

import { SmartVaultContext } from "../smartvault_provider";

import actions from "../../redux/actions";

const Step4 = ({ user, setOnboardingStep }) => {
  const [formData, setFormData] = useState({});
  const [guardians, setGuardians] = useState([]);
  const [isValid, setValidity] = useState(null);

  const { smartvault } = useContext(SmartVaultContext);
  const zero = "0x0000000000000000000000000000000000000000";

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hns = formData.guardianName + ".crazy.one";
    const address = await smartvault.harmonyClient.ens.name(hns).getAddress();
    const balance = await smartvault.harmonyClient.getBalance(address);
    const guardian = {
      hns: hns,
      address: address,
      balance: balance,
    };

    console.log("address: ", address);

    // TODO: Check if hns not already in guardians.hns
    if (address !== zero) {
      setGuardians((prev) => [...prev, guardian]);
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
    <div className="bg-white align-content-center border-top border-r-bank-grayscale-titanium justify-content-start pt-5 pe-5 ps-4 vh-100">
      <div className="d-flex mb-5 ps-2 pt-3 pe-3">
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
          {guardians.length > 0 && (
            <div>
              <p className="text-r-bank-grayscale-iron pt-3">
                Added guardians{" "}
              </p>
              {guardians.map((guardian) => {
                return (
                  <div key={guardian.hns}>
                    Hello {guardian.hns} - {guardian.balance}
                  </div>
                );
              })}
            </div>
          )}
          <div className="justify-content-start pt-3">
            <p className="text-r-bank-grayscale-iron pt-5">
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
            className="btn rounded-pill btn-r-bank-highlight text-rb-bank-primary"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

const mapToProps = ({ user }) => ({ user });
export default connect(mapToProps, actions)(Step4);
