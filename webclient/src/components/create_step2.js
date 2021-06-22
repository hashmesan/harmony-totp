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
        }
    }
    handleChange(otp) {
        this.setState({ otp });
    }

    checkFirstTOTP(input) {
        return getTOTP(this.props.secret, 0) == input;
    }
    
    // check for valid OTP
    validate(e) {
        e.preventDefault();
        console.log(this.checkFirstTOTP(this.state.otp));

        // submit tx

        // wait tx to finish

        this.props.history.push("/create/step3")
    }

    render() {
        const query = `?counter=0&secret=${this.props.secret}&issuer=smartvault.one`
        const encodedQuery = query.replace('?', '%3F').replace('&', '%26')
        const uri = `otpauth://hotp/${this.props.name}${encodedQuery}`
        const qr_fixed = `https://chart.googleapis.com/chart?chs=200x200&chld=L|0&cht=qr&chl=${uri}`;

        return (
            <React.Fragment>
                <h2>Scan your HOTP Secret</h2>
                <h5 className="mt-4 mb-4">Scan this QR code with your Google Authenticator.<br/>This code is used to authorize higher transfers, and recover your wallet.</h5>
                <div className="mb-4">
                    <img src={qr_fixed}/><br/>
                    {uri}
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
                <button className="mt-5 btn btn-lg btn-primary" onClick={this.validate.bind(this)}>Confirm</button>                
            </React.Fragment>
        );
    }
}

export default withRouter(ScanQRCode);