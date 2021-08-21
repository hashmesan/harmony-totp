import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import OtpInput from 'react-otp-input';
import styled from '@emotion/styled'
const web3utils = require("web3-utils");
import { connect } from "redux-zero/react";
import actions from "../../redux/actions";
import {getApiUrl, getStorageKey, getLocalWallet, setLocalWallet} from "../../config";
import {SmartVaultContext, SmartVaultConsumer} from "../smartvault_provider";
const ethers = require("ethers");

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
            error: null,
            loadingHashes: false,
            otp_0: "",
            otp_1: "",
            otp_2: "",
            otp_3: "",
            otp_4: "",
            gasLimit: 250000,
            name: this.props.match.params.address,
            status: "",
            found: false,
        }
    }

    handleChange(index, otp) {
        this.setState({["otp_" + index]: otp });
    }

    componentDidMount() {
        const self = this;

        console.log("looking up", this.state.name)
        this.setState({busy: true});
        this.context.smartvault.harmonyClient.isNameAvailable(this.state.name, 31536000).then(available=>{
            if(available.address == ethers.constants.AddressZero) {
                self.setState({error: "No address at this name"});
            } else {
                self.setState({found: true})
            }
            self.setState({busy: false});
        });
    }

    /**
     * recovery requires
     *  - new owner key
     *  - the hashes download
     *  - 5-HOTP tokens
     *  - reverse lookup (for local only)
     */
    recoverWallet() {
        var self = this;
        var codes = [this.state.otp_0, 
            this.state.otp_1, 
            this.state.otp_2, 
            this.state.otp_3,
            this.state.otp_4];

        this.setState({busy: true});
        this.context.smartvault.recoverWallet(this.state.name, codes, status=>{
            self.setState({status: this.state.status + "\n" + status})
        })
        .then(e =>{
            var storeData = self.context.smartvault.walletData;
            delete storeData["leaves_arr"]
            setLocalWallet(self.props.environment, JSON.stringify(storeData), false);
            setTimeout(()=>{
                self.props.history.push("/wallet");
            }, 5000);
        }).catch(e => {
            if (e.response) {
                self.setState({error: JSON.stringify(e.response.data), busy : false});
            }
            else {
                self.setState({error: e.message, busy : false});
            }
        })    
    }

    render() {
        if (this.state.loadingHashes) {
            return (
                <React.Fragment>
                    <h2>Provide 5-OTP Recovery Codes</h2>
                    <div className="mt-4">
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Loading merkle hashes from IPFS...
                    </div>
                </React.Fragment>
            )
        }
        console.log(this.props);
        if(!this.state.found) {
            if(this.state.busy) {
                return <p>Checking address...{this.state.name}</p>
            } else {
                return <h3>Address not found</h3>
            }
        }
        return (
            <SmartVaultConsumer>
            {({smartvault}) => (
            <React.Fragment>
                <h2>Provide 5-OTP Recovery Codes</h2>
                <h5 className="mt-4">Open your Google Authenticator. Type in code you see then click refresh to get a new code. Repeat until you completed 5 codes.</h5>
                <div className="justify-content-md-center">
                    <div className="mb-5">Address: {this.props.match.params.address}</div>

                        {[0,1,2,3,4].map((e)=> { return (<StyledOTPContainer className="row bg-white justify-content-md-center mb-4">
                            <h5 className="mt-3">OTP [{e+1}]</h5>
                            <OtpInput
                                inputStyle="inputStyle"
                                value={this.state["otp_" + e]}
                                onChange={this.handleChange.bind(this, e)}
                                numInputs={6}
                                isInputNum={true}
                                shouldAutoFocus
                                separator={<span></span>}
                            /></StyledOTPContainer>)})}

                <div className="row justify-content-md-center mt-4">
                        <pre>
                            {this.state.status}
                        </pre>
                    </div>
                {this.state.error && <div className="row justify-content-md-center mt-4">
                    <div className="alert alert-danger w-50" role="alert">
                        {this.state.error}
                    </div>
                </div>}   
                    {(!this.state.busy)&& <button className="mt-5 btn btn-lg btn-primary" onClick={this.recoverWallet.bind(this)}>Recover Wallet</button>} 
                    {(this.state.busy) && <button className="mt-5 btn btn-lg btn-secondary">
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>                                                        
                        </button>}
                </div>
                    </React.Fragment>
                )}
                </SmartVaultConsumer>            
        );
    }
}
ProvideCode.contextType = SmartVaultContext;

const mapToProps = ({ environment }) => ({ environment });
<<<<<<< HEAD
export default connect(mapToProps, actions)(withRouter(ProvideCode));
=======
export default connect(mapToProps, actions)(withRouter(ProvideCode));
>>>>>>> navbar
