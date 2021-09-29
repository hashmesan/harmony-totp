//import basic stuff
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { connect } from "redux-zero/react";
import { getAuth, signOut } from "firebase/auth";

//import actions
import actions from "../../redux/actions";

//import static artefacts
import LogoBlack from "../../../public/logo_no_black.svg";

const AuthenticatedHeader = () => {
  const [showNav, setShowNav] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;
  let history = useHistory();

  const toggleNav = () => {
    console.log("toggling nav: ", showNav);
    setShowNav(!showNav);
  };

  const handleClick = async () => {
    await auth.signOut();

    history.push("/landing");
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-no-bank-highlight py-3 sticky-top d-flex">
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
          <div className={(showNav ? "show" : "") + "collapse navbar-collapse"}>
            <ul className="navbar-nav ms-auto px-1 text-end">
              <li className="nav-item">
                <Link to="/portfolio" className="nav-link active fs-6">
                  Home
                </Link>
              </li>
              <li className="nav-item ">
                <Link to="/" className="nav-link active fs-6">
                  Portfolio
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/" className="nav-link active fs-6">
                  Markets
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/" className="nav-link active fs-6">
                  Products
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/token/0xcf664087a5bb0237a0bad6742852ec6c8d69a27a"
                  className="nav-link active fs-6"
                >
                  Transactions
                </Link>
              </li>
              <li className="nav-item ps-5">
                <Link to="/" className="nav-link active">
                  <i className="bi bi-bell" style={{ size: "80px" }} />
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/" className="nav-link active">
                  <i
                    className="bi bi-person bg-no-bank-highlight"
                    onClick={handleClick}
                  />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

const mapToProps = ({ location }) => ({ location });
export default connect(mapToProps, actions)(AuthenticatedHeader);

/*<div>
            <h1>Welcome {user?.email}</h1>
            <button onClick={handleClick}>Sign out</button>
          </div>*/
