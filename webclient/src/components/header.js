import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "redux-zero/react";

import actions from "../redux/actions";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { showNav: false };
    this.toggleNav = this.toggleNav.bind(this);
  }

  componentDidMount() {
    this.props.setEnvironment("testnet0");
  }

  toggleNav() {
    this.setState({
      showNav: !this.state.showNav,
    });
  }

  render() {
    const { showNav } = this.state;
    const { location, user } = this.props;

    console.log("state store: ", user);

    return (
      <React.Fragment>
        <nav className="navbar navbar-expand-lg navbar-light bg-white py-3 border-bottom border-r-bank-grayscale-titanium sticky-top d-flex">
          <div className="container-fluid justify-content-start">
            <Link to="/" className="navbar-brand">
              <img
                src="public/logo_R.svg"
                alt=""
                className="img-fluid m-1 h-75"
              />
            </Link>
            {location !== "landing" && (
              <div className="text-secondary fs-5 ">{location}</div>
            )}
            <button
              className="navbar-toggler"
              type="button"
              onClick={this.toggleNav}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            {location == "landing" && (
              <div
                className={
                  (showNav ? "show" : "") + " collapse navbar-collapse"
                }
              >
                <ul className="navbar-nav ms-auto px-1 text-end">
                  <li className="nav-item">
                    <Link to="/" className="nav-link active fs-5">
                      Home
                    </Link>
                  </li>
                  <li className="nav-item ">
                    <Link to="/" className="nav-link active fs-5">
                      Features
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/" className="nav-link active fs-5">
                      Pricing
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/" className="nav-link active fs-5">
                      About
                    </Link>
                  </li>
                </ul>
                <Link to="/onboard">
                  <button className="btn btn-outline-dark rounded-pill fs-5 px-3 mx-1">
                    Login
                  </button>
                </Link>
                <Link to="/onboard">
                  <button
                    className="btn btn-warning rounded-pill fs-5 px-3 mx-1"
                    type="button"
                  >
                    Onboard
                  </button>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </React.Fragment>
    );
  }
}

const mapToProps = ({ environment, location, user }) => ({
  environment,
  location,
  user,
});
export default connect(mapToProps, actions)(Header);
