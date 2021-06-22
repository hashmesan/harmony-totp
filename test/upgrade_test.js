
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

		var sigs = await commons.signCreateTx([tmpWallet], tmpWallet.address, root_arr, merkelHeight, tmpWallet.address, dailyLimit, salt);

		var wallet = await walletFactory.createWallet({
			owner: tmpWallet.address,
			rootHash: root_arr,
			merkelHeight: merkelHeight,
			drainAddr: tmpWallet.address,
			dailyLimit: dailyLimit,
			signature: sigs,
			salt: salt
		});

		const walletAddrComputed = await walletFactory.computeWalletAddress(
			tmpWallet.address,
			salt
		  );
		console.log(walletAddrComputed);
		var wallet = await commons.walletWithAddress(walletAddrComputed);
		var owner = await wallet.getOwner();
		console.log("owner=", owner);
		assert.equal(tmpWallet.address, owner, "Expect owner is same");


		//console.log(wallet);
		var newVersion = await commons.createNewImplementation();
        const methodData = wallet.contract.methods.upgradeMasterCopy(newVersion.address).encodeABI();
                
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
	});
});