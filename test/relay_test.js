
const truffleAssert = require("truffle-assertions");
const ethers = require("ethers");
const merkle = require("../lib/merkle.js");
const commons = require("./commons.js");
const Relayer = artifacts.require("Relayer");

contract("Relayer", accounts => {

	it("should be able to transfer before create", async () => {

	});

	it("should be able to relay", async () => {
		var merkelHeight = 6;
		var salt = 100;
		var dailyLimit = web3.utils.toWei("0.01", "ether");
		var walletFactory = await commons.createWalletFactory();
		var tmpWallet = web3.eth.accounts.create();
		const relay = await Relayer.new(walletFactory.address, 5);
		// await web3.eth.sendTransaction({ from: accounts[0], to: relay.address, value: web3.utils.toWei("1", "ether"), gas: 300000 });

		var { root_arr, leaves_arr } = commons.createHOTP(merkelHeight);
		var sigs = await commons.signCreateTx([tmpWallet], tmpWallet.address, root_arr, merkelHeight, tmpWallet.address, dailyLimit, salt);

		var walletConfig = {
			owner: tmpWallet.address,
			rootHash: root_arr,
			merkelHeight: merkelHeight,
			drainAddr: tmpWallet.address,
			dailyLimit: dailyLimit,
			signature: sigs,
			salt: salt
		}
		console.log(walletConfig)
		
		var networkFee = web3.utils.toWei("0.01", "ether");
		var tx = await relay.submitNewWalletQueue(walletConfig, networkFee, false);
		var forwarderAddr;
		truffleAssert.eventEmitted(tx, 'EnqueuedNewWallet', (ev) => {
			forwarderAddr = ev[0];
			return true;
		});
		console.log("Forwarder: ", forwarderAddr);
		await web3.eth.sendTransaction({ from: accounts[0], to: forwarderAddr, value: web3.utils.toWei("1", "ether") , gas: 300000});

		var newBalance = await web3.eth.getBalance(relay.address);
		console.log("RelayBalance", newBalance);

		var smartWallet;
		var tx = await relay.processWallet(forwarderAddr);
		truffleAssert.eventEmitted(tx, 'WalletCreated', (ev) => {
			smartWallet = ev[0];
			return true;
		});
		console.log("Smart wallet=", smartWallet);
		// await web3.eth.sendTransaction({ from: accounts[0], to: smartWallet, value: web3.utils.toWei("1", "ether"), gas: 300000 });
		
		newBalance = await web3.eth.getBalance(relay.address);
		console.log("RelayBalance", newBalance);

		// await relay.processWalletTransfer(forwarderAddr);

		newBalance = await web3.eth.getBalance(smartWallet);
		console.log("smartWalletBalance", newBalance);
		assert.equal(newBalance, 990000000000000000);

		await relay.collectFees();
  });
});