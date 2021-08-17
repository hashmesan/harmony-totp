import React, { Component } from 'react';
import {
    HashRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import styled from '@emotion/styled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { connect } from "redux-zero/react";
import actions from "../redux/actions";
import {getLocalWallet} from "../config";

class Navbar extends Component {
  handleChange(e) {
    e.preventDefault();
    this.props.setEnvironment(e.target.value);
}

render() {
  console.log(this.props);
  const hasWallet = (getLocalWallet(this.props.environment) && JSON.parse(getLocalWallet(this.props.environment)).created == true)

  return (
    <React.Fragment>
      <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
        <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
          <Link to="/" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
            <span className="fs-5 d-none d-sm-inline">Menu</span>
          </Link>
          <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
            <li className="nav-item">
              <Link to="/" className="nav-link align-middle px-0">
                <FontAwesomeIcon icon="home" />
                <span className="ms-1 d-none d-sm-inline">Home</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/recover" className="nav-link align-middle px-0">
                <FontAwesomeIcon icon="chart-pie" />
                <span className="ms-1 d-none d-sm-inline">Portfolio</span></Link>
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
                <span className="ms-1 d-none d-sm-inline">Transaction History</span>
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
          </ul>
        </div>
      </div>
    </React.Fragment>
  );
  }
}


const mapToProps = ({ environment }) => ({ environment });
export default connect(mapToProps, actions)(Navbar);