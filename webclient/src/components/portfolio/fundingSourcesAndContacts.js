import React, { useState, useEffect, useContext } from "react";
import { connect } from "redux-zero/react";
import actions from "../../redux/actions";
import AddGuardianFriendModal from "./addGuardianFriendModal";
import ListGuardianFriends from "./listGuardianFriends";
import ListFundingSources from "./listFundingSources";
import AddFundingSourceModal from "./addFundingSourceModal";
//import { SmartVaultContext } from "../../context/SmartvaultContext";

//const { toBech32, fromBech32 } = require("@harmony-js/crypto");

const fundingSourcesAndContacts = () => {
  return (
    <div className="container-fluid">
      <nav className="nav nav-pills nav-justified mx-n4" id="tabContent">
        <a
          id="fundingSourcesTab"
          className="nav-link"
          data-bs-toggle="tab"
          data-bs-target="#fundingSources"
          style={{ cursor: "pointer" }}
        >
          Funding sources
        </a>

        <a
          id="guardiansAndFriendsTab"
          className="nav-link active"
          data-bs-toggle="tab"
          data-bs-target="#guardiansAndFriends"
          style={{ cursor: "pointer" }}
        >
          Guardians {"&"} Friends
        </a>
      </nav>
      <div className="border-top mx-n4 my-0 pb-3" />
      <div className="tab-content">
        <div className="tab-pane" id="fundingSources">
          <div className="d-flex align-items-center justify-content-between">
            <div className="fs-4 text-no-bank-grayscale-iron">
              Your funding sources
            </div>
            <div className="modal-footer border-top-0 px-0">
              <button
                type="button"
                className="btn btn-outline-dark rounded-pill mx-0"
                data-bs-toggle="modal"
                data-bs-target="#addFundingSourceModal"
              >
                + Add
              </button>
            </div>
            <AddFundingSourceModal />
          </div>
          <div>
            <ListFundingSources />
          </div>
        </div>
        <div className="tab-pane active" id="guardiansAndFriends">
          <div className="d-flex align-items-center justify-content-between">
            <div className="fs-4 text-no-bank-grayscale-iron">
              Your guardians {"&"} friends
            </div>
            <div className="modal-footer border-top-0 px-0">
              <button
                type="button"
                className="btn btn-outline-dark rounded-pill mx-0"
                data-bs-toggle="modal"
                data-bs-target="#addGuardianFriendModal"
              >
                + Add
              </button>
            </div>
            <AddGuardianFriendModal />
          </div>
          <div>
            <ListGuardianFriends />
          </div>
        </div>
      </div>
    </div>
  );
};

const mapToProps = ({}) => ({});
export default connect(mapToProps, actions)(fundingSourcesAndContacts);
