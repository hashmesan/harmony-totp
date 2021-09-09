import React, { useState, useContext } from "react";
import { connect } from "redux-zero/react";
import { Collapse } from "bootstrap";

import { SmartVaultContext } from "../smartvault_provider";

import actions from "../../redux/actions";

const Step4 = ({ user }) => {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [guardians, setGuardians] = useState([]);
  const [collapsed, setCollapsed] = useState(false);

  const setField = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });
    // Check and see if errors exist, and remove them from the error object:
    if (!!errors[field])
      setErrors({
        ...errors,
        [field]: null,
      });
  };

  const { smartvault } = useContext(SmartVaultContext);

  const handleAdd = async (e) => {
    const hns = "renaissancebank.crazy.one";
    console.log(smartvault);
    const address = await smartvault.harmonyClient.ens.name(hns).getAddress();

    console.log("address: ", address);
  };

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
          {guardians.length > 0 && (
            <div>
              <p className="text-r-bank-grayscale-iron pt-3">
                Added guardians{" "}
              </p>
              <div
                className={(collapsed ? "show" : "") + "collapse"}
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
              onClick={handleAdd}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapToProps = ({ user }) => ({ user });
export default connect(mapToProps, actions)(Step4);
