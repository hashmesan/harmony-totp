
const truffleAssert = require("truffle-assertions");
const ethers = require("ethers");
const merkle = require("../lib/merkle_hex.js");
const commons = require("./commons.js");

const DURATION = 300;
const time = Math.floor((Date.now() / 1000));
const timeOffset = time - (time% 300);        
const RelayerClient = require("../lib/relayer_client");
const HarmonyClient = require("../lib/harmony_client");

contract("Recovery", accounts => {

    it("should start recovery with HOTP", async () => {
        const gasLimit = 100000;
        const nonce = await commons.getNonceForRelay();
        var tmpWallet = web3.eth.accounts.create();
        var feeWallet = web3.eth.accounts.create();
        var newOwnerWallet = web3.eth.accounts.create();
        const chainId = await web3.eth.getChainId();

        //createWallet(resolver, domain,owner, depth, spendingLimit, drainAddr, feeAddress, feeAmount) {
        var {root_arr, leaves_arr, wallet} = await commons.createWallet(
                    ethers.constants.AddressZero,  //resolver
                    ["","","hashId"],
                    accounts[0], //owner
                    8,
                    web3.utils.toWei("100", "ether"),
                    accounts[0],
                    feeWallet.address, 
                    "0" // fee
                    );

        var info = await wallet.contract.methods.wallet().call();
        console.log("Current OWNER=", info.owner);

        var {token, proof} = await commons.getTOTPAndProof(0, 0, leaves_arr);
        console.log("NEW OWNER=", newOwnerWallet.address,"TOKEN=", proof[0]);
        console.log("precommit=", merkle.concat(newOwnerWallet.address,proof[0]));
        
        var secretHash = web3.utils.soliditySha3(proof[0]);
        var commitHash =  web3.utils.soliditySha3(merkle.concat(newOwnerWallet.address,proof[0]));
        console.log("commitHash: ", commitHash)
        // await wallet.startRecoverCommit(commitHash);

        const methodData = wallet.contract.methods.startRecoverCommit(secretHash, commitHash).encodeABI();
                
        // zero signature required, just HOTP
        var sigs = await commons.signOffchain2(
            [],
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

        await wallet.executeMetaTx(methodData, sigs, nonce, 0, gasLimit, ethers.constants.AddressZero, ethers.constants.AddressZero);

        const methodData2 = wallet.contract.methods.startRecoveryReveal(newOwnerWallet.address, proof).encodeABI();
        sigs = await commons.signOffchain2(
            [],
            wallet.address,
            0,
            methodData2,
            chainId,
            nonce,
            0,
            gasLimit,
            ethers.constants.AddressZero,
            ethers.constants.AddressZero
        );

        await wallet.executeMetaTx(methodData2, sigs, nonce, 0, gasLimit, ethers.constants.AddressZero, ethers.constants.AddressZero);

        // await wallet.startRecoveryReveal(newOnerWallet.address, proof);

        // var pendingRecovery = await wallet.getRecovery();
        // //console.log("recovery:", pendingRecovery);
        // assert.equal(pendingRecovery[0], newOwnerWallet.address);
 
        // await truffleAssert.reverts(wallet.finalizeRecovery(), "ongoing recovery period");
        // await commons.increaseTime(86500);
        // await wallet.finalizeRecovery(); 
        
        // var postRecovery = await wallet.getRecovery();
        // // validate pendingRecovery has reset and new owner set
        // //console.log("recovery:", postRecovery);
        // assert.equal(postRecovery[0], "0x0000000000000000000000000000000000000000");

        var newOwner = await wallet.getOwner();
        console.log("contract owner", newOwner);
        assert.equal(newOwner, newOwnerWallet.address);

        //
        // make sure an attacker can't re-use the same token
        //
        var attackerWallet = web3.eth.accounts.create();
        var secretHash = web3.utils.soliditySha3(proof[0]);
        var commitHash =  web3.utils.soliditySha3(merkle.concat(attackerWallet.address,proof[0]));
        const methodData3 = wallet.contract.methods.startRecoverCommit(secretHash, commitHash).encodeABI();
                
        // zero signature required, just HOTP
        var sigs = await commons.signOffchain2(
            [],
            wallet.address,
            0,
            methodData3,
            chainId,
            nonce,
            0,
            gasLimit,
            ethers.constants.AddressZero,
            ethers.constants.AddressZero
        );

        await wallet.executeMetaTx(methodData3, sigs, nonce, 0, gasLimit, ethers.constants.AddressZero, ethers.constants.AddressZero);

        const methodData4 = wallet.contract.methods.startRecoveryReveal(attackerWallet.address, proof).encodeABI();
        sigs = await commons.signOffchain2(
            [],
            wallet.address,
            0,
            methodData4,
            chainId,
            nonce,
            0,
            gasLimit,
            ethers.constants.AddressZero,
            ethers.constants.AddressZero
        );

        var tx = await wallet.executeMetaTx(methodData4, sigs, nonce, 0, gasLimit, ethers.constants.AddressZero, ethers.constants.AddressZero);
        var parsed = RelayerClient.parseRelayReceipt({ logs: tx.logs});
        console.log(parsed)
        assert.strictEqual(parsed.error,"Bad otp counter")

        newOwner = await wallet.getOwner();
        console.log("NEW OWNER (no change)", newOwner);
        assert.equal(newOwner, newOwnerWallet.address);
    });

    it("should start recovery with HOTP with 3 offsets", async () => {
        var newOwnerWallet = web3.eth.accounts.create();
        var attackerWallet = web3.eth.accounts.create();

        var {root_arr, leaves_arr, wallet} = await commons.createWallet(
            ethers.constants.AddressZero,
            ["","","hashId"],
            accounts[0], // drain
            8,
            web3.utils.toWei("100", "ether"),
            accounts[0],
            ethers.constants.AddressZero,
            ethers.constants.AddressZero,
            "0" // fee
        );

        // attempting to use HOTP, 3 offset off..
        var {token, proof} = await commons.getTOTPAndProof(3, 0, leaves_arr);

        console.log(newOwnerWallet.address, proof[0]);
        var secretHash = web3.utils.soliditySha3(proof[0]);
        var commitHash =  web3.utils.soliditySha3(merkle.concat(newOwnerWallet.address,proof[0]));
        console.log("commitHash: ", commitHash)
        // await wallet.startRecoverCommit(commitHash);

        var methodData = wallet.contract.methods.startRecoverCommit(secretHash, commitHash).encodeABI();
        await commons.executeMetaTx(wallet, methodData, [])

        var methodData = wallet.contract.methods.startRecoveryReveal(newOwnerWallet.address, proof).encodeABI();
        var tx = await commons.executeMetaTx(wallet, methodData, [])
        var parsed = RelayerClient.parseRelayReceipt({ logs: tx.logs});
        assert.strictEqual(parsed.success, true);

        var newOwner = await wallet.getOwner();
        console.log("OLD", accounts[0], "NEW OWNER", newOwner, newOwnerWallet.address);
        assert.strictEqual(newOwner, newOwnerWallet.address);

        // var pendingRecovery = await wallet.getRecovery();
        // assert.equal(pendingRecovery[0], newOwnerWallet.address);

        // TRY WITH BAD PROOF
        var badProof = "0x0000000000000000000000000100000000000000000000000000000000000000";
        proof[0] = badProof;
        proof[proof.length-1] = "0x0100000000000000";
        var secretHash = web3.utils.soliditySha3(badProof);
        var commitHash =  web3.utils.soliditySha3(merkle.concat(attackerWallet.address,badProof));

        var methodData = wallet.contract.methods.startRecoverCommit(secretHash, commitHash).encodeABI();
        await commons.executeMetaTx(wallet, methodData, [])

        var methodData = wallet.contract.methods.startRecoveryReveal(attackerWallet.address, proof).encodeABI();
        var tx = await commons.executeMetaTx(wallet, methodData, [])
        var parsed = RelayerClient.parseRelayReceipt({ logs: tx.logs});
        console.log("BADPROOF", parsed)
        assert.strictEqual(parsed.success, false);
        assert.strictEqual(parsed.error, "UNEXPECTED PROOF");
        var newOwner = await wallet.getOwner();
        assert.strictEqual(newOwner, newOwnerWallet.address);
    });

    it("should not allow old commits", async () => {
        const gasLimit = 100000;
        const chainId = await web3.eth.getChainId();
        const nonce = await commons.getNonceForRelay();
        var tmpWallet = web3.eth.accounts.create();
        var newOwnerWallet = web3.eth.accounts.create();
        var {root_arr, leaves_arr, wallet} = await commons.createWallet(
            ethers.constants.AddressZero,
            ["","","hashId"],
            accounts[0], // drain
            8,
            web3.utils.toWei("100", "ether"),
            accounts[0],
            tmpWallet.address,
            ethers.constants.AddressZero,
            "0" // fee
        );

        // attempting to use HOTP, 3 offset off..
        var {token, proof} = await commons.getTOTPAndProof(0, 0, leaves_arr);

        console.log(newOwnerWallet.address, proof[0]);
        var secretHash = web3.utils.soliditySha3(proof[0]);
        var commitHash =  web3.utils.soliditySha3(merkle.concat(newOwnerWallet.address,proof[0]));
        console.log("commitHash: ", commitHash)
        // await wallet.startRecoverCommit(commitHash);

        const methodData = wallet.contract.methods.startRecoverCommit(secretHash, commitHash).encodeABI();
                
        // zero signature required, just HOTP
        var sigs = await commons.signOffchain2(
            [],
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

        await wallet.executeMetaTx(methodData, sigs, nonce, 0, gasLimit, ethers.constants.AddressZero, ethers.constants.AddressZero);

        for(var i=0; i <= 15; i++) {
            await commons.mineBlock();
        }

        const methodData2 = wallet.contract.methods.startRecoveryReveal(newOwnerWallet.address, proof).encodeABI();
        sigs = await commons.signOffchain2(
            [],
            wallet.address,
            0,
            methodData2,
            chainId,
            nonce,
            0,
            gasLimit,
            ethers.constants.AddressZero,
            ethers.constants.AddressZero
        );

        var res = await wallet.executeMetaTx(methodData2, sigs, nonce, 0, gasLimit, ethers.constants.AddressZero, ethers.constants.AddressZero);
        console.log("Receipt:", RelayerClient.parseRelayReceipt({ logs: res.logs}));
        newOwner = await wallet.getOwner();
        console.log("NEW OWNER", newOwner, newOwnerWallet.address);
        assert.notEqual(newOwner, newOwnerWallet.address);

        // var pendingRecovery = await wallet.getRecovery();
        // assert.equal(pendingRecovery[0], newOwnerWallet.address);
    });

    it("should start recovery with HOTP + 1 guardian", async () => {
        const gasLimit = 100000;
        const nonce = await commons.getNonceForRelay();
        var ownerWallet = web3.eth.accounts.create();
        var feeWallet = web3.eth.accounts.create();
        var newOwnerWallet = web3.eth.accounts.create();
        const chainId = await web3.eth.getChainId();
        var guardian1 = accounts[1];
        var attacker = accounts[2];

        //createWallet(resolver, domain,owner, depth, spendingLimit, drainAddr, feeAddress, feeAmount) {
        var {root_arr, leaves_arr, wallet} = await commons.createWallet(
                    ethers.constants.AddressZero,  //resolver
                    ["","","hashId"],
                    ownerWallet.address, //owner
                    8,
                    web3.utils.toWei("100", "ether"),
                    accounts[0],
                    feeWallet.address, 
                    "0" // fee
                    );

        var info = await wallet.contract.methods.wallet().call();
        console.log("Current OWNER=", info.owner);
        
        // ADD GUARDIAN
        var methodData = wallet.contract.methods.addGuardian(guardian1).encodeABI();
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

        // START RECOVERY
        var {token, proof} = await commons.getTOTPAndProof(0, 0, leaves_arr);
        console.log("NEW OWNER=", newOwnerWallet.address,"TOKEN=", proof[0]);
        console.log("precommit=", merkle.concat(newOwnerWallet.address,proof[0]));
        var secretHash = web3.utils.soliditySha3(proof[0]);
        var commitHash =  web3.utils.soliditySha3(merkle.concat(newOwnerWallet.address,proof[0]));
        console.log("commitHash: ", commitHash)
        var methodData = wallet.contract.methods.startRecoverCommit(secretHash, commitHash).encodeABI();
                
        // zero signature required, just HOTP
        var sigs = await commons.signOffchain2(
            [],
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

        await wallet.executeMetaTx(methodData, sigs, nonce, 0, gasLimit, ethers.constants.AddressZero, ethers.constants.AddressZero);

        const methodData2 = wallet.contract.methods.startRecoveryReveal(newOwnerWallet.address, proof).encodeABI();
        sigs = await commons.signOffchain2(
            [],
            wallet.address,
            0,
            methodData2,
            chainId,
            nonce,
            0,
            gasLimit,
            ethers.constants.AddressZero,
            ethers.constants.AddressZero
        );

        await wallet.executeMetaTx(methodData2, sigs, nonce, 0, gasLimit, ethers.constants.AddressZero, ethers.constants.AddressZero);
        var actualOwner = await wallet.getOwner();
        console.log("contract owner (should not be same)", actualOwner, newOwnerWallet.address);
        assert.notEqual(actualOwner, newOwnerWallet.address);

        // GUARDIAN APPROVE IT
        await truffleAssert.reverts(wallet.guardianApprove(methodData, {from: attacker}), "must be guardian");        
        
        // REAL GUARDIAN
        var methodData = wallet.contract.methods.startRecoverCommit(secretHash, commitHash).encodeABI();
        console.log("sending methodData", methodData);
        await wallet.guardianApprove(methodData, {from: guardian1});
        
        var actualOwner = await wallet.getOwner();
        console.log("contract owner (should be same)", actualOwner, newOwnerWallet.address);
        assert.equal(actualOwner, newOwnerWallet.address);        
    });

    it("should start recovery with 2 guardian", async () => {
        const gasLimit = 100000;
        const nonce = await commons.getNonceForRelay();
        var ownerWallet = web3.eth.accounts.create();
        var feeWallet = web3.eth.accounts.create();
        var newOwnerWallet = web3.eth.accounts.create();
        const chainId = await web3.eth.getChainId();
        var guardian1 = accounts[1];
        var guardian2 = accounts[2];
        var attacker = accounts[3];

        //createWallet(resolver, domain,owner, depth, spendingLimit, drainAddr, feeAddress, feeAmount) {
        var {root_arr, leaves_arr, wallet} = await commons.createWallet(
                    ethers.constants.AddressZero,  //resolver
                    ["","","hashId"],
                    ownerWallet.address, //owner
                    8,
                    web3.utils.toWei("100", "ether"),
                    accounts[0],
                    feeWallet.address, 
                    "0" // fee
                    );

        var info = await wallet.contract.methods.wallet().call();
        console.log("Current OWNER=", info.owner);
        
        // ADD GUARDIAN
        var methodData = wallet.contract.methods.addGuardian(guardian1).encodeABI();
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
            
        var methodData = wallet.contract.methods.addGuardian(guardian2).encodeABI();
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
            
            
        var methodData = wallet.contract.methods.startRecoverGuardianOnly(newOwnerWallet.address).encodeABI();
        console.log("methodata=", methodData);

        await truffleAssert.reverts(wallet.guardianApprove(methodData, {from: attacker}), 'must be guardian');
        await truffleAssert.reverts(wallet.startRecoverGuardianOnly(newOwnerWallet.address, {from: attacker}), 'must be guardian');

        await wallet.startRecoverGuardianOnly(newOwnerWallet.address, {from: guardian1});
        await truffleAssert.reverts(wallet.guardianApprove(methodData, {from: guardian1}), 'duplicate guardian');
        await wallet.guardianApprove(methodData, {from: guardian2});

        var actualOwner = await wallet.getOwner();
        console.log("contract owner (should be same)", actualOwner, newOwnerWallet.address);
        assert.equal(actualOwner, newOwnerWallet.address);        
     });
})

