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
import RelayerClient from '../../../../lib/relayer_client';
import {HarmonyAddressInput, normalizeHarmonyAddress} from "../common/address_input";
import { isValidAddress,isBech32Address } from "@harmony-js/utils";

function SendPayment({confirmMetasign}) {
	const context = useContext(SmartVaultContext);
	const form = useForm({
		initialValues: {
			address: ""
		},
	
		validationRules: {
			address: (value) => isValidAddress(value),
			sendAmount: (value) => /^[1-9]\d*$|^\.\d+$|^0\.\d*$|^[1-9]\d*\.\d*$/.test(value),
		},
	  });
	
	function updateFee() {
		this.setState({ gasFee: web3utils.toBN(this.state.gasLimit).mul(web3utils.toBN(web3utils.toWei(this.state.gasPrice, 'gwei'))) })
	}

	function submitForm({address, sendAmount}) {
		var from = context.smartvault.walletData.walletAddress;
		var methodData = RelayerClient.getContract().methods.multiCall([{to: normalizeHarmonyAddress(address), value: web3utils.toWei(sendAmount), data: "0x"}]).encodeABI()
		console.log(methodData);
		confirmMetasign({
			raw: methodData,
			gasLimit: context.smartvault.config.gasLimit,
			gasPrice: web3utils.fromWei(context.smartvault.config.gasPrice + "", "gwei"),
			gasFee: web3utils.fromWei(web3utils.toBN(context.smartvault.config.gasLimit).mul(web3utils.toBN(context.smartvault.config.gasPrice)).toString())
		})
	}

	return (
		<SmartVaultConsumer>
			{({smartvault}) => (				
		<div className="card">
			<div className="card-body">
				<Title order={1}  style={{ marginBottom: 10 }}>SEND PAYMENT</Title>
				<form onSubmit={form.onSubmit((values) => submitForm(values))}>
					<HarmonyAddressInput placeholder="one..." label="Recipient Address" 
						radius="md" size="lg" required
						error={form.errors.address && 'Specify valid address'}
						value={form.values.address} onChange={(value) => form.setFieldValue('address',value)} />
					
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