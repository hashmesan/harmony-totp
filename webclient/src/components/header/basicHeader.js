//import basic stuff
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "redux-zero/react";

//import actions
import actions from "../../redux/actions";

//import static artefacts
import LogoBlack from "../../../public/logo_no_black.svg";

const BasicHeader = ({ location }) => {
  const [showNav, setShowNav] = useState(false);

  const toggleNav = () => {
    setShowNav({
      showNav: !showNav,
    });
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-white py-3 sticky-top d-flex">
        <div className="container-fluid justify-content-start">
          <Link to="/" className="navbar-brand">
            <img src={LogoBlack} alt="" className="img-fluid m-1 h-75" />
          </Link>
          <button
            className="navbar-toggler ms-auto"
            type="button"
            onClick={toggleNav}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          {location !== "Onboarding" && (
            <div
              className={(showNav ? "show" : "") + "collapse navbar-collapse"}
            >
              <ul className="navbar-nav ms-auto px-1 text-end">
                <li className="nav-item">
                  <Link to="/" className="nav-link active fs-6">
                    Home
                  </Link>
                </li>
                <li className="nav-item ">
                  <Link to="/" className="nav-link active fs-6">
                    Features
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/" className="nav-link active fs-6">
                    Pricing
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/about" className="nav-link active fs-6">
                    About
                  </Link>
                </li>
              </ul>
              <Link to="/portfolio">
                <button className="btn btn-outline-dark rounded-pill fs-6 px-3 mx-1">
                  Login
                </button>
              </Link>
              <Link to="/onboard">
                <button
                  className="btn btn-no-bank-highlight rounded-pill fs-6 px-3 mx-1"
                  type="button"
                >
                  Onboard
                </button>
              </Link>
            </div>
          )}
          {location == "Onboarding" && (
            <div className="text-secondary fs-6 ">{location}</div>
          )}
        </div>
      </nav>
    </div>
  );
};

const mapToProps = ({ location }) => ({ location });
export default connect(mapToProps, actions)(BasicHeader);
