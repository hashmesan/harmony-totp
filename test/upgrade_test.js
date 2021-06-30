
const truffleAssert = require("truffle-assertions");
const ethers = require("ethers");
const merkle = require("../lib/merkle.js");
const commons = require("./commons.js");
const EnsResolver = artifacts.require("EnsResolver");
const namehash = require('eth-ens-namehash');
//const ENS = require('@ensdomains/ens/build/contracts/ENS.json');
const ENS = artifacts.require("@ensdomains/ens/ENSRegistry");

contract("Upgrade", accounts => {
	
	it("should be able to upgrade", async () => {
		
		const blockNumber = await web3.eth.getBlockNumber();
		const resolverAddr = "0xd09fD54DD8A3A7d02676a1813CDf0d720E6Dbe89";

		var merkelHeight = 6;
		var salt = 100;
		var dailyLimit = web3.utils.toWei("0.01", "ether");
		var walletFactory = await commons.createWalletFactory(resolverAddr);
		var tmpWallet = web3.eth.accounts.create();
		var {root_arr, leaves_arr} = commons.createHOTP(merkelHeight);
		var relayerWallet = web3.eth.accounts.create();
		var feeReceipient = relayerWallet.address;
		var feeAmount = web3.utils.toWei("0.0012345", "ether");		
		var sigs = await commons.signCreateTx([tmpWallet], tmpWallet.address, root_arr, merkelHeight, tmpWallet.address, dailyLimit, salt, feeReceipient, feeAmount);

		const walletAddrComputed = await walletFactory.computeWalletAddress(
			tmpWallet.address,
			salt
		  );
		await web3.eth.sendTransaction({ from: accounts[0], to: walletAddrComputed, value: web3.utils.toWei("2", "ether") , gas: 300000});
		var newBalance = await web3.eth.getBalance(walletAddrComputed);
		console.log("WalltComputed", newBalance);		

		var subdomain = "superlongcrazynameverycheap000001" + blockNumber;
		var smartWallet = await walletFactory.createWallet({
			resolver: resolverAddr,
			domain: [subdomain, "crazy"],
			owner: tmpWallet.address,
			rootHash: root_arr,
			merkelHeight: merkelHeight,
			drainAddr: tmpWallet.address,
			dailyLimit: dailyLimit,
			salt: salt,
			feeReceipient: feeReceipient,
			feeAmount: feeAmount
		});
	
		const resolver = await EnsResolver.at(resolverAddr);
		console.log("RESOLVED!", await resolver.addr(namehash.hash(subdomain + '.crazy.one')), walletAddrComputed);

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
            0,
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
            0,
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

		console.log(await walletFactory.getCreated());
	});
});
