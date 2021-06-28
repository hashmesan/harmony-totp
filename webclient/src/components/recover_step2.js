import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import OtpInput from 'react-otp-input';
import styled from '@emotion/styled'

var StyledOTPContainer = styled.div`
    .inputStyle {
        width: 3rem !important;
        height: 3rem;
        margin: .5rem 0.5rem;
        font-size: 2rem;
        border-radius: 4px;
        border: 1px solid rgba(0, 0, 0, 0.3);
    }
`;

class ProvideCode extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    handleChange(otp) {
        this.setState({ otp });
    }

    recoverWallet() {

    }

    render() {
        console.log(this.props);
        return (
            <React.Fragment>
                <h2>Provide 5-OTP Recovery Codes</h2>
                <h5 className="mt-4">Open your Google Authenticator, find the {} code. Type in code you see then click refresh to get a new code. Repeat until you completed 5 codes.</h5>
                <div className="justify-content-md-center">
                    <div className="mb-5">Address: {this.props.match.params.address}</div>

                        {[0,1,2,3,4,5].map((e)=> { return (<StyledOTPContainer className="row bg-white justify-content-md-center mb-4">
                            <h5 className="mt-3">OTP [{e+1}]</h5>
                            <OtpInput
                                inputStyle="inputStyle"
                                value={this.state.otp}
                                onChange={this.handleChange.bind(this)}
                                numInputs={6}
                                isInputNum={true}
                                shouldAutoFocus
                                separator={<span></span>}
                            /></StyledOTPContainer>)})}
                        
                    {(!this.state.busy)&& <button className="mt-5 btn btn-lg btn-primary" onClick={this.recoverWallet.bind(this)}>Recover Wallet</button>} 
                    {(this.state.busy) && <button className="mt-5 btn btn-lg btn-primary">
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Waiting for tx...                            
                        </button>}
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(ProvideCode);