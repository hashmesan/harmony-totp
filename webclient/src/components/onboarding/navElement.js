import React from "react";
import { connect } from "redux-zero/react";
import styled from "@emotion/styled";
import { useRouteMatch, useHistory } from "react-router-dom";
import actions from "../../redux/actions";

const Number = styled.div((props) => ({
  width: "2em",
  height: "2em",
  boxSizing: "initial",

  background: props.filled ? "#06232D" : "#efefee",
  border: props.filled ? "0.1em solid #06232D" : "0.1em solid #92918f",
  color: props.filled ? "#fff" : "#92918f",
  textAlign: "center",
  borderRadius: "50%",

  lineHeight: "2em",
  boxSizing: "content-box",

  marginRight: "2em",
}));

const NavElement = ({ onboardingStep, setOnboardingStep, nr, text, title }) => {
  const history = useHistory();
  const { url } = useRouteMatch();

  const isActive = onboardingStep == nr;

  const handleClick = () => {
    setOnboardingStep(nr);
    history.push(`${url}/${nr}`);
  };

  return (
    <div>
      <div
        className="d-flex align-items-start"
        style={{ cursor: "pointer" }}
        onClick={handleClick}
      >
        <Number filled={isActive && "filled"} className="fs-6 flex-shrink-0">
          {nr}
        </Number>
        <div className="d-flex align-items-start flex-column">
          <span
            className={!isActive ? "text-no-bank-grayscale-iron" : "fw-bold"}
          >
            {title}
          </span>
          {isActive && <div>{text}</div>}
        </div>
      </div>
    </div>
  );
};

const mapToProps = ({ onboardingStep }) => ({ onboardingStep });
export default connect(mapToProps, actions)(NavElement);
