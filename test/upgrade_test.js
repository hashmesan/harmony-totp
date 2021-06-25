
const truffleAssert = require("truffle-assertions");
const ethers = require("ethers");
const merkle = require("../lib/merkle.js");
const commons = require("./commons.js");

contract("Upgrade", accounts => {
	
	it("should be able to upgrade", async () => {
		var merkelHeight = 6;
		var salt = 100;
		var dailyLimit = web3.utils.toWei("0.01", "ether");
		var walletFactory = await commons.createWalletFactory();
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
		await web3.eth.sendTransaction({ from: accounts[0], to: walletAddrComputed, value: web3.utils.toWei("1", "ether") , gas: 300000});
		var newBalance = await web3.eth.getBalance(walletAddrComputed);
		console.log("WalltComputed", newBalance);		

		var wallet = await walletFactory.createWallet({
			name: web3.utils.utf8ToHex("testname"),
			owner: tmpWallet.address,
			rootHash: root_arr,
			merkelHeight: merkelHeight,
			drainAddr: tmpWallet.address,
			dailyLimit: dailyLimit,
			salt: salt,
			feeReceipient: feeReceipient,
			feeAmount: feeAmount
		});

		console.log(walletAddrComputed);
		var wallet = await commons.walletWithAddress(walletAddrComputed);
		var owner = await wallet.getOwner();
		console.log("owner=", owner);
		assert.equal(tmpWallet.address, owner, "Expect owner is same");

		var relayerBalance = await web3.eth.getBalance(relayerWallet.address);
		assert.equal(relayerBalance, feeAmount, "Relayer expected to receive a fee");

		//console.log(wallet);
		var newVersion = await commons.createNewImplementation();
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
            0,
            gasLimit,
            ethers.constants.AddressZero,
            feeWallet.address
        );

        await wallet.executeMetaTx(methodData, sigs, nonce, 0, gasLimit, ethers.constants.AddressZero, feeWallet.address);
		console.log("method=", methodData);
        newBalance = await web3.eth.getBalance(dest.address);
        console.log("Balance=", newBalance);
        assert.equal(newBalance, web3.utils.toWei(".0012345", "ether"), "withdraw amount is correct");

	});
});
