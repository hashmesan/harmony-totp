import React, { Component } from "react";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";
import { connect } from "redux-zero/react";
import styled from "@emotion/styled";

import actions from "../redux/actions";
import { getLocalWallet } from "../config";

const StyledNavbar = styled.nav`
  display: flex;
  flex-direction: horizontal;
  justify-content: space-between;
  font-family: "Nunito", sans-serif;
`;

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
      <div className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white shadow-sm">
        <div className="my-0 mr-md-auto font-weight-normal">
          <a href="/">
            <img src="public/logo_smartvault.png" height="50" />
          </a>
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
    );
  }
}

const mapToProps = ({ environment }) => ({ environment });
export default connect(mapToProps, actions)(Header);
