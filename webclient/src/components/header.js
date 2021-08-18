import React, { Component } from "react";
import { connect } from "redux-zero/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import actions from "../redux/actions";
import { getLocalWallet } from "../config";
import styled from "@emotion/styled";

const Progress = styled.div`
  display: flex;
  align-items: center;
`;

const Line = styled.span`
  width: 120px;
  height: 6px;
  background: #63d19e;
`;

const Steps = styled.div`
  display: flex;
  background-color: #63d19e;
  color: #fff;
  font-size: 14px;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
`;
class Header extends Component {
  render() {
    return (
      <div className="container d-flex justify-content-center align-items-center">
        <Progress>
          <Steps>
            {" "}
            <span>
              <FontAwesomeIcon icon="check" />
            </span>{" "}
          </Steps>{" "}
          <Line />
          <Steps>
            {" "}
            <span>
              <FontAwesomeIcon icon="check" />
            </span>{" "}
          </Steps>{" "}
          <Line />
          <Steps>
            {" "}
            <span className="font-weight-bold">3</span>{" "}
          </Steps>
        </Progress>
      </div>
    );
  }
}

const mapToProps = ({ environment }) => ({ environment });
export default connect(mapToProps, actions)(Header);
