import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "redux-zero/react";
import styled from "@emotion/styled";

import actions from "../redux/actions";
import { getLocalWallet } from "../config";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { showNav: false };
    this.toggleNav = this.toggleNav.bind(this);
  }

  toggleNav() {
    this.setState({
      showNav: !this.state.showNav,
    });
  }

  render() {
    const { showNav } = this.state;

    return (
      <React.Fragment>
        <nav className="navbar navbar-expand-lg bg-r-bank-blue navbar-dark py-3 sticky-top d-flex">
          <div className="container-fluid">
            <Link to="/" className="navbar-brand">
              <img
                src="logo_R.svg"
                alt=""
                className="img-fluid m-1"
                width="40px"
              />
            </Link>
            <Link to="/" className="navbar-brand">
              <h1 className="text-light mb-0">The R Bank</h1>
            </Link>

            <button
              className="navbar-toggler"
              type="button"
              onClick={this.toggleNav}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className={(showNav ? "show" : "") + " collapse navbar-collapse"}
            >
              <ul className="navbar-nav ms-auto px-5 text-end">
                <li className="nav-item">
                  <Link to="/" className="nav-link fs-5">
                    Mission & Vision
                  </Link>
                </li>
                <li className="nav-item ">
                  <Link to="/" className="nav-link fs-5">
                    Team
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/" className="nav-link fs-5">
                    Whatever
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/login" className="nav-link active fs-5">
                    Login
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </React.Fragment>
    );
  }
}

const mapToProps = ({ environment }) => ({ environment });
export default connect(mapToProps, actions)(Header);

/*
<li className="nav-item">
                  <select
                    className="form-select"
                    aria-label="Network selection"
                    value={this.props.environment}
                    onChange={this.handleChange.bind(this)}
                  >
                    <option value="mainnet0">Mainnet</option>
                    <option value="testnet0">Testnet</option>
                    <option value="development">Local</option>
                  </select>
                </li>

*/
