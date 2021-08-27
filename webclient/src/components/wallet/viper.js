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
import { getBestAmountOut, getBestAmountIn, swapToken } from "./viper_helper";
const web3utils = require("web3-utils");
import TokenSelect, { NativeToken, default_list} from "./token_select";

class Stats extends Component {
    constructor(props) {
        super(props)
        this.state = {
            from: NativeToken,
            to: {
                symbol: "ETH",
                logoURI: ""
            },
            insufficient: false
        }
    }

    updateData() {
        this.context.smartvault.harmonyClient.getNetworkId().then(networkId =>{
            this.setState({networkId: networkId});

            axios.get(default_list).then(e=>{
                const tokens = e.data.tokens.filter(e=>{
                    if(networkId == "1666600000") {
                        return e.chainId == null || e.chainId == "1666600000";
                    } else {
                        return e.chainId == networkId;
                    }
                })
                this.setState({tokens: tokens, to: tokens.length > 0 ? tokens[0]: {symbol: "ETH"}}, ()=>{
                    this.updateTokenAmount('to');
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
        if (!this.state.fromAmount || isNaN(parseFloat(this.state.fromAmount))) return;

        this.setState({submitting: true})
        swapToken(this.context.smartvault, 
            this.state.from, 
            this.state.to, 
            web3utils.toWei(this.state.fromAmount),
            web3utils.toWei(this.state.toAmount)).then(res=>{
                console.log("res", res)
                this.updateTokenAmount('from');
                this.updateTokenAmount('to');
                this.setState({fromAmount: "", toAmount: "", submitting: false});

                // add to ERC20                
                this.context.smartvault.walletData.erc20 = this.context.smartvault.walletData.erc20 || [];
                if(this.context.smartvault.walletData.erc20.findIndex(e=> e.contractAddress == this.state.to.address) == -1) {
                    this.context.smartvault.walletData.erc20.push({
                        name: this.state.to.name,
                        symbol: this.state.to.symbol,
                        decimals: this.state.to.decimals,
                        contractAddress: this.state.to.address
                    });
                    this.context.saveWallet();    
                }
            })
            .catch(ex=>{
                console.log("ex:", ex)
                this.setState({error: ex, submitting: false});
            })
    }

    showToken(source) {
        this.setState({showToken: source});
        $('#exampleModal').modal('show');
    }

    updateTokenAmount(source) {
        var token = this.state[source];
        if(token.symbol == "ONE") {
            this.context.smartvault.getDeposits().then(balance=>{
                this.setState({[source + "_amount"]: balance})
            });
        }
        else {
            if(token.address) {
                this.context.smartvault.harmonyClient.getErc20Balance([token.address], this.context.smartvault.walletData.walletAddress).then(balances=>{
                    this.setState({[source + "_amount"]: balances[0]})
                });
            }  
        }
    }

    chooseToken(token) {
        console.log("got it",token)
        const showToken = this.state.showToken;
        this.setState({[showToken]: token},()=>{
            this.updateFromAmount();
            this.updateTokenAmount(showToken);
        });
        $('#exampleModal').modal('hide');

    }

    reverseToken(e) {
        e.preventDefault();
        this.setState({
            from: this.state.to, 
            fromAmount: this.state.toAmount, 
            toAmount: this.state.fromAmount, 
            from_amount: this.state.to_amount,
            to_amount: this.state.from_amount,
            to: this.state.from})
    }

    updateFromAmount() {
        if(!this.state.fromAmount || isNaN(parseFloat(this.state.fromAmount))) return;

        getBestAmountOut(this.context.smartvault, this.state.from, this.state.to, web3utils.toWei(this.state.fromAmount)).then(amount=>{
            this.setState({toAmount: Number(web3utils.fromWei(amount)).toFixed(6), toAmountRaw: amount})
        })

        if(Number(this.state.fromAmount) > Number(web3utils.fromWei(this.state.from_amount || '0'))) {
            console.log(web3utils.fromWei(this.state.from_amount))
            this.setState({insufficient: true})
        } else {
            this.setState({insufficient: false})            
        }
    }

    updateToAmount() {
        if(this.state.toAmount == "" || isNaN(parseFloat(this.state.toAmount))) return;
        
        getBestAmountIn(this.context.smartvault, this.state.to, this.state.from, web3utils.toWei(this.state.toAmount)).then(amount=>{
            this.setState({fromAmount: Number(web3utils.fromWei(amount)).toPrecision(6)})
        })
    }

    changeFromAmount(e) {
        this.setState({fromAmount: e.target.value}, ()=>{
            this.updateFromAmount();
        });
    }

    changeToAmount(e) {
        this.setState({toAmount: e.target.value}, ()=>{
            this.updateToAmount();
        });
    }

    render() {
        return (
            <div className="card mb-3">
                <div className="card-header">ViperSwap</div>
                <div className="card-body text-secondary p-5">
                    <form>
						<div className="form-group">
							<label htmlFor="inputEmail3" className="col-form-label">From</label><span className="float-right p-2">Balance: {this.state.from_amount && Number(web3utils.fromWei(this.state.from_amount)).toFixedNoRounding(4)}</span>
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
							<label htmlFor="inputEmail3" className="col-form-label">To</label><span className="float-right p-2">Balance: {this.state.to_amount && Number(web3utils.fromWei(this.state.to_amount)).toFixedNoRounding(4)}</span>
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
								{(this.state.submitting && !this.state.insufficient) && <button className="btn btn-primary btn-lg w-50" disabled>Swapping..</button>}
							</div>
						</div>                        
                        <div className="form-group row mt-4">
                            <div className="col-sm-12 text-center">
                                {this.state.error  && <div className="alert alert-danger w-100" role="alert">
                                        An error occured while swapping {this.state.error && this.state.error.message}
                                </div>}
                            </div>                            
                        </div>
                    </form>
                    <TokenSelect chooseToken={this.chooseToken.bind(this)} networkId={this.state.networkId}/>
                </div>
            </div>
            
        );
    }
}
Stats.contextType = SmartVaultContext;

const mapToProps = ({ environment }) => ({ environment });
export default connect(mapToProps, actions)(Stats);