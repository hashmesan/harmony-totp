import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
const web3utils = require("web3-utils");
import { connect } from "redux-zero/react";
import actions from "../../redux/actions";
import {SmartVaultContext, SmartVaultConsumer} from "../smartvault_provider";


class ChooseName extends Component {
    constructor(props) {
        super(props)
        this.state = {
          name: '',
          error: null,
          busy: false,
          showCost: false,
          dailyLimit: 10000,
          drainAddress: ""
        }
    }

    handleChange(event) {
        this.setState({name: event.target.value, showCost: false});
    }

    handleDrainChange(event) {
        this.setState({drainAddress: event.target.value});
    }    

    handleDailyLimit(event) {
        this.setState({dailyLimit: parseInt(event.target.value)});
    }    

    // check if name is valid
    validate(e) {
        console.log(this, e);

        var self = this;
        self.setState({busy: true});
        this.context.smartvault.create(this.state.name + ".crazy.one", null, web3utils.toWei(this.state.dailyLimit+""), this.state.drainAddress).then(res=>{
            if(res == null) {
                self.setState({error: "Already exists!"});
            } else {
                self.setState({
                    cost: self.context.smartvault.walletData.rentPrice,
                    showCost: true, 
                    error: null
                })                
            }
            self.setState({busy: false});
        }).catch((ex)=>{
            self.setState({error: ex.message});
            self.setState({busy: false});
        })
    }

    continue(ev) {
        ev.preventDefault();
        this.context.savePending();

        // TODO: validate drain address

        this.props.history.push("/create/step2");
    }
    render() {
        return (
                <SmartVaultConsumer>
                {({smartvault}) => (
                    <React.Fragment>
                    <h2>Configure your SmartVault</h2>
                    <h5 className="mt-4">A short, memorable name makes it easy find your wallet, and share with others.</h5>
                    <div className="row justify-content-md-center">
                        <div className="mt-4">
                            <form className="form text-left" style={{maxWidth:500}}>
                                <div className="form-group mr-3">
                                    <label for="exampleInputEmail1">Choose a name</label>
                                    <div className="input-group">
                                        <input type="text" className="form-control" value={this.state.name} onChange={this.handleChange.bind(this)}/>
                                        <div className="input-group-append">
                                            <span className="input-group-text" id="basic-addon2">.crazy.one</span>
                                        </div>
                                        <div className="ml-3">
                                            {!this.state.busy && <button className="btn btn-success" onClick={this.validate.bind(this)}>Search</button>}
                                            {this.state.busy && <button disabled className="btn btn-secondary">Checking...</button>}
                                        </div>
                                        <small id="emailHelp" class="form-text text-muted">Subject to availability and pricing based on number of characters.</small>
                                    </div>
                                </div>
                                <div className="form-group mr-3">
                                    <label for="exampleInputEmail1">Daily Spending Limit</label>
                                    <div className="input-group">
                                        <input type="number" className="form-control" value={this.state.dailyLimit} onChange={this.handleDailyLimit.bind(this)}/>
                                        <div className="input-group-append">
                                            <span className="input-group-text" id="basic-addon2">ONE</span>
                                        </div>
                                    </div>
                                    <small id="emailHelp" class="form-text text-muted">Can be changed later</small>
                                </div>   
                                <div className="form-group mr-3">
                                    <label for="exampleInputEmail1">Set Drain Address (optional)</label>
                                    <div className="input-group">
                                        <input type="text" className="form-control" value={this.state.drainAddress} onChange={this.handleDrainChange.bind(this)}/>
                                        <small id="emailHelp" class="form-text text-muted">The last resort to recover your funds by sending 1.0 ONE originating from the recovery address. It is IMPORTANT you do not use exchange wallet which may change address.</small>
                                    </div>
                                </div>                                                                
                            </form>
                        </div>
                    </div>
                    {this.state.error && <div className="row justify-content-md-center mt-4">
                        <div className="alert alert-danger w-50" role="alert">
                            {this.state.error}
                        </div>
                    </div>}
                    
                    <p className="mt-3">
                        <a className="" data-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
                            Show Pricing
                        </a>
                    </p>
                    <div className="collapse" id="collapseExample">
                            <img src="https://miro.medium.com/max/506/1*y_GmTrFyrWG6ZP8o7docUA.png" width="500" className="img-thumbnail"/>
                    </div>                
                    {this.state.showCost && <div className="mt-4">
                        <div>{this.state.name + ".crazy.one"} is available.</div>                         
                        <div><button className="mt-2 btn btn-lg btn-primary" onClick={this.continue.bind(this)}>Register for {web3utils.fromWei(this.state.cost).split(".")[0]} ONE</button></div>
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