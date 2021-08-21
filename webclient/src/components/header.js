import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "redux-zero/react";
import styled from "@emotion/styled";

import actions from "../redux/actions";
import { getLocalWallet } from "../config";

class Header extends Component {
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
        <nav className="navbar navbar-expand-lg bg-dark navbar-dark py-3">
          <div className="container">
            <Link to="/" className="navbar-brand">
              The R Bank
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbar"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbar">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link to="/create" className="nav-link">
                    Products
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/recover" className="nav-link">
                    Client Benefits
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/" className="nav-link">
                    Resources
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/" className="nav-link">
                    About
                  </Link>
                </li>
              </ul>
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link to="" className="nav-link">
                    Log In
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="" className="nav-link">
                    Find My Rate
                  </Link>
                </li>
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
<div className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white shadow-sm">
        <div className="my-0 mr-md-auto font-weight-normal">
          <Link to="/">
            <img src="public/logo_smartvault.png" height="50" />
          </Link>
        </div>
        {!hasWallet ? (
          <StyledNavbar className="my-2 my-md-0 mr-md-3">
            <Link className="p-2 text-dark" to="/create">
              Create Wallet
            </Link>
            <Link className="p-2 text-dark" to="/recover">
              Restore Wallet
            </Link>
          </StyledNavbar>
        ) : (
          <nav className="my-2 my-md-0 mr-md-3">
            <Link className="p-2 text-dark" to="/wallet">
              My Wallet
            </Link>
            <Link className="p-2 text-dark" to="/settings">
              Settings
            </Link>
          </nav>
        )}
        <select
          className=""
          value={this.props.environment}
          onChange={this.handleChange.bind(this)}
        >
          <option value="mainnet0">Mainnet(Shard 0)</option>
          <option value="testnet0">Testnet(Shard 0)</option>
          <option value="testnet3">Testnet(Shard 3)</option>
          <option value="development">Development</option>
        </select>
      </div>
*/
