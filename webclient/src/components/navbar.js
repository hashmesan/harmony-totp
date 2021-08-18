import React, { Component } from "react";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";
import styled from "@emotion/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { connect } from "redux-zero/react";
import actions from "../redux/actions";
import { getLocalWallet } from "../config";

class Navbar extends Component {
  handleChange(e) {
    e.preventDefault();
    this.props.setEnvironment(e.target.value);
  }

  render() {
    console.log(this.props);
    const hasWallet =
      getLocalWallet(this.props.environment) &&
      JSON.parse(getLocalWallet(this.props.environment)).created == true;

    return (
      <React.Fragment>
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            <span className="fs-5 d-none d-sm-inline d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
              Menu
            </span>
            <ul
              className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
              id="menu"
            >
              <li className="nav-item">
                <Link to="/" className="nav-link align-middle px-0">
                  <FontAwesomeIcon icon="home" />
                  <span className="ms-1 d-none d-sm-inline">Home</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/recover" className="nav-link align-middle px-0">
                  <FontAwesomeIcon icon="chart-pie" />
                  <span className="ms-1 d-none d-sm-inline">Portfolio</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/recover" className="nav-link align-middle px-0">
                  <FontAwesomeIcon icon="exchange-alt" />
                  <span className="ms-1 d-none d-sm-inline">Trade</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/recover" className="nav-link align-middle px-0">
                  <FontAwesomeIcon icon="piggy-bank" />
                  <span className="ms-1 d-none d-sm-inline">Save & Earn</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/" className="nav-link align-middle px-0">
                  <FontAwesomeIcon icon="history" />
                  <span className="ms-1 d-none d-sm-inline">
                    Transaction History
                  </span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/" className="nav-link align-middle px-0">
                  <FontAwesomeIcon icon="ambulance" />
                  <span className="ms-1 d-none d-sm-inline">Support</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/" className="nav-link align-middle px-0">
                  <FontAwesomeIcon icon="cogs" />
                  <span className="ms-1 d-none d-sm-inline">Settings</span>
                </Link>
              </li>
              <li>
                <select
                  value={this.props.environment}
                  onChange={this.handleChange.bind(this)}
                >
                  <option value="mainnet0">Mainnet(Shard 0)</option>
                  <option value="testnet0">Testnet(Shard 0)</option>
                  <option value="testnet3">Testnet(Shard 3)</option>
                  <option value="development">Development</option>
                </select>
              </li>
            </ul>

            <div className="dropdown py-sm-4 mt-sm-auto ms-auto ms-sm-0 flex-shrink-1">
              <button
                className="btn btn-primary dropdown-toggle"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src="https://avatars.githubusercontent.com/u/19875268?v=4"
                  alt="hugenerd"
                  width="28"
                  height="28"
                  className="rounded-circle"
                />
                <span className="d-none d-sm-inline mx-1">John Doe</span>
              </button>
              <ul
                className="dropdown-menu dropdown-menu-dark text-small shadow"
                aria-labelledby="dropdownUser1"
              >
                <li>
                  <Link className="dropdown-item" to="#">
                    Bla
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/recover">
                    Blobb
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="#">
                    Profile
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapToProps = ({ environment }) => ({ environment });
export default connect(mapToProps, actions)(Navbar);
