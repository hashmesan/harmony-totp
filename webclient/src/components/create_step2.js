import React, { Component } from 'react';
import { css, jsx } from '@emotion/react'
import OtpInput from 'react-otp-input';
import styled from '@emotion/styled'
import {
    HashRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import { getTOTP } from '../../../lib/wallet';

import { connect } from "redux-zero/react";
import actions from "../redux/actions";
import {getApiUrl} from "../config";

var StyledOTPContainer = styled.div`
    .inputStyle {
        width: 3rem !important;
        height: 3rem;
        margin: 0 1rem;
        font-size: 2rem;
        border-radius: 4px;
        border: 1px solid rgba(0, 0, 0, 0.3);
    }
`;
class ScanQRCode extends Component {
    constructor(props) {
        super(props)
        this.state = {
          otp: '',
          busy: false
        }
    }
    handleChange(otp) {
        this.setState({ otp });
    }

    checkFirstTOTP(input) {
        console.log(this.props);
        return getTOTP(this.props.data.secret, 2) == input;
    }
    
    // check for valid OTP
    /* 
        struct WalletConfig
    {
        address   owner;
        bytes32[] rootHash;
        uint8 	  merkelHeight;
        address	  drainAddr;
        uint 	  dailyLimit;
        bytes     signature;
        uint      salt;
    }
    */

    validate(e) {
        e.preventDefault();
        var match = this.checkFirstTOTP(this.state.otp);
        if (!match) {
            this.setState({error: "OTP does not match"});
            return;
        }

        // submit tx
        var self = this;
        self.setState({busy: true});

        // wait tx to finish
        fetch(getApiUrl(this.props.environment), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({
                operation: "getDepositAddress",
                env: this.props.environment,
                data: {
                    owner: self.props.data.ownerAddress,
                    salt: self.props.data.salt
                }
            })
        })
        .then(res => {
            if(res.ok) {
                return res.json()
            } else {
                return res.json().then(e=>{
                    self.setState({error: e});
                    throw e;
                })
            }
        })
        .then((res)=> {
            self.setState({busy: false});
            self.props.handleUpdate({walletAddress: res.result.address, networkFee: res.result.networkFee});
            self.props.history.push("/create/step3");
        }).catch((ex)=>{
            console.log("ex=", ex);
            self.setState({busy: false});
            self.setState({error: ex});
        })
    }

    render() {
        const query = `?counter=1&secret=${this.props.data.secret}&issuer=smartvault.one`
        const encodedQuery = query.replace('?', '%3F').replace('&', '%26')
        const uri = `otpauth://hotp/${this.props.data.name}${encodedQuery}`
        const qr_fixed = `https://chart.googleapis.com/chart?chs=200x200&chld=L|0&cht=qr&chl=${uri}`;

        return (
            <React.Fragment>
                <h2>Scan your HOTP Secret</h2>
                <h5 className="mt-4 mb-4">Scan this QR code with your Google Authenticator.<br/>This code is used to authorize higher transfers, and recover your wallet.</h5>
                <div className="mb-4">
                    <img src={qr_fixed} width="200" height="200" className="img-thumbnail"/><br/>
                    <a className="btn btn-link">Generate New Secret</a>
                </div>

                <label>Enter the first OTP Code</label>
                <StyledOTPContainer className="row justify-content-md-center ">
                <OtpInput
                    inputStyle="inputStyle"
                    value={this.state.otp}
                    onChange={this.handleChange.bind(this)}
                    numInputs={6}
                    isInputNum={true}
                    shouldAutoFocus
                    separator={<span></span>}
                />
                </StyledOTPContainer>

                {this.state.error &&                
                    <div className="row justify-content-md-center mt-4">
                        <div className="alert alert-danger w-50" role="alert">
                            {this.state.error.toString()}
                        </div>
                    </div>}

                {!this.state.busy && <button className="mt-5 btn btn-lg btn-primary" onClick={this.validate.bind(this)}>Continue</button>}
                {this.state.busy && <button disabled className="mt-5 btn btn-lg btn-primary" type="button">
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Loading...
                    </button>}
            </React.Fragment>
        );
    }
}

const mapToProps = ({ environment }) => ({ environment });
export default connect(mapToProps, actions)(withRouter(ScanQRCode));