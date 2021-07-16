import React, { Component } from 'react';
const {
	toBech32,
	fromBech32,
} = require('@harmony-js/crypto');
const web3utils = require("web3-utils");
import { SmartVaultContext, SmartVaultConsumer } from "../smartvault_provider";
import RelayerClient from '../../../../lib/relayer_client';
import Notifications, {notify} from 'react-notify-toast';

class UpgradePage extends Component {
	constructor(props) {
		super(props)
		this.state = {gasLimit: "", gasPrice:"", gasFee:""}
	}

	componentDidMount() {
        var self = this;
        Promise.all([this.context.smartvault.relayClient.getFactoryInfo(), this.context.smartvault.getSmartVaultInfo()]).then(results=>{
            console.log(results)

            self.setState({
                gasLimit: self.context.smartvault.config.gasLimit,
                gasPrice: web3utils.fromWei(self.context.smartvault.config.gasPrice + "", "gwei"),
                gasFee: web3utils.toBN(self.context.smartvault.config.gasLimit).mul(web3utils.toBN(self.context.smartvault.config.gasPrice)),
                contractInfo: results[1],
                factoryInfo: results[0],
                different: results[0].implementation != results[1].masterCopy
            });    
        })
	}

	transfer(e) {
		e.preventDefault();
		var self = this;
		self.setState({ submitting: true });

        var methodData = RelayerClient.getContract().methods.upgradeMasterCopy(this.state.factoryInfo.implementation).encodeABI();    
        this.context.smartvault.submitTransaction(methodData).then(e => {
			setTimeout(() => {
				self.setState({ submitting: false });
				notify.show('Transaction Successful!');
				window.location.reload
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
					<h3 className="card-title text-center">Upgrade</h3>
					<form class="text-center mt-3">
						<div className="form-group">
                            <div>Current Version: {this.state.contractInfo && this.state.contractInfo.masterCopy}</div>
                            <div>Latest Version: {this.state.factoryInfo && this.state.factoryInfo.implementation}</div>
						</div>
						<div className="form-group row">
                            <pre className="col-12">
                                {this.state.factoryInfo && this.state.factoryInfo.releaseNotes}
                            </pre>
						</div>
						{this.state.error &&
							<div className="row justify-content-md-center mt-4">
								<div className="alert alert-danger w-50" role="alert">
									{this.state.error && JSON.stringify(this.state.error)}
								</div>
							</div>}
						<div className="form-group row mt-4">
                            {this.state.different
                            ?
							<div className="col-sm-12">
								{!this.state.submitting && <button className="btn btn-primary" onClick={this.transfer.bind(this)}>Upgrade</button>}
								{this.state.submitting && <button className="btn btn-primary" disabled>Submitting..(wait)</button>}
							</div>
                            : 
                            <div className="col-sm-12 text-center"><b>Your contract is using the latest version</b></div>}
						</div>
					</form>
				</div>
			</div>)}
			</SmartVaultConsumer>
		);
	}
}
UpgradePage.contextType = SmartVaultContext;

export default UpgradePage;