
const truffleAssert = require("truffle-assertions");
const ethers = require("ethers");
const commons = require("./commons.js");
const RelayerClient = require("../lib/relayer_client");
const DURATION = 300;
const time = Math.floor((Date.now() / 1000));
const timeOffset = time - (time% 300);        
const walletLib = require("../lib/wallet.js");

contract("DailyLimit", accounts => {

    it("should test for daily limit", async () => {
        var tmpWallet = web3.eth.accounts.create();
        var { root, leaves, wallet } = await commons.createWallet(
            ethers.constants.AddressZero,
            ["", "", "hashId"],
            accounts[0],
            8,
            web3.utils.toWei("0.1", "ether"),
            tmpWallet.address,
            tmpWallet.address,
            0);

        // no guardian -- no limit
        await web3.eth.sendTransaction({from: accounts[0], to: wallet.address, value: web3.utils.toWei("1", "ether")});
        await wallet.multiCall([{to: tmpWallet.address, value: web3.utils.toWei("0.11", "ether"), data: "0x"}]);
        var newBalance = await web3.eth.getBalance(tmpWallet.address);
        console.log("balance=", newBalance);

        // add one guardian
        var guardian1 = web3.eth.accounts.create();
        await wallet.addGuardian(guardian1.address);

        // send again - expect to revert
        var overlimit = wallet.multiCall([{to: tmpWallet.address, value: web3.utils.toWei("0.11", "ether"), data: "0x"}]);
        await truffleAssert.reverts(overlimit, "over limit"); 

        // var overlimit = wallet.makeTransfer(tmpWallet.address, web3.utils.toWei("0.2", "ether"));
        // await truffleAssert.reverts(overlimit, "revert over withdrawal limit");
    })
    it("should test for multiCallSession and cancelled session", async () => {
        const gasLimit = 100000;
        const nonce = await commons.getNonceForRelay();
        const blockNumber = await web3.eth.getBlockNumber();
        const chainId = await web3.eth.getChainId();
        var feeWallet = web3.eth.accounts.create();
        var attackerWallet = web3.eth.accounts.create();
        var receiver = web3.eth.accounts.create();

        var ownerWallet = web3.eth.accounts.create();
        var { root, leaves, wallet } = await commons.createWallet(
            ethers.constants.AddressZero,
            ["", "", "hashId"],
            ownerWallet.address,
            8,
            web3.utils.toWei("0.1", "ether"),
            ownerWallet.address,
            ownerWallet.address,
            0);

        await web3.eth.sendTransaction({from: accounts[0], to: wallet.address, value: web3.utils.toWei("1", "ether")});
        var guardian1 = web3.eth.accounts.create();

        // Only available in guardian mode
        var methodData0 = wallet.contract.methods.multiCallWithSession([{to: receiver.address, value: web3.utils.toWei("0.11", "ether"), data: "0x"}]).encodeABI();
        var tx = commons.executeMetaTx(wallet, methodData0, [attackerWallet])
        await truffleAssert.reverts(tx, "unknown method"); 

        // ADD GUARDIAN
        var methodData0 = wallet.contract.methods.addGuardian(guardian1.address).encodeABI();
        await commons.executeMetaTx(wallet, methodData0, [ownerWallet])

        // 0.09 + 0.02 > 0.11 limit
        var methodData0 = wallet.contract.methods.multiCall([{to: accounts[0], value: web3.utils.toWei("0.09", "ether"), data: "0x"}]).encodeABI();
        var res = await commons.executeMetaTx(wallet, methodData0, [ownerWallet])

        var methodData0 = wallet.contract.methods.multiCall([{to: accounts[0], value: web3.utils.toWei("0.02", "ether"), data: "0x"}]).encodeABI();
        var tx = await commons.executeMetaTx(wallet, methodData0, [ownerWallet])
        //await truffleAssert.reverts(tx, "over withdrawal limit");    
        var parsed = RelayerClient.parseRelayReceipt({ logs: tx.logs});
        console.log(parsed)
        assert.strictEqual(parsed.success, false);
        assert.strictEqual(parsed.error, "over limit");

        // expect to be only 1 ETHER - 0.09
        var balanceAfter = await web3.eth.getBalance(wallet.address);
        console.log("Wallet Balance(AFTER) =", balanceAfter);
        
        // START SESSION
        var duration = 60*60;
        var res = await commons.startSession(wallet, duration, [ownerWallet, guardian1])
        assert.strictEqual(res.receipt.status, true);

        // SEND OVER LIMIT
        var methodData0 = wallet.contract.methods.multiCallWithSession([{to: receiver.address, value: web3.utils.toWei("0.11", "ether"), data: "0x"}]).encodeABI();
        var res = await commons.executeMetaTx(wallet, methodData0, [ownerWallet])

        // send with different key
        var methodData0 = wallet.contract.methods.multiCallWithSession([{to: receiver.address, value: web3.utils.toWei("0.11", "ether"), data: "0x"}]).encodeABI();
        var tx = commons.executeMetaTx(wallet, methodData0, [attackerWallet])
        await truffleAssert.reverts(tx, "Wrong key"); 

        var balanceAfter = await web3.eth.getBalance(receiver.address);
        console.log("Balance(AFTER) =", balanceAfter);

        assert.strictEqual(balanceAfter, web3.utils.toWei("0.11", "ether"))

        // CLEAR SESSION
        var methodData0 = wallet.contract.methods.clearSession().encodeABI();
        await commons.executeMetaTx(wallet, methodData0, [ownerWallet])

        // TRY AGAIN / expect to fail
        var methodData0 = wallet.contract.methods.multiCallWithSession([{to: receiver.address, value: web3.utils.toWei("0.11", "ether"), data: "0x"}]).encodeABI();
        var tx = commons.executeMetaTx(wallet, methodData0, [ownerWallet])
        await truffleAssert.reverts(tx, "No session"); 
         
    });

    it("should test for setting daily limit with/without guardians", async () => {
        const gasLimit = 100000;
        const nonce = await commons.getNonceForRelay();
        const blockNumber = await web3.eth.getBlockNumber();
        const chainId = await web3.eth.getChainId();
        var guardian1 = web3.eth.accounts.create();

        var ownerWallet = web3.eth.accounts.create();
        var { root, leaves, wallet } = await commons.createWallet(
            ethers.constants.AddressZero,
            ["", "", "hashId"],
            ownerWallet.address,
            8,
            web3.utils.toWei("0.1", "ether"),
            ownerWallet.address,
            ownerWallet.address,
            0);

        var walletInfo = await wallet.wallet();
        assert.strictEqual(walletInfo.dailyLimit.limit,  web3.utils.toWei("0.1", "ether"));

        // ADD GUARDIAN
        var methodData0 = wallet.contract.methods.addGuardian(guardian1.address).encodeABI();
        await commons.executeMetaTx(wallet, methodData0, [ownerWallet])
       
        // UPDATE LIMIT WITHOUT PERMISSION
        var methodData0 = wallet.contract.methods.setDailyLimit(web3.utils.toWei("0.2", "ether")).encodeABI();
        var tx = commons.executeMetaTx(wallet, methodData0, [ownerWallet])
        await truffleAssert.reverts(tx, "unknown method"); 

        // NOT ALLOW TO CHANGE THROUGH MULTICALL
        var methodData0 = wallet.contract.methods.setDailyLimit(web3.utils.toWei("0.2", "ether")).encodeABI();
        var methodData1 = wallet.contract.methods.multiCall([{to: wallet.address, value: 0, data: methodData0}]).encodeABI();
        var tx = await commons.executeMetaTx(wallet, methodData1, [ownerWallet])
        var parsed = RelayerClient.parseRelayReceipt({ logs: tx.logs});
        console.log(parsed)
        assert.strictEqual(parsed.success, false);

        // start session with incorrect signatures
        var duration = 60*60;
        var tx = commons.startSession(wallet, duration, [ownerWallet])
        await truffleAssert.reverts(tx, "Wrong number of signatures"); 

        // START SESSION
        var duration = 60*60;
        var tx = await commons.startSession(wallet, duration, [ownerWallet, guardian1])
        assert.strictEqual(tx.receipt.status, true);

        // ALLOWED IN SESSION + MULTICALLSESSION
        var methodData0 = wallet.contract.methods.setDailyLimit(web3.utils.toWei("0.234", "ether")).encodeABI();
        var methodData1 = wallet.contract.methods.multiCallWithSession([{to: wallet.address, value: 0, data: methodData0}]).encodeABI();
        var tx = await commons.executeMetaTx(wallet, methodData1, [ownerWallet])
        var parsed = RelayerClient.parseRelayReceipt({ logs: tx.logs});
        console.log(parsed)
        assert.strictEqual(parsed.success, true);

        var walletInfo = await wallet.wallet();
        assert.strictEqual(walletInfo.dailyLimit.limit,  web3.utils.toWei("0.234", "ether"));
    });
})