
const truffleAssert = require("truffle-assertions");
const ethers = require("ethers");
const commons = require("./commons.js");
const EnsResolver = artifacts.require("EnsResolver");
const namehash = require('eth-ens-namehash');
//const ENS = require('@ensdomains/ens/build/contracts/ENS.json');
const ENS = artifacts.require("@ensdomains/ens/ENSRegistry");
const walletLib = require("../lib/wallet.js");

contract("Upgrade", accounts => {
	var relayerWallet = web3.eth.accounts.create();
	var feeAmount = web3.utils.toWei("0.0012345", "ether");		
	const resolverAddr = "0x9590030b26dE3A037Cd679b33A177A645BFaC114";

    async function createFactoryWallet(owner, salt) {
		const blockNumber = await web3.eth.getBlockNumber();
		const resolverAddr = "0x9590030b26dE3A037Cd679b33A177A645BFaC114";
        const chainId = await web3.eth.getChainId();

		var merkelHeight = 6;
		var dailyLimit = web3.utils.toWei("1000");
		var walletFactory = await commons.createWalletFactory(resolverAddr);
		var {root_arr, leaves_arr} = walletLib.createHOTP("SECRET", merkelHeight);
		var feeReceipient = relayerWallet.address;

        const walletAddrComputed = await walletFactory.computeWalletAddress(
			owner,
			salt
		  );
		await web3.eth.sendTransaction({ from: accounts[0], to: walletAddrComputed, value: web3.utils.toWei("2", "ether") , gas: 300000});

        var subdomain = "superlongcrazynameverycheap000001" + blockNumber + salt;
		var smartWallet = await walletFactory.createWallet({
			resolver: resolverAddr,
			domain: [subdomain, "crazy"],
			owner: owner,
			rootHash: root_arr,
			merkelHeight: merkelHeight,
			drainAddr: owner,
			dailyLimit: dailyLimit,
			salt: salt,
			feeReceipient: feeReceipient,
			feeAmount: feeAmount
		});

        return walletAddrComputed;        
    }

	it("should be able to upgrade", async () => {
        const blockNumber = await web3.eth.getBlockNumber();
		var tmpWallet = web3.eth.accounts.create();
		var walletAddrComputed = await createFactoryWallet(tmpWallet.address, blockNumber);
		console.log(walletAddrComputed);
		var wallet = await commons.walletWithAddress(walletAddrComputed);
		var owner = await wallet.getOwner();
		console.log("owner=", owner);
		assert.equal(tmpWallet.address, owner, "Expect owner is same");

		var relayerBalance = await web3.eth.getBalance(relayerWallet.address);
		assert.equal(relayerBalance, feeAmount, "Relayer expected to receive a fee");

		//console.log(wallet);
		var newVersion = await commons.createNewImplementation(resolverAddr);
        var methodData = wallet.contract.methods.upgradeMasterCopy(newVersion.address).encodeABI();
                
        const gasLimit = 100000;
        const nonce = await commons.getNonceForRelay();
		// zero signature required, just HOTP
        var sigs = await commons.signOffchain2(
            [tmpWallet],
            walletAddrComputed,
            0,
            methodData,
            chainId,
            nonce,
            0,
            gasLimit,
            ethers.constants.AddressZero,
            ethers.constants.AddressZero
        );

        await wallet.executeMetaTx(methodData, sigs, nonce, 0, gasLimit, ethers.constants.AddressZero, ethers.constants.AddressZero);
		var owner = await wallet.getOwner();
		console.log("owner2=", owner);
		assert.equal(tmpWallet.address, owner, "Expect data not changed, and owner is same");

		var newBalance = await web3.eth.getBalance(wallet.address);
        console.log("Contract Balance=", newBalance);

		var dest = web3.eth.accounts.create();
		var feeWallet = web3.eth.accounts.create();
		methodData = wallet.contract.methods.makeTransfer(dest.address, web3.utils.toWei("0.0012345", "ether")).encodeABI();
                
        var sigs = await commons.signOffchain2(
            [tmpWallet],
            wallet.address,
            0,
            methodData,
            chainId,
            nonce,
            Number(web3.utils.toWei("1", "gwei")),
            gasLimit,
            ethers.constants.AddressZero,
            feeWallet.address
        );

		const tx = await wallet.executeMetaTx(methodData, sigs, nonce, Number(web3.utils.toWei("1", "gwei")), gasLimit, ethers.constants.AddressZero, feeWallet.address);
		console.log("method=", methodData);
		newBalance = await web3.eth.getBalance(dest.address);
		console.log("Balance=", newBalance);
		assert.equal(newBalance, web3.utils.toWei(".0012345", "ether"), "withdraw amount is correct");

		newBalance = await web3.eth.getBalance(feeWallet.address);
		console.log("Fee Balance=", newBalance, "Actual cost=", tx.receipt.gasUsed);
		assert.isTrue(newBalance > tx.receipt.gasUsed);

	});
});
