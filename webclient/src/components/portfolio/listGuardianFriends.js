import React, { useState, useEffect, useContext } from "react";
import { connect } from "redux-zero/react";
import actions from "../../redux/actions";
import AddGuardianFriendModal from "./addGuardianFriendModal";
import { SmartVaultContext } from "../../context/SmartvaultContext";
import SendONEModal from "./sendONEModal";

const { toBech32, fromBech32 } = require("@harmony-js/crypto");

const listGuardianFriends = ({ guardians, friends }) => {
  const [selected, setSelected] = useState("");

  return (
    <div>
      <ul className="list-group">
        {guardians.map((el) => {
          return (
            <li
              className="list-group-item border-start-0 border-end-0 px-0"
              key={`Guard_${el.hns.split(".", 1)}`}
            >
              <div className="d-flex align-items-center">
                <span className="text-no-bank-primary fw-bolder">
                  {el.hns.split(".", 1)}
                </span>
                <span className="badge bg-no-bank-grayscale-titanium rounded-pill text-no-bank-primary fw-light px-2 ms-2">
                  Guardian
                </span>
                <i
                  onClick={() => setSelected(el)}
                  data-bs-toggle="modal"
                  data-bs-target="#sendONEModal"
                  style={{ cursor: "pointer" }}
                  className="bi bi-three-dots-vertical ms-auto text-no-bank-greyscale-iron"
                ></i>
              </div>
            </li>
          );
        })}
        {friends.map((el) => {
          return (
            <li
              className="list-group-item d-flex align-items-center border-start-0 border-end-0 px-0"
              key={`Friend_${el.hns.split(".", 1)}`}
            >
              <span className="text-no-bank-primary fw-bolder">
                {el.hns.split(".", 1)}{" "}
              </span>
              <i
                onClick={() => setSelected(el)}
                data-bs-toggle="modal"
                data-bs-target="#sendONEModal"
                style={{ cursor: "pointer" }}
                className="bi bi-three-dots-vertical ms-auto text-no-bank-greyscale-iron"
              ></i>
            </li>
          );
        })}
      </ul>
      <SendONEModal selected={selected} />
    </div>
  );
};

const mapToProps = ({ guardians, friends }) => ({ guardians, friends });
export default connect(mapToProps, actions)(listGuardianFriends);
