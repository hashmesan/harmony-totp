import React, { Component, useContext } from 'react';
const {
	toBech32,
	fromBech32,
} = require('@harmony-js/crypto');
const web3utils = require("web3-utils");
import { SmartVaultContext, SmartVaultConsumer } from "../smartvault_provider";
import Notifications, {notify} from 'react-notify-toast';
import { Button,Title,TextInput, NumberInput, Group, Modal, Text, Card} from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { connect } from "redux-zero/react";
import actions from "../../redux/actions";

function SendPayment({confirmMetasign}) {
	const context = useContext(SmartVaultContext);
	const form = useForm({
		initialValues: {

		},
	
		validationRules: {
		},
	  });

	// componentDidMount() {
	// 	this.setState({
	// 		gasLimit: this.context.smartvault.config.gasLimit,
	// 		gasPrice: web3utils.fromWei(this.context.smartvault.config.gasPrice + "", "gwei"),
	// 		gasFee: web3utils.toBN(this.context.smartvault.config.gasLimit).mul(web3utils.toBN(this.context.smartvault.config.gasPrice))
	// 	});
	// }
	function transfer(e) {
		e.preventDefault();
		var self = this;
		self.setState({ submitting: true });

		this.context.smartvault.relayClient.transferTX(this.context.smartvault.walletData.walletAddress, fromBech32(this.state.destination), web3utils.toWei(this.state.sendAmount), parseInt(web3utils.toWei(""+this.state.gasPrice,'gwei')), this.state.gasLimit, this.context.smartvault.ownerAccount).then(e => {
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

	function updateFee() {
		this.setState({ gasFee: web3utils.toBN(this.state.gasLimit).mul(web3utils.toBN(web3utils.toWei(this.state.gasPrice, 'gwei'))) })
	}

	function submitForm() {
		confirmMetasign({message: "blah"})
	}

	console.log("Actions=", confirmMetasign)

	return (
		<SmartVaultConsumer>
			{({smartvault}) => (				
		<div className="card">
			<div className="card-body">
				<Title order={1}  style={{ marginBottom: 10 }}>SEND PAYMENT</Title>
				<form onSubmit={form.onSubmit((values) => submitForm(values))}>
					<TextInput placeholder="one..." label="Recipient Address" 
						radius="md" size="lg" required
						error={form.errors.address && 'Specify valid address'}
						value={form.values.address} onChange={(e) => form.setFieldValue('address',e.target.value)} />
					
					<TextInput placeholder="0" label="Amount" radius="md"  style={{marginTop: 20}}
						size="lg" required 
						error={form.errors.sendAmount && 'Specify valid sendAmount'}
						value={form.values.sendAmount} onChange={(e) => form.setFieldValue('sendAmount', e.target.value)}/>

					<Button size="lg"  type="submit" fullWidth style={{marginTop: 20}}>
						Submit Transaction
					</Button>
				</form>
			</div>
		</div>)}
		</SmartVaultConsumer>
	);
}

export default connect(null, actions)(SendPayment);