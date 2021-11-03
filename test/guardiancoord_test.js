
const truffleAssert = require("truffle-assertions");
const ethers = require("ethers");
const commons = require("./commons.js");
const GuardianCoordinator = artifacts.require("GuardianCoordinator");

contract("Guardian Coord tests", accounts => {
    it("start recovery flow", async () => {
        const chainId = await web3.eth.getChainId();
        const gasLimit = 100000;
        const nonce = await commons.getNonceForRelay();

        var attackerWallet = web3.eth.accounts.create();
        var ownerWallet = web3.eth.accounts.create();
        var guardian1 = web3.eth.accounts.create();

        var { root, leaves, wallet } = await commons.createWallet(
            ethers.constants.AddressZero,
            ["", "","hashId"],
            ownerWallet.address,
            8,
            web3.utils.toWei("0.1", "ether"),
            ownerWallet.address,
            ownerWallet.address,
            0);

        var methodData = wallet.contract.methods.addGuardian(guardian1.address).encodeABI();
        var sigs = await commons.signOffchain2(
            [ownerWallet],
            wallet.address,
            0,
            methodData,
            chainId,
            nonce,
            0,
            gasLimit,
            ethers.constants.AddressZero,
            ethers.constants.AddressZero
        );

        var tx = await wallet.executeMetaTx(methodData, sigs, nonce, 
            0, gasLimit, 
            ethers.constants.AddressZero, 
            ethers.constants.AddressZero);       

        var guardians = await wallet.getGuardians();
        console.log("guardians=", guardians);
        assert.strictEqual(guardians.length, 1);

        // EXPECT TO SUBMIT START RECOVERY
        var coord = await GuardianCoordinator.new();
        var secretHash = web3.utils.soliditySha3("junk");
        var dataHash = web3.utils.soliditySha3("junk");

        var methodData = web3.utils.soliditySha3(wallet.contract.methods.startRecoverCommit(secretHash, dataHash).encodeABI());
        console.log("sighash=", methodData);
        var sigs = await commons.signMessage(methodData, attackerWallet);
        await truffleAssert.reverts(coord.startRecovery(wallet.address, secretHash, dataHash, sigs), "Invalid owner signature");

        var sigs = await commons.signMessage(methodData, ownerWallet);
        await coord.startRecovery(wallet.address, secretHash, dataHash, sigs);

        var sigs = await commons.signMessage(methodData, guardian1);
        await coord.submitRecoverySig(wallet.address, sigs);

        var hasEnough = await coord.hasEnoughRecoverySigs(wallet.address);
        console.log("has enough?", hasEnough);

        var recoverySigs = await coord.getRecoverySigs(wallet.address);
        console.log(recoverySigs);
    });
});