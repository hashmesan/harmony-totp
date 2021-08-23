import React, { Component } from 'react';
const {
	toBech32,
	fromBech32,
} = require('@harmony-js/crypto');
const web3utils = require("web3-utils");
import { SmartVaultContext, SmartVaultConsumer } from "../smartvault_provider";
import Notifications, {notify} from 'react-notify-toast';
import { withRouter } from 'react-router-dom';
import erc20Artifact from "../../../../build/contracts/ERC20.json";
import RelayerClient from '../../../../lib/relayer_client';

var Contract = require('web3-eth-contract');
var erc20 = new Contract(erc20Artifact.abi)

class SendPayment extends Component {
	constructor(props) {
		super(props)
		this.state = {gasLimit: "", gasPrice:"", gasFee:""}
	}

	componentDidMount() {
		this.setState({
			gasLimit: this.context.smartvault.config.gasLimit,
			gasPrice: web3utils.fromWei(this.context.smartvault.config.gasPrice + "", "gwei"),
			gasFee: web3utils.toBN(this.context.smartvault.config.gasLimit).mul(web3utils.toBN(this.context.smartvault.config.gasPrice)),
            contractAddress: this.props.match.params.address
		});

        const self = this;
        this.context.smartvault.harmonyClient.getERC20Info(this.props.match.params.address).then(e=>{
            self.setState({...e})
        })        

        this.context.smartvault.harmonyClient.getErc20Balance([this.props.match.params.address], this.context.smartvault.walletData.walletAddress).then(e=>{
            self.setState({balance: e[0]})
        })
	}
	transfer(e) {
		e.preventDefault();
		var self = this;
		self.setState({ submitting: true });

        const data = erc20.methods.transfer(fromBech32(this.state.destination), web3utils.toWei(this.state.sendAmount)).encodeABI();
        const tx = RelayerClient.getContract().methods.multiCall([{to: this.state.contractAddress, value: 0, data: data}]).encodeABI();
		this.context.smartvault.submitTransaction(tx, parseInt(web3utils.toWei(this.state.gasPrice,'gwei')), this.state.gasLimit).then(e => {
			console.log("sigs", e);
			setTimeout(() => {
				self.setState({ submitting: false, destination: "", sendAmount: "" });
				notify.show('Transaction Successful!');
				window.location.reload();
			}, 3000);

		}).catch(e => {
			console.error(e);
			self.setState({ submitting: false, error: e });
		})
	}

	updateFee() {
		this.setState({ gasFee: web3utils.toBN(this.state.gasLimit).mul(web3utils.toBN(web3utils.toWei(this.state.gasPrice, 'gwei'))) })
	}

	render() {
		return (
			<SmartVaultConsumer>
                {({smartvault}) => (				
			<div className="card">
				<div className="card-body">
					<h3 className="card-title text-center">SEND {this.state.name}</h3>
					<form>
						<div className="form-group">
							<label htmlFor="inputEmail3" className="col-form-label">Destination Address</label>
							<div className="">
								<input type="text" className="form-control" id="inputEmail3" value={this.state.destination} onChange={(e) => this.setState({ destination: e.target.value })} />
							</div>
						</div>
						<div className="form-group">
                            <div className="float-right">MAX: {this.state.balance && web3utils.fromWei(this.state.balance)}</div>
							<label htmlFor="inputEmail3" className="col-form-label">Amount</label>
							<div className="">
								<input type="number" className="form-control" id="inputEmail3" value={this.state.sendAmount} onChange={(e) => this.setState({ sendAmount: e.target.value })} />
							</div>
						</div>
						<div className="form-group row">
							<div className="col-4">
								<label htmlFor="inputEmail3" className="col-form-label">Gas Price (gwei)</label>
								<div className="">
									<input type="number" className="form-control" id="inputEmail3" value={this.state.gasPrice} onChange={(e) => this.setState({ gasPrice: e.target.value }, this.updateFee)} />
								</div>
							</div>
							<div className="col-4">
								<label htmlFor="inputEmail3" className="col-form-label">Gas Limit</label>
								<div className="">
									<input type="number" className="form-control" id="inputEmail3" value={this.state.gasLimit} onChange={(e) => this.setState({ gasLimit: e.target.value }, this.updateFee)} />
								</div>
							</div>
							<div className="col-4">
								<label htmlFor="inputEmail3" className="col-form-label">Gas Fee (max)</label>
								<div className="">
									<input type="number" className="form-control" id="inputEmail3" disabled value={web3utils.fromWei(this.state.gasFee)} />
								</div>
							</div>
						</div>
						{this.state.error &&
							<div className="row justify-content-md-center mt-4">
								<div className="alert alert-danger w-50" role="alert">
									{this.state.error && JSON.stringify(this.state.error)}
								</div>
							</div>}
						<div className="form-group row mt-4">
							<label htmlFor="inputEmail3" className="col-sm-4 col-form-label"></label>
							<div className="col-sm-8">
								{!this.state.submitting && <button className="btn btn-primary" onClick={this.transfer.bind(this)}>Submit Transaction</button>}
								{this.state.submitting && <button className="btn btn-primary" disabled>Submitting..(wait)</button>}
							</div>
						</div>
					</form>
				</div>
			</div>)}
			</SmartVaultConsumer>
		);
	}
}
SendPayment.contextType = SmartVaultContext;

export default withRouter(SendPayment);