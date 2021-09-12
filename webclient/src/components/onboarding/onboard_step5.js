import React, { useContext, useState } from "react";
import { connect } from "redux-zero/react";
import { Modal } from "bootstrap";
const web3utils = require("web3-utils");

import { SmartVaultContext } from "../smartvault_provider";

import actions from "../../redux/actions";

const Step5 = ({ user }) => {
  const [balance, setBalance] = useState(0);

  const [createFee, setCreateFee] = useState(0);
  const [rentPrice, setRentPrice] = useState(0);
  const [totalFee, setTotalFee] = useState(0);
  const [walletAddress, setWalletAddress] = useState(0);

  const [deposits, setDeposits] = useState("0");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  const { smartvault } = useContext(SmartVaultContext);

  const checkBalance = async () => {
    const depositInfo = await smartvault.getDepositInfo();
    setCreateFee(depositInfo.createFee);
    setRentPrice(depositInfo.rentPrice);
    setTotalFee(depositInfo.totalFee);
    setWalletAddress(depositInfo.walletAddress);

    const balance = await smartvault.harmonyClient.getBalance(walletAddress);
    console.log("balance: ", balance);

    const submit = await smartvault.submitWallet();
  };

  return (
    <div className="bg-white align-content-center border-top border-r-bank-grayscale-titanium justify-content-start pt-5 pe-5 ps-4 vh-100">
      <div className="d-flex flex-column mb-5 ps-2 pt-3 pe-3">
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
                  Modal title: {user.userName}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p>createFee: {createFee}</p>
                <p>rentPrice: {rentPrice}</p>
                <p>totalFee: {totalFee}</p>
                <p>walletAddress: {walletAddress}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={checkBalance}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Accordion */}
        <div className="accordion" id="accordionExample">
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingOne">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
                aria-expanded="true"
                aria-controls="collapseOne"
              >
                Accordion Item #1
              </button>
            </h2>
            <div
              id="collapseOne"
              className="accordion-collapse collapse show"
              aria-labelledby="headingOne"
              data-bs-parent="#accordionExample"
            >
              <div className="accordion-body">
                <strong>This is the first item's accordion body.</strong> It is
                shown by default, until the collapse plugin adds the appropriate
                classes that we use to style each element. These classes control
                the overall appearance, as well as the showing and hiding via
                CSS transitions. You can modify any of this with custom CSS or
                overriding our default variables. It's also worth noting that
                just about any HTML can go within the{" "}
                <code>.accordion-body</code>, though the transition does limit
                overflow.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapToProps = ({ user }) => ({ user });
export default connect(mapToProps, actions)(Step5);
