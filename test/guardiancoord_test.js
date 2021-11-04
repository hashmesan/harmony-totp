
const truffleAssert = require("truffle-assertions");
const ethers = require("ethers");
const commons = require("./commons.js");
const GuardianCoordinator = artifacts.require("GuardianCoordinator");
const merkle = require("../lib/merkle_hex.js");

contract("Guardian Coord tests", accounts => {
    function concat(a, b) {
        console.log(a,b);
        const message = `0x${[a, b].map((hex) => hex.slice(2)).join("")}`;
        return message;
    }

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

        var methodData = web3.utils.soliditySha3(concat(nonce, wallet.contract.methods.startRecoverCommit(secretHash, dataHash).encodeABI()));
        console.log("sighash=", methodData);
        var sigs = await commons.signMessage(methodData, attackerWallet);
        await truffleAssert.reverts(coord.startRecovery(wallet.address, secretHash, dataHash, nonce, sigs), "Invalid owner signature");

        var sigs = await commons.signMessage(methodData, ownerWallet);
        await coord.startRecovery(wallet.address, secretHash, dataHash, nonce, sigs);

        var sigs = await commons.signMessage(methodData, guardian1);
        await coord.submitRecoverySig(wallet.address, sigs);

        var hasEnough = await coord.hasEnoughRecoverySigs(wallet.address);
        console.log("has enough?", hasEnough);

        var recoverySigs = await coord.getRecoverySigs(wallet.address);
        console.log(recoverySigs);
    });

    it.only("start session flow", async () => {
        const chainId = await web3.eth.getChainId();
        const gasLimit = 100000;
        var nonce = await commons.getNonceForRelay();
        console.log("nonce", nonce)
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
        var duration = 1000;

        var methodData = web3.utils.soliditySha3(concat(nonce, wallet.contract.methods.startSession(duration).encodeABI()));
        console.log("sighash=", wallet.contract.methods.startSession(duration).encodeABI());
        var sigs = await commons.signMessage(methodData, attackerWallet);
        await truffleAssert.reverts(coord.startSession(wallet.address, duration, nonce, sigs), "Invalid owner signature");

        //0x7712761200000000000000000000000000000000000000000000000000000000000003e8
        var sigs = await commons.signMessage(methodData, ownerWallet);
        await coord.startSession(wallet.address, duration, nonce, sigs);

        var sigs = await commons.signMessage(methodData, guardian1);
        await coord.submitSessionSig(wallet.address, sigs);

        var hasEnough = await coord.hasEnoughSessionSigs(wallet.address);
        console.log("has enough?", hasEnough);
        assert.isTrue(hasEnough);

        var sessionSigs = await coord.getSessionSigs(wallet.address);
        console.log(sessionSigs);
        assert.strictEqual(sessionSigs.length, 1);
    });    
});