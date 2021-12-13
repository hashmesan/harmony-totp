
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
        var ownerWallet = web3.eth.accounts.create();
        var tmpWallet = web3.eth.accounts.create();
        var guardian1 = accounts[1];

        var { root, leaves, wallet } = await commons.createWallet(
            ethers.constants.AddressZero,
            ["", "","hashId"],
            ownerWallet.address,
            8,
            web3.utils.toWei("0.1", "ether"),
            tmpWallet.address,
            tmpWallet.address,
            0);

        //await wallet.addGuardian(tmpWallet.address);
        //await wallet.revokeGuardian(tmpWallet.address);

        var methodData0 = wallet.contract.methods.addGuardian(guardian1).encodeABI();
        await commons.executeMetaTx(wallet, methodData0, [ownerWallet])

        var methodData0 = wallet.contract.methods.revokeGuardian(guardian1).encodeABI();
        var tx = commons.executeMetaTx(wallet, methodData0, [ownerWallet])
        await truffleAssert.reverts(tx, "unknown method/try session");

        var duration = 60*60;
        var res = await commons.startSession(wallet, duration, [ownerWallet])

        var methodData = wallet.contract.methods.startSession(duration).encodeABI();
        await wallet.guardianApprove(methodData, {from: guardian1});

        var methodData1 = wallet.contract.methods.multiCallWithSession([{to: wallet.address, value: 0, data: methodData0}]).encodeABI();
        await commons.executeMetaTx(wallet, methodData1, [ownerWallet])

        var guardians = await wallet.getGuardians();
        console.log(guardians);
        assert.equal(guardians.length, 0);
    })    
})