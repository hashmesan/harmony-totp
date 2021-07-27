
const truffleAssert = require("truffle-assertions");
const ethers = require("ethers");
const commons = require("./commons.js");

const DURATION = 300;
const time = Math.floor((Date.now() / 1000));
const timeOffset = time - (time% 300);        

contract("DailyLimit", accounts => {

    it("should test for daily limit", async () => {
        var tmpWallet = web3.eth.accounts.create();
        var { root, leaves, wallet } = await commons.createWallet(
            ethers.constants.AddressZero,
            ["", ""],
            accounts[0],
            8,
            web3.utils.toWei("0.1", "ether"),
            tmpWallet.address,
            tmpWallet.address,
            0);
        
        await web3.eth.sendTransaction({from: accounts[0], to: wallet.address, value: web3.utils.toWei("1", "ether")});
        await wallet.makeTransfer(tmpWallet.address, web3.utils.toWei("0.001234", "ether"));
        var newBalance = await web3.eth.getBalance(tmpWallet.address);
        //console.log(newBalance);

        var overlimit = wallet.makeTransfer(tmpWallet.address, web3.utils.toWei("0.2", "ether"));
        await truffleAssert.reverts(overlimit, "revert over withdrawal limit");
    })

})