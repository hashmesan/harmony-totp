import React, { useState, useEffect, useContext } from "react";
import { connect } from "redux-zero/react";
import actions from "../../redux/actions";
import AddGuardianFriendModal from "./addGuardianFriendModal";
import { SmartVaultContext } from "../../context/SmartvaultContext";

const { toBech32, fromBech32 } = require("@harmony-js/crypto");

const listGuardianFriends = ({ guardians, friends }) => {
  return (
    <ul className="list-group">
      {guardians.map((guardian) => {
        return (
          <li
            className="list-group-item border-start-0 border-end-0 px-0"
            key={`Guard_${guardian.hns.split(".", 1)}`}
          >
            <div className="d-flex align-items-center">
              <span className="text-no-bank-primary fw-bolder">
                {guardian.hns.split(".", 1)}
              </span>
              <span className="badge bg-no-bank-grayscale-titanium rounded-pill text-no-bank-primary fw-light px-2 ms-2">
                Guardian
              </span>
              <i className="bi bi-three-dots-vertical ms-auto text-no-bank-greyscale-iron"></i>
            </div>
          </li>
        );
      })}

      {friends.map((friend) => {
        return (
          <li
            className="list-group-item d-flex align-items-center border-start-0 border-end-0 px-0"
            key={`Friend_${friend.hns.split(".", 1)}`}
          >
            <span className="text-no-bank-primary fw-bolder">
              {friend.hns.split(".", 1)}{" "}
            </span>
            <i className="bi bi-three-dots-vertical ms-auto text-no-bank-greyscale-iron"></i>
          </li>
        );
      })}
    </ul>
  );
};

const mapToProps = ({ guardians, friends }) => ({ guardians, friends });
export default connect(mapToProps, actions)(listGuardianFriends);
