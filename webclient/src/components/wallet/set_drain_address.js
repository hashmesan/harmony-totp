import React, { Component } from 'react';
const {
	toBech32,
	fromBech32,
} = require('@harmony-js/crypto');
const web3utils = require("web3-utils");
import { SmartVaultContext, SmartVaultConsumer } from "../smartvault_provider";
import RelayerClient from '../../../../lib/relayer_client';
import Notifications, {notify} from 'react-notify-toast';

class SetDailyLimit extends Component {
	constructor(props) {
		super(props)
		this.state = {gasLimit: "", gasPrice:"", gasFee:"", drainAddress: ""}
	}

	componentDidMount() {
		this.setState({
			gasLimit: this.context.smartvault.config.gasLimit,
			gasPrice: web3utils.fromWei(this.context.smartvault.config.gasPrice + "", "gwei"),
			gasFee: web3utils.toBN(this.context.smartvault.config.gasLimit).mul(web3utils.toBN(this.context.smartvault.config.gasPrice))
		});
	}

	transfer(e) {
		e.preventDefault();
		var self = this;
		self.setState({ submitting: true });

		var methodData = RelayerClient.getContract().methods.setDrainAddress(fromBech32(this.state.drainAddress)).encodeABI();    
        this.context.smartvault.submitTransaction(methodData).then(e => {
			setTimeout(() => {
				self.setState({ submitting: false, drainAddress: "" });
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
					<h3 className="card-title text-center">SET DRAIN ADDRESS</h3>
					<form>
						<div className="form-group">
							<label htmlFor="inputEmail3" className="col-form-label">New drain address</label>
							<div className="">
								<input type="text" className="form-control" id="inputEmail3" value={this.state.drainAddress} onChange={(e) => this.setState({ drainAddress: e.target.value })} />
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
SetDailyLimit.contextType = SmartVaultContext;

export default SetDailyLimit;