
const truffleAssert = require("truffle-assertions");
const ethers = require("ethers");
const merkle = require("../lib/merkle.js");
const commons = require("./commons.js");

contract("OTPWallet", accounts => {

    it("should transfer with direct signed requests", async () => {
        var tmpWallet = web3.eth.accounts.create();
        var {root, leaves, wallet} = await commons.createWallet(accounts[0] ,8, tmpWallet.address, tmpWallet.address, 0);
        console.log("root="+ root);

        await web3.eth.sendTransaction({from: accounts[0], to: wallet.address, value: web3.utils.toWei("1", "ether")});
        await wallet.makeTransfer(tmpWallet.address, web3.utils.toWei("0.001234", "ether"));

        var newBalance = await web3.eth.getBalance(tmpWallet.address);
        console.log("Balance=", newBalance);
        assert.equal(newBalance, web3.utils.toWei(".001234", "ether"), "withdraw amount is correct");

    //     //var proof = await commons.getTOTPAndProof(counter, leaves);

    //     // proof = await commons.getTOTPAndProof(counter.leaves);
    //     // await wallet.drain(proof[0], proof[1])
    //     // var newBalance = await web3.eth.getBalance(tmpWallet.address);
    //     // console.log("Balance=", newBalance);
    //     // assert.equal(newBalance, web3.utils.toWei("1", "ether"), "withdraw amount is correct");

    })

    it("should transfer with meta request from relayer", async () => {
        const gasLimit = 100000;
        const nonce = await commons.getNonceForRelay();

        var feeWallet = web3.eth.accounts.create();
        var tmpWallet = web3.eth.accounts.create();
        var {root, leaves, wallet} = await commons.createWallet(tmpWallet.address ,8, tmpWallet.address, tmpWallet.address, 0);
        await web3.eth.sendTransaction({from: accounts[0], to: wallet.address, value: web3.utils.toWei("1", "ether")});
        const methodData = wallet.contract.methods.makeTransfer(tmpWallet.address, web3.utils.toWei("0.0012345", "ether")).encodeABI();
                
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

        var newBalance = await web3.eth.getBalance(tmpWallet.address);
        console.log("Balance=", newBalance);
        assert.equal(newBalance, web3.utils.toWei(".0012345", "ether"), "withdraw amount is correct");

    });
});