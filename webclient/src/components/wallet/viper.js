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

const default_list = "https://d1xrz6ki9z98vb.cloudfront.net/venomswap/lists/venomswap-default.tokenlist.json";

class Stats extends Component {
    constructor(props) {
        super(props)
        this.state = {
            from: {
                symbol: "ONE"
            },
            to: {
                symbol: "ETH"
            }
        }
    }

    updateData() {
        var self = this;
        var client = new RelayerClient(CONFIG[this.props.environment].API_URL, this.props.environment)
        client.getContractCreated().then(res=>{
            self.setState({result: res.data.result})
        })

        axios.get(default_list).then(e=>{
            console.log(e);
            self.setState({tokens: e.data.tokens})
        })
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

    }

    showToken(source) {
        console.log(source);
        this.setState({showToken: source});
        $('#exampleModal').modal('show');
    }

    chooseToken(token) {
        const showToken = this.state.showToken;
        console.log(this, showToken, token);
        this.setState({[showToken]: token});
        $('#exampleModal').modal('hide');
    }

    render() {
        return (
            <div className="card mb-3">
                <div className="card-header">ViperSwap</div>
                <div className="card-body text-secondary p-5">
                    <form>
						<div className="form-group">
							<label htmlFor="inputEmail3" className="col-form-label">From</label>
							<div className="input-group">
                                <input type="text" className="form-control" id="inputEmail3" placeholder="0.0"  value={this.state.destination} onChange={(e) => this.setState({ destination: e.target.value })} />
                                <div className="input-group-append">
                                    <button className="btn btn-outline-secondary" type="button" onClick={this.showToken.bind(this, 'from')}>{this.state.from.symbol}</button>                                
                                </div>
                            </div>
                        </div>
                        <div className="form-group text-center">
                            <i class="fa fa-arrow-down"></i>
                        </div>
						<div className="form-group">
							<label htmlFor="inputEmail3" className="col-form-label">To</label>
							<div className="input-group">
								<input type="text" className="form-control" id="inputEmail3" placeholder="0.0" value={this.state.destination} onChange={(e) => this.setState({ destination: e.target.value })} />
                                <div className="input-group-append">
                                    <button className="btn btn-outline-secondary" type="button" onClick={this.showToken.bind(this, 'to')}>{this.state.to.symbol}</button>                                
                                </div>
    						</div>
						</div>
						<div className="form-group row mt-4">
							<label htmlFor="inputEmail3" className="col-sm-4 col-form-label"></label>
							<div className="col-sm-8">
								{!this.state.submitting && <button className="btn btn-primary" onClick={this.swap.bind(this)}>Swap</button>}
								{this.state.submitting && <button className="btn btn-primary" disabled>Swapping..(wait)</button>}
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
                                        {this.state.tokens && this.state.tokens.map(e=>{
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

const mapToProps = ({ environment }) => ({ environment });
export default connect(mapToProps, actions)(Stats);