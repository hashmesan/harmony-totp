
const truffleAssert = require("truffle-assertions");
const ethers = require("ethers");
const merkle = require("../lib/merkle.js");
const commons = require("./commons.js");

contract("OTPWallet", accounts => {

    it("should transfer & drain", async () => {
        var tmpWallet = web3.eth.accounts.create();
        var {root, leaves, wallet} = await commons.createWallet(accounts[0] ,8, tmpWallet.address);
        console.log("root="+ root);

        await web3.eth.sendTransaction({from: accounts[0], to: wallet.address, value: web3.utils.toWei("1", "ether")});

        var counter = await wallet.getCounter();
        console.log("Counter=", counter);
        await wallet.makeTransfer(tmpWallet.address, web3.utils.toWei("0.001234", "ether"));

        var newBalance = await web3.eth.getBalance(tmpWallet.address);
        console.log("Balance=", newBalance);
        assert.equal(newBalance, web3.utils.toWei(".001234", "ether"), "withdraw amount is correct");

        //var proof = await commons.getTOTPAndProof(counter, leaves);

        // proof = await commons.getTOTPAndProof(counter.leaves);
        // await wallet.drain(proof[0], proof[1])
        // var newBalance = await web3.eth.getBalance(tmpWallet.address);
        // console.log("Balance=", newBalance);
        // assert.equal(newBalance, web3.utils.toWei("1", "ether"), "withdraw amount is correct");

    })

});