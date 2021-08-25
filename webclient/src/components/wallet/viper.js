import React, { Component } from 'react';
import {
    HashRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import { connect } from "redux-zero/react";
import actions from "../../redux/actions";
import {getLocalWallet} from "../../config";
import RelayerClient from '../../../../lib/relayer_client';
import {CONFIG} from "../../config";
import axios from "axios";
import { SmartVaultContext, SmartVaultConsumer } from "../smartvault_provider";
import { getBestAmountOut, swapToken } from "./viper_helper";
const web3utils = require("web3-utils");

const default_list = "https://d1xrz6ki9z98vb.cloudfront.net/venomswap/lists/venomswap-default.tokenlist.json";
const nativeToken = {
    symbol: "ONE",
    name: "Harmony",
    logoURI: "data:image/png;base64,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"
}
class Stats extends Component {
    constructor(props) {
        super(props)
        this.state = {
            from: nativeToken,
            to: {
                symbol: "ETH",
                logoURI: ""
            },
            insufficient: false
        }
    }

    updateData() {
        var self = this;

        this.context.smartvault.harmonyClient.getNetworkId().then(networkId =>{
            self.setState({networkId: networkId});

            axios.get(default_list).then(e=>{
                const tokens = e.data.tokens.filter(e=>{
                    if(networkId == "1666600000") {
                        return e.chainId == null || e.chainId == "1666600000";
                    } else {
                        return e.chainId == networkId;
                    }
                })
                self.setState({tokens: tokens, to: tokens.length > 0 ? tokens[0]: {symbol: "ETH"}}, ()=>{
                    self.updateTokenAmount('to');
                })
            })    
        });

        this.updateTokenAmount('from');
    }
    componentDidMount() {
        this.updateData();
    }

    componentDidUpdate(prevProps) {
        if(this.props.environment != prevProps.environment)
        {
            this.updateData();
        }
      } 

    swap(e) {
        e.preventDefault();

        swapToken(this.context.smartvault, 
            this.state.from, 
            this.state.to, 
            web3utils.toWei(this.state.fromAmount),
            web3utils.toWei(this.state.toAmount)).then(res=>{
                console.log("res", res)
            })
            .catch(ex=>{
                console.log("ex:", ex)
            })
    }

    showToken(source) {
        this.setState({showToken: source});
        $('#exampleModal').modal('show');
    }

    updateTokenAmount(source) {
        var token = this.state[source];
        var self = this;
        if(token.symbol == "ONE") {
            this.context.smartvault.getDeposits().then(balance=>{
                self.setState({[source + "_amount"]: balance})
            });
        }
        else {
            if(token.address) {
                this.context.smartvault.harmonyClient.getErc20Balance([token.address], this.context.smartvault.walletData.walletAddress).then(balances=>{
                    self.setState({[source + "_amount"]: balances[0]})
                });
            }  
        }
    }

    chooseToken(token) {
        var self = this;
        const showToken = this.state.showToken;
        this.setState({[showToken]: token},()=>{
            self.updateFromAmount();
            self.updateTokenAmount(showToken);
        });
        $('#exampleModal').modal('hide');

    }

    reverseToken(e) {
        e.preventDefault();
        this.setState({from: this.state.to, to: this.state.from})
    }

    updateFromAmount() {
        var self = this;
        if(!this.state.fromAmount || this.state.fromAmount == "") return;
        getBestAmountOut(this.context.smartvault, this.state.from, this.state.to, web3utils.toWei(this.state.fromAmount)).then(amount=>{
            self.setState({toAmount: Number(web3utils.fromWei(amount)).toFixed(6), toAmountRaw: amount})
        })

        if(Number(this.state.fromAmount) > Number(web3utils.fromWei(this.state.from_amount || '0'))) {
            self.setState({insufficient: true})
        } else {
            self.setState({insufficient: false})            
        }
    }

    updateToAmount() {
        var self = this;
        if(this.state.toAmount == "") return;
        
        getBestAmountOut(this.context.smartvault, this.state.to, this.state.from, web3utils.toWei(this.state.toAmount)).then(amount=>{
            self.setState({fromAmount: Number(web3utils.fromWei(amount)).toFixed(6)})
        })
    }

    changeFromAmount(e) {
        var self = this;
        this.setState({fromAmount: e.target.value}, ()=>{
            self.updateFromAmount();
        });
    }

    changeToAmount(e) {
        var self = this;
        this.setState({toAmount: e.target.value}, ()=>{
            self.updateToAmount();
        });
    }

    render() {
        return (
            <div className="card mb-3">
                <div className="card-header">ViperSwap</div>
                <div className="card-body text-secondary p-5">
                    <form>
						<div className="form-group">
							<label htmlFor="inputEmail3" className="col-form-label">From</label><span className="float-right p-2">Balance: {this.state.from_amount && Number(web3utils.fromWei(this.state.from_amount)).toFixed(4)}</span>
							<div className="input-group">
                                <input type="text" className="form-control" id="inputEmail3" placeholder="0.0"  value={this.state.fromAmount} onChange={this.changeFromAmount.bind(this)} />
                                <div className="input-group-append">
                                    <button className="btn btn-outline-secondary" type="button" onClick={this.showToken.bind(this, 'from')}>
                                        <img src={this.state.from.logoURI} className="float-left mr-2" style={{width: 25}}/>
                                        {this.state.from.symbol}
                                    </button>                                
                                </div>
                            </div>
                        </div>
                        <div className="form-group text-center">
                            <a href="#" onClick={this.reverseToken.bind(this)}><i class="fa fa-arrow-down"></i></a>
                        </div>
						<div className="form-group">
							<label htmlFor="inputEmail3" className="col-form-label">To</label><span className="float-right p-2">Balance: {this.state.to_amount && Number(web3utils.fromWei(this.state.to_amount)).toFixed(4)}</span>
							<div className="input-group">
								<input type="text" className="form-control" id="inputEmail3" placeholder="0.0" value={this.state.toAmount} onChange={this.changeToAmount.bind(this)} />
                                <div className="input-group-append">
                                    <button className="btn btn-outline-secondary" type="button" onClick={this.showToken.bind(this, 'to')}>
                                        <img src={this.state.to.logoURI} className="float-left mr-2" style={{width: 25}}/>
                                        {this.state.to.symbol}
                                    </button>                                
                                </div>
    						</div>
						</div>
						<div className="form-group row mt-4">
							<div className="col-sm-12 text-center">
                                {this.state.insufficient && <button className="btn btn-primary btn-lg w-50" disabled>INSUFFICIENT {this.state.from.symbol} balance</button>}
								{(!this.state.submitting && !this.state.insufficient) && <button className="btn btn-primary  btn-lg w-50" onClick={this.swap.bind(this)}>Swap</button>}
								{(this.state.submitting && !this.state.insufficient) && <button className="btn btn-primary btn-lg w-50" disabled>Swapping..(wait)</button>}
							</div>
						</div>                        
                    </form>
                    <div className="modal fade " tabindex="-1" id="exampleModal" >
                        <div className="modal-dialog modal-dialog-scrollable modal-sm modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Select a token</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body p-0">
                                    <div className="btn-group-vertical w-100">
                                        {this.state.tokens && [nativeToken, ...this.state.tokens].map(e=>{                                      
                                            return <button class="btn btn-block btn-light text-left" onClick={this.chooseToken.bind(this, e)}>
                                                <img src={e.logoURI} className="float-left mr-2" style={{width: 25}}/>
                                                <div>{e.symbol}
                                                <div><small class="text-muted">{e.name}</small></div></div>
                                            </button>
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        );
    }
}
Stats.contextType = SmartVaultContext;

const mapToProps = ({ environment }) => ({ environment });
export default connect(mapToProps, actions)(Stats);