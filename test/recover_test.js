
const truffleAssert = require("truffle-assertions");
const ethers = require("ethers");
const merkle = require("../lib/merkle.js");
const commons = require("./commons.js");

const DURATION = 300;
const time = Math.floor((Date.now() / 1000));
const timeOffset = time - (time% 300);        

contract("Recovery", accounts => {

    it("should start recovery with HOTP", async () => {
        const gasLimit = 100000;
        const nonce = await commons.getNonceForRelay();
        var tmpWallet = web3.eth.accounts.create();
        var newOwnerWallet = web3.eth.accounts.create();
        var {root_arr, leaves_arr, wallet} = await commons.createWallet(accounts[0] ,8, tmpWallet.address);
        var {token, proof} = await commons.getTOTPAndProof(0, 0, leaves_arr);
        console.log(newOwnerWallet.address, proof[0]);
        var commitHash =  web3.utils.soliditySha3(merkle.concat(newOwnerWallet.address,proof[0]));
        console.log("commitHash: ", commitHash)
        // await wallet.startRecoverCommit(commitHash);

        const methodData = wallet.contract.methods.startRecoverCommit(commitHash).encodeABI();
                
        // zero signature required, just HOTP
        var sigs = await commons.signOffchain2(
            [],
            wallet.address,
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

        const methodData2 = wallet.contract.methods.startRecoveryReveal(newOwnerWallet.address, proof).encodeABI();
        sigs = await commons.signOffchain2(
            [],
            wallet.address,
            0,
            methodData2,
            0,
            nonce,
            0,
            gasLimit,
            ethers.constants.AddressZero,
            ethers.constants.AddressZero
        );

        await wallet.executeMetaTx(methodData2, sigs, nonce, 0, gasLimit, ethers.constants.AddressZero, ethers.constants.AddressZero);

        // await wallet.startRecoveryReveal(newOnerWallet.address, proof);

        var pendingRecovery = await wallet.getRecovery();
        //console.log("recovery:", pendingRecovery);
        assert.equal(pendingRecovery[0], newOwnerWallet.address);

        await truffleAssert.reverts(wallet.finalizeRecovery(), "ongoing recovery period");
        await commons.increaseTime(86500);
        await wallet.finalizeRecovery(); 
        
        var postRecovery = await wallet.getRecovery();
        // validate pendingRecovery has reset and new owner set
        //console.log("recovery:", postRecovery);
        assert.equal(postRecovery[0], "0x0000000000000000000000000000000000000000");

        var newOwner = await wallet.getOwner();
        assert.equal(newOwner, newOwnerWallet.address);

        // validate transaction works
    })
    it("should start recovery with HOTP with 3 offsets", async () => {
        const gasLimit = 100000;
        const nonce = await commons.getNonceForRelay();
        var tmpWallet = web3.eth.accounts.create();
        var newOwnerWallet = web3.eth.accounts.create();
        var {root_arr, leaves_arr, wallet} = await commons.createWallet(accounts[0] ,8, tmpWallet.address);

        // attempting to use HOTP, 3 offset off..
        var {token, proof} = await commons.getTOTPAndProof(3, 0, leaves_arr);

        console.log(newOwnerWallet.address, proof[0]);
        var commitHash =  web3.utils.soliditySha3(merkle.concat(newOwnerWallet.address,proof[0]));
        console.log("commitHash: ", commitHash)
        // await wallet.startRecoverCommit(commitHash);

        const methodData = wallet.contract.methods.startRecoverCommit(commitHash).encodeABI();
                
        // zero signature required, just HOTP
        var sigs = await commons.signOffchain2(
            [],
            wallet.address,
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

        const methodData2 = wallet.contract.methods.startRecoveryReveal(newOwnerWallet.address, proof).encodeABI();
        sigs = await commons.signOffchain2(
            [],
            wallet.address,
            0,
            methodData2,
            0,
            nonce,
            0,
            gasLimit,
            ethers.constants.AddressZero,
            ethers.constants.AddressZero
        );

        await wallet.executeMetaTx(methodData2, sigs, nonce, 0, gasLimit, ethers.constants.AddressZero, ethers.constants.AddressZero);

        var pendingRecovery = await wallet.getRecovery();
        assert.equal(pendingRecovery[0], newOwnerWallet.address);
    });

    it("should able to cancel recovery", async () => {

    })

    // it("should start recovery", async () => {
    //     var wrongWallet = web3.eth.accounts.create();
    //     var tmpWallet = web3.eth.accounts.create();
    //     var {startCounter, root, leaves, wallet} = await commons.createWallet(timeOffset, DURATION, 16, tmpWallet.address);
    //     var proof = await commons.getTOTPAndProof(leaves, timeOffset, DURATION);
    //     await wallet.addGuardian(tmpWallet.address, proof[0], proof[1]);
    //     var guardians = await wallet.getGuardians();
    //     assert.equal(guardians.length, 1);

    //     const newRoot = commons.getLeavesAndRoot(timeOffset, DURATION, 10);

    //     // good signature
    //     var sigs = await commons.signRecoveryOffchain([tmpWallet], newRoot.root, 10, DURATION, timeOffset);
    //     await wallet.startRecovery(newRoot.root, 10, DURATION, timeOffset, sigs);
    //     var isRecovering = await wallet.isRecovering();
    //     assert.equal(isRecovering, true);

    //     // try with a bad hash , 12 when it should be 10
    //     sigs = await commons.signRecoveryOffchain([tmpWallet], newRoot.root, 12, DURATION, timeOffset);
    //     await truffleAssert.reverts(wallet.startRecovery(newRoot.root, 10, DURATION, timeOffset, sigs), "Invalid signatures");

    //     // try with the wrong address
    //     sigs = await commons.signRecoveryOffchain([wrongWallet], newRoot.root, 10, DURATION, timeOffset);
    //     await truffleAssert.reverts(wallet.startRecovery(newRoot.root, 10, DURATION, timeOffset, sigs), "Invalid signatures");
        
    //     await truffleAssert.reverts(wallet.finalizeRecovery(), "ongoing recovery period");

    //     await commons.increaseTime(86500);
    //     await wallet.finalizeRecovery();
    // })

})