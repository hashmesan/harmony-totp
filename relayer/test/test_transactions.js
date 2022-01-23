var expect = require('chai').expect;
var assert = require('assert');

var ethers = require("ethers");
var web3utils = require("web3-utils");
var RelayerClient = require("../../lib/relayer_client.js");
var Transactions = require("./../src/web3/transactions.js");

const walletArtifacts = require('../../build/contracts/TOTPWallet.json');
const env = "testnet0";

describe('testTransactions()', function () {
	it('getFactory', async function () {
		const res = await new Transactions(env).getFactoryInfo()
		console.log(res)
		expect(res).to.have.property("walletsCreated")
	});

	it('getBalance', async function () {
		const res = await new Transactions(env).getBalance("0xEE2fB9b983BD9A31D9bb017B381728737fCFd6cc");
		console.log(res);
		expect(res).to.have.property("balance")
	});

	it('getDepositAddress', async function () {
		const res = await new Transactions(env).getDepositAddress({
			owner: "0xEE2fB9b983BD9A31D9bb017B381728737fCFd6cc",
			salt: 1000
		});
		console.log("getDepositAddress", res);
		expect(res).to.have.property("address")
	});

	it('getContractCreated', async function () {
		const res = await new Transactions(env).getContractCreated();
		// console.log(res);
		expect(res).to.have.property("factories")
	})

	it('createWallet', async function() {
		var ownerWallet = ethers.Wallet.createRandom();
		var user = "test_" + Math.floor(Date.now() / 1000);

		var config = {
			domain: [user, "sefwallet.one", "IPFSKEY"],
			owner: ownerWallet.address,
			rootHash: [],
			merkelHeight: 8,
			drainAddr: ethers.constants.AddressZero,
			dailyLimit: web3utils.toWei("1000"),
			salt: 100,
			feeReceipient: ethers.constants.AddressZero,
			feeAmount: '0',
			resolver: '0x51766DEF619112F76dF1FD7C361e0C6F47eE19de'
		}
		var res = await new Transactions(env).createWallet(config);
		console.log(res);
		expect(res).to.have.property("tx")
		expect(res.tx).to.have.property("hash")

		var nonce = 1
		const walletInterface = new ethers.utils.Interface(walletArtifacts.abi);
		var methodData = walletInterface.encodeFunctionData('setDailyLimit', ["0x42"])
		var sigs = []

		var tx = {
			from: ownerWallet.address,
			data: methodData,
			signatures: sigs,
			nonce,
			gasPrice: '30000000000',
			gasLimit: '35000',
			refundToken: ethers.constants.AddressZero,
			refundAddress: ethers.constants.AddressZero
		}
		res = await new Transactions(env).submitMetaTx(tx);
		console.log(res);

		expect(res).to.have.property("tx")
		expect(res.tx).to.have.property("hash")

	})
});