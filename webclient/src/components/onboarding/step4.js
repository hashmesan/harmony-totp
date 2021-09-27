import React, { useState, useContext } from "react";
import { connect } from "redux-zero/react";
const web3utils = require("web3-utils");
const { toBech32, fromBech32 } = require("@harmony-js/crypto");
import { Link } from "react-router-dom";

import { SmartVaultContext } from "../../context/SmartvaultContext";

import actions from "../../redux/actions";

import AddGuardian from "../../../public/add_guardian.svg";
import AddFriend from "../../../public/add_friend.svg";

const RenderAccordionGuardians = ({
  guardians,
  deleteGuardian,
  updateGuardian,
}) => {
  return (
    <div className="accordion" id="accordionGuardians">
      {guardians.map((guardian) => {
        const handleClick = (evt) => {
          const { value, checked } = evt.target;
          const currentGuardian = guardian;
          currentGuardian[value] = checked;
          updateGuardian(currentGuardian);
        };

        const handleChangeAmount = (evt) => {
          const { value } = evt.target;
          const currentGuardian = guardian;
          currentGuardian.amountOfTransToApprove = value;
          updateGuardian(currentGuardian);
        };

        return (
          <div className="accordion-item" key={guardian.address}>
            <h2 className="accordion-header" id={`Heading${guardian.address}`}>
              <button
                className="accordion-button bg-no-bank-white p-3"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#Collapse${guardian.address}`}
                aria-expanded="false"
                aria-controls={`Collapse${guardian.address}`}
              >
                <div>
                  <p className="text-no-bank-primary pt-2 pb-1 m-0">
                    <strong>{guardian.hns}</strong>
                  </p>
                  <table>
                    <tbody>
                      <tr className="text-no-bank-grayscale-iron pt-1 pb-2 m-0">
                        <td>ONE</td>
                        <td> </td>
                        <td className="ps-3">{toBech32(guardian.address)}</td>
                      </tr>
                      <tr className="text-no-bank-grayscale-iron pt-1 pb-2 m-0">
                        <td>Ethereum</td>
                        <td> </td>
                        <td className="ps-3">{guardian.address}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </button>
            </h2>
            <div
              id={`Collapse${guardian.address}`}
              className="accordion-collapse collapse"
              aria-labelledby={`Heading${guardian.address}`}
              data-bs-parent="#accordionGuardians"
            >
              <div className="accordion-body p-3">
                <div className="form-check form-switch m-0 pt-2 pb-3">
                  <input
                    id={`canRestoreAccount${guardian.address}`}
                    type="checkbox"
                    value="canRestoreAccount"
                    className="form-check-input"
                    data-onstyle="primary"
                    defaultChecked="true"
                    onClick={handleClick}
                  />
                  <label
                    className="form-check-label ps-3"
                    htmlFor={`canRestoreAccount${guardian.address}`}
                  >
                    <div>Authorization to restore account</div>
                    <div className="text-no-bank-grayscale-iron">
                      This will allow your guardian to restore your account,
                      should you forget or loose your credentials.
                    </div>
                  </label>
                </div>
                <div className="form-check form-switch m-0 pt-2 pb-3">
                  <input
                    id={`canApproveTransaction${guardian.address}`}
                    type="checkbox"
                    value="canApproveTransaction"
                    className="form-check-input"
                    onClick={handleClick}
                  />
                  <label
                    className="form-check-label pb-3 ps-3"
                    htmlFor={`canApproveTransaction${guardian.address}`}
                  >
                    <div>Guardian approved transactions</div>
                    <div className="text-no-bank-grayscale-iron">
                      Your guardian will have to approve transaction over a
                      defined amount by you, to prevent unrightful transfers.
                    </div>
                  </label>
                  <div className="ps-3">
                    <input
                      id={`amountOfTransApprove${guardian.address}`}
                      type={`${
                        guardian.canApproveTransaction ? "text" : "hidden"
                      }`}
                      placeholder="Amount in CHF"
                      className="text-no-bank-grayscale-iron border border-no-bank-grayscale-titanium p-2"
                      onChange={handleChangeAmount}
                    />
                  </div>
                </div>
                <div className="pt-2 pb-2 d-flex justify-content-end">
                  <button
                    className="btn rounded-pill btn-outline-no-bank-white text-no-bank-grayscale-iron"
                    type="button"
                    onClick={() => deleteGuardian(guardian)}
                  >
                    Remove guardian
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const RenderAccordionFriends = ({ friends, deleteFriend }) => {
  return (
    <div className="accordion" id="accordionFriends">
      {friends.map((friend) => {
        return (
          <div className="accordion-item" key={friend.address}>
            <h2 className="accordion-header" id={`Heading${friend.address}`}>
              <button
                className="accordion-button bg-no-bank-white p-3"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#Collapse${friend.address}`}
                aria-expanded="false"
                aria-controls={`Collapse${friend.address}`}
              >
                <div>
                  <p className="text-no-bank-primary pt-2 pb-1 m-0">
                    <strong>{friend.hns}</strong>
                  </p>
                  <table>
                    <tbody>
                      <tr className="text-no-bank-grayscale-iron pt-1 pb-2 m-0">
                        <td>ONE</td>
                        <td> </td>
                        <td className="ps-3">{toBech32(friend.address)}</td>
                      </tr>
                      <tr className="text-no-bank-grayscale-iron pt-1 pb-2 m-0">
                        <td>Ethereum</td>
                        <td> </td>
                        <td className="ps-3">{friend.address}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </button>
            </h2>
            <div
              id={`Collapse${friend.address}`}
              className="accordion-collapse collapse"
              aria-labelledby={`Heading${friend.address}`}
              data-bs-parent="#accordionFriends"
            >
              <div className="accordion-body p-3">
                <div className="pt-2 pb-2 d-flex justify-content-end">
                  <button
                    className="btn rounded-pill btn-outline-no-bank-white text-no-bank-grayscale-iron"
                    type="button"
                    onClick={() => deleteFriend(friend)}
                  >
                    Remove friend
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const ConnectedAccordionGuardians = connect(
  mapToProps,
  actions
)(RenderAccordionGuardians);
const ConnectedAccordionFriends = connect(
  mapToProps,
  actions
)(RenderAccordionFriends);

const Step4 = ({
  guardians,
  friends,
  setOnboardingStep,
  addGuardian,
  addFriend,
}) => {
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState("");

  const { smartvault } = useContext(SmartVaultContext);
  const zero = "0x0000000000000000000000000000000000000000";

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hns = formData.guardianName + ".crazy.one";
    const address = await smartvault.harmonyClient.ens.name(hns).getAddress();
    const guardian = {
      hns: hns,
      address: address,
      canRestoreAccount: true,
      canApproveTransaction: false,
      amountOfTransToApprove: 0,
    };

    let msg = "";
    if (address !== zero) {
      if (guardians.filter(({ hns }) => hns == guardian.hns).length == 0) {
        msg = " ";
        addGuardian(guardian);
      } else {
        msg = "Guardian is already added";
      }
    } else {
      msg = "Field is empty. Please choose a HNS or no-bank username";
    }
    setMessage(msg);
  };

  const handleSubmitF = async (e) => {
    e.preventDefault();

    const hns = formData.friendName + ".crazy.one";
    const address = await smartvault.harmonyClient.ens.name(hns).getAddress();
    const friend = {
      hns: hns,
      address: address,
    };

    let msg = "";
    if (address !== zero) {
      if (friends.filter(({ hns }) => hns == friend.hns).length == 0) {
        msg = "";
        addFriend(friend);
      } else {
        msg = "Friend is already added.";
      }
    } else {
      msg = "Field is empty. Please choose a HNS or no-bank username";
    }
    setMessage(msg);
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
              src={AddGuardian}
              height="96"
              width="120"
              className="me-3 bg-no-bank-secondary-lemon"
              alt=""
            />{" "}
            <div>
              <p className="fw-bold m-0 pb-2">Add a guardian</p>
              <p className="m-0 pb-3">
                Guardians are people you trust. They will not have access to
                your funds but enable safety features such as wallet recovery
                and blocking of unexpected transfers. You decide what they can
                do.
              </p>
              <div className="pt-2">
                <button
                  className="btn btn-outline-dark rounded-pill"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#addNowModal"
                >
                  Add Now
                </button>
              </div>
            </div>
          </div>
          <hr />
          <div className="d-flex justify-content-start pt-2 pb-2">
            <img
              src={AddFriend}
              height="96"
              width="120"
              className="me-3"
              alt=""
            />{" "}
            <div>
              <p className="fw-bold m-0 pb-2">Add friends</p>
              <p className="m-0 pb-3">
                Add friends to your account! This enables convenient peer to
                peer transfers and reduces the risk of sending money to a wrong
                address. Of course you can also invite your friends to <u>no</u>
                bank.
              </p>
              <div className="pt-2">
                <button
                  className="btn btn-outline-dark rounded-pill"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#addNowModal"
                >
                  Add Now
                </button>
              </div>
            </div>
          </div>
          {/* Modal */}
          <div
            className="modal fade"
            id="addNowModal"
            tabIndex="-1"
            aria-labelledby="addNowModalLabel"
            aria-hidden="false"
          >
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
              <div className="modal-content">
                <div className="modal-header border-bottom-0">
                  <div
                    className="fs-2 modal-title fw-bold text-no-bank-grayscale-iron"
                    id="addNowModalLabel"
                  >
                    Add Now
                  </div>
                </div>
                <div className="modal-body">
                  <div className="border-top mx-n3 my-0" />
                  <nav
                    className="nav nav-pills nav-justified mx-n3"
                    id="tabContent"
                  >
                    <a
                      id="guardiansTab"
                      className="nav-link active"
                      data-bs-toggle="tab"
                      data-bs-target="#guardians"
                      style={{ cursor: "pointer" }}
                    >
                      Guardians
                    </a>

                    <a
                      id="friendsTab"
                      className="nav-link"
                      data-bs-toggle="tab"
                      data-bs-target="#friends"
                      style={{ cursor: "pointer" }}
                    >
                      Friends
                    </a>
                  </nav>
                  <div className="border-top mx-n3 my-0 pb-3" />

                  <div className="tab-content">
                    <div className="tab-pane active" id="guardians">
                      <div
                        className={`input-group ${
                          message.length > 1 ? "pt-3" : "py-3"
                        }`}
                      >
                        <input
                          type="text"
                          className="form-control m-0 text-no-bank-grayscale-iron"
                          id="guardianName"
                          name="guardianName"
                          placeholder="HNS or no-bank username"
                          onChange={handleChange}
                          required
                        />
                        <button
                          className="btn btn-no-bank-highlight text-rb-bank-primary rounded-pill ms-3"
                          type="button"
                          id="addGuardianButton"
                          onClick={handleSubmit}
                        >
                          Add
                        </button>
                      </div>
                      <small
                        className="form-text text-danger pb-3"
                        id="messageGuardianInput"
                      >
                        {message}
                      </small>

                      <div className="border-top mx-n3 my-3" />
                      <div>
                        <p className="text-no-bank-grayscale-iron fw-bolder pt-2">
                          Your Guardians{" "}
                        </p>
                        {guardians.length > 0 && (
                          <div>
                            <ConnectedAccordionGuardians />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="tab-pane" id="friends">
                      <div
                        className={`input-group ${
                          message.length > 1 ? "pt-3" : "py-3"
                        }`}
                      >
                        <input
                          type="text"
                          className="form-control m-0 text-no-bank-grayscale-iron"
                          id="friendName"
                          name="friendName"
                          placeholder="HNS or no-bank username"
                          onChange={handleChange}
                          required
                        />
                        <button
                          className="btn btn-no-bank-highlight text-rb-bank-primary rounded-pill ms-3"
                          type="button"
                          id="addFriendsButton"
                          onClick={handleSubmitF}
                        >
                          Add
                        </button>
                      </div>
                      <small
                        className="form-text text-danger pb-3"
                        id="messageFriendInput"
                      >
                        {message}
                      </small>
                      <div className="border-top mx-n3 my-3" />
                      <div>
                        <p className="text-no-bank-grayscale-iron fw-bolder pt-2">
                          Your Friends{" "}
                        </p>
                        {friends.length > 0 && (
                          <div>
                            <ConnectedAccordionFriends />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top-0">
                  <button
                    type="button"
                    className="btn btn-outline-dark rounded-pill"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-end pe-5 pb-3 fixed-bottom">
        <div className="pe-3 pb-3">
          <Link to="/onboard/5">
            <button
              type="button"
              onClick={handleClick}
              className="btn rounded-pill btn-no-bank-highlight text-rb-bank-primary"
            >
              Continue
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const mapToProps = ({ guardians, friends }) => ({ guardians, friends });

export default connect(mapToProps, actions)(Step4);
