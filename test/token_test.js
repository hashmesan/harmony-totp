
const truffleAssert = require("truffle-assertions");
const ethers = require("ethers");
const commons = require("./commons.js");
const walletLib = require("../lib/wallet.js");
const web3utils = require("web3-utils");

contract("OTPWallet", accounts => {

    it("should transfer with direct signed requests", async () => {
        const blockNumber = await web3.eth.getBlockNumber();
        var tmpWallet = web3.eth.accounts.create();
        var {root, leaves, wallet} = await commons.createWallet(
            ethers.constants.AddressZero,
            ["",""],
            accounts[0] ,
            8, 
            web3.utils.toWei("100", "ether"),
            tmpWallet.address, 
            tmpWallet.address, 
            0);
        console.log("root="+ root);

        await web3.eth.sendTransaction({from: accounts[0], to: wallet.address, value: web3.utils.toWei("2", "ether")});
        await wallet.makeTransfer(tmpWallet.address, web3.utils.toWei("0.001234", "ether"));

        var newBalance = await web3.eth.getBalance(tmpWallet.address);
        console.log("Balance=", newBalance);
        assert.equal(newBalance, web3.utils.toWei(".001234", "ether"), "withdraw amount is correct");
    })
})