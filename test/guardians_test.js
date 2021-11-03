
const truffleAssert = require("truffle-assertions");
const ethers = require("ethers");
const commons = require("./commons.js");

const DURATION = 300;
const time = Math.floor((Date.now() / 1000));
const timeOffset = time - (time% 300);        


// TODO: update with meta tx
contract("Guardians", accounts => {

    it("should add guardian", async () => {
        var tmpWallet = web3.eth.accounts.create();
        var { root, leaves, wallet } = await commons.createWallet(
            ethers.constants.AddressZero,
            ["", "","hashId"],
            accounts[0],
            8,
            web3.utils.toWei("0.1", "ether"),
            tmpWallet.address,
            tmpWallet.address,
            0);
        
        await wallet.addGuardian(tmpWallet.address);
        var guardians = await wallet.getGuardians();
        //console.log(guardians);
        assert.equal(guardians.length, 1);
    })

    it("should remove guardian", async () => {
        var tmpWallet = web3.eth.accounts.create();
        var { root, leaves, wallet } = await commons.createWallet(
            ethers.constants.AddressZero,
            ["", "","hashId"],
            accounts[0],
            8,
            web3.utils.toWei("0.1", "ether"),
            tmpWallet.address,
            tmpWallet.address,
            0);

        await wallet.addGuardian(tmpWallet.address);
        await wallet.revokeGuardian(tmpWallet.address);

        var guardians = await wallet.getGuardians();
        //console.log(guardians);
        assert.equal(guardians[0], "0x0000000000000000000000000000000000000000");
    })    
})