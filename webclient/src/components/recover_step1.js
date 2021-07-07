import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
const ethers = require("ethers");
const web3utils = require("web3-utils");
import { connect } from "redux-zero/react";
import actions from "../redux/actions";
import {getApiUrl, getStorageKey, getLocalWallet} from "../config";
import {SmartVaultContext, SmartVaultConsumer} from "./smartvault_provider";

class ChooseName extends Component {
    constructor(props) {
        super(props)
        this.state = {
          name: '',
          error: null,
          busy: false,
          showCost: false
        }
    }

    handleChange(event) {
        this.setState({name: event.target.value, showCost: false});
    }

    // check if name is valid
    validate(e) {
        var self = this;
        self.setState({busy: true});
        var name = this.state.name + ".crazy.one";
        console.log("checking", name)
        this.context.smartvault.harmonyClient.isNameAvailable(name, 31536000).then(available=>{
            if(available.address == ethers.constants.AddressZero) {
                self.setState({error: "No address at this name"});
            } else {
                self.setState({
                    cost: available.environmentcost,
                    address: available.address,
                    showCost: true, 
                    error: null
                })
            }
            self.setState({busy: false});
        }).catch((ex)=>{
            self.setState({error: ex});
            self.setState({busy: false});
        })
    }

    continue(ev) {
        ev.preventDefault();
        this.props.history.push("/recover/step2/" + this.state.name + ".crazy.one");
    }
    render() {
        return (
            <SmartVaultConsumer>
            {({smartvault}) => (
            <React.Fragment>
                <h2>Find your wallet</h2>
                <h5 className="mt-4"></h5>
                <div className="row justify-content-md-center">
                    <div className="mt-4">
                        <form class="form-inline">
                            <div className="form-group mr-3">
                                <input type="text" className="form-control" value={this.state.name} onChange={this.handleChange.bind(this)}/>
                                <div className="input-group-append">
                                    <span className="input-group-text" id="basic-addon2">.crazy.one</span>
                                </div>
                            </div>
                            {!this.state.busy && <button className="btn btn-success" onClick={this.validate.bind(this)}>Search</button>}
                            {this.state.busy && <button disabled className="btn btn-secondary">Checking...</button>}
                        </form>
                    </div>
                </div>
                {this.state.error && <div className="row justify-content-md-center mt-4">
                    <div className="alert alert-danger w-50" role="alert">
                        {this.state.error}
                    </div>
                </div>}
                                
                {this.state.showCost && <div className="mt-4">
                    <div>{this.state.name + ".crazy.one"} points to {this.state.address}</div>                         
                    <div><button className="mt-3 btn btn-lg btn-primary" onClick={this.continue.bind(this)}>Continue</button></div>
                </div>}
            </React.Fragment>
                        )}
                        </SmartVaultConsumer>            
        );
    }
}
ChooseName.contextType = SmartVaultContext;

const mapToProps = ({ environment }) => ({ environment });
export default connect(mapToProps, actions)(withRouter(ChooseName));