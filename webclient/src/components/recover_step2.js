import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import OtpInput from 'react-otp-input';
import styled from '@emotion/styled'
import Web3EthAccounts from 'web3-eth-accounts';
import merkle from '../../../lib/merkle';
import {getProofWithOTP} from '../../../lib/wallet';
import RelayerClient from "../../../lib/relayer_client";
const web3utils = require("web3-utils");
import { connect } from "redux-zero/react";
import actions from "../redux/actions";
import {getApiUrl, getStorageKey, getLocalWallet, setLocalWallet} from "../config";

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
// 271
class ProvideCode extends Component {
    constructor(props) {
        super(props)

        const account = new Web3EthAccounts().create();
        this.relayerClient = new RelayerClient(getApiUrl(this.props.environment), this.props.environment);
        this.ownerAccount = new Web3EthAccounts().privateKeyToAccount(account.privateKey);

        this.state = {
            error: null,
            loadingHashes: true,
            otp_0: "",
            otp_1: "",
            otp_2: "",
            otp_3: "",
            otp_4: "",
            gasLimit: 250000,
            data: {
                name: this.props.match.params.address,
                ownerAddress: account.address, 
                ownerSecret: account.privateKey
            }
        }
    }

    handleChange(index, otp) {
        this.setState({["otp_" + index]: otp });
    }

    async loadHashes(walletAddress) {
        var self = this;
        return fetch(getApiUrl(this.props.environment), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({
                operation: "getHash",
                env: this.props.environment,
                address: walletAddress
            })
        })
        .then(res=>res.json())
        .then((res)=> {
            return res.result;
        });
    }

    async loadAddress() {
        return fetch(getApiUrl(this.props.environment), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({
                operation: "checkName",
                env: this.props.environment,
                name: this.state.data.name
            })
        })
        .then(res=>res.json())
        .then((res)=> {
            return res.result.address;
        });
    }

    componentDidMount() {
        const self = this;
        this.loadAddress().then(address=>{
            return self.loadHashes(address).then(res=>{
                self.setState({loadingHashes: false, data: Object.assign(self.state.data, {walletAddress: address, hashes: {leaves_arr: res}})})
            });
        })
    }

    /**
     * recovery requires
     *  - new owner key
     *  - the hashes download
     *  - 5-HOTP tokens
     *  - reverse lookup (for local only)
     */
    recoverWallet() {
        try {
            var self = this;
            var {token, proof} = getProofWithOTP([this.state.otp_0, 
                            this.state.otp_1, 
                            this.state.otp_2, 
                            this.state.otp_3,
                            this.state.otp_4], this.state.data.hashes.leaves_arr);

            console.log(proof);
            // submit the commit
            self.setState({busy: true, status: "Submitting tx..."});
            var commitHash =  web3utils.soliditySha3(merkle.concat(self.state.data.walletAddress, this.state.data.ownerAddress,proof[0]));
            this.relayerClient.startRecoverCommit(self.state.data.walletAddress, commitHash, 0, self.state.gasLimit, this.ownerAccount).then(e=>{
                self.setState({status: "commit succeeded"});
                return this.relayerClient.startRecoverReveal(self.state.data.walletAddress, self.state.data.ownerAddress, proof, 0, self.state.gasLimit, this.ownerAccount)
            }).then(e=>{
                setLocalWallet(self.props.environment, JSON.stringify(Object.assign(self.state.data, {active: true})));
                self.setState({status: "Recovery Reveal successful!", busy: false});
                setTimeout(()=>{
                    self.props.history.push("/wallet");
                }, 2000);
            })
            // submit the reveal
        } catch(e) {
            this.setState({error: e, busy : false})
        }
    }

    render() {
        console.log(this.state);

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
        return (
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

                {this.state.error && <div className="row justify-content-md-center mt-4">
                    <div className="alert alert-danger w-50" role="alert">
                        {this.state.error}
                    </div>
                </div>}   
                    {(!this.state.busy)&& <button className="mt-5 btn btn-lg btn-primary" onClick={this.recoverWallet.bind(this)}>Recover Wallet</button>} 
                    {(this.state.busy) && <button className="mt-5 btn btn-lg btn-secondary">
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                {this.state.status}                           
                        </button>}
                </div>
            </React.Fragment>
        );
    }
}

const mapToProps = ({ environment }) => ({ environment });
export default connect(mapToProps, actions)(withRouter(ProvideCode));