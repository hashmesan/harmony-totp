
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

    //     //var proof = await commons.getTOTPAndProof(counter, leaves);

    //     // proof = await commons.getTOTPAndProof(counter.leaves);
    //     // await wallet.drain(proof[0], proof[1])
    //     // var newBalance = await web3.eth.getBalance(tmpWallet.address);
    //     // console.log("Balance=", newBalance);
    //     // assert.equal(newBalance, web3.utils.toWei("1", "ether"), "withdraw amount is correct");

    })

    it("should transfer with meta request from relayer", async () => {
        const gasLimit = 100000;
        const nonce = await commons.getNonceForRelay();
        const blockNumber = await web3.eth.getBlockNumber();

        var feeWallet = web3.eth.accounts.create();
        var tmpWallet = web3.eth.accounts.create();
        var {root, leaves, wallet} = await commons.createWallet(
            ethers.constants.AddressZero,
            ["",""],
             tmpWallet.address ,
             8, 
             web3.utils.toWei("100", "ether"),
             tmpWallet.address, 
             tmpWallet.address, 
             0);

        await web3.eth.sendTransaction({from: accounts[0], to: wallet.address, value: web3.utils.toWei("2", "ether")});
        const methodData = wallet.contract.methods.makeTransfer(tmpWallet.address, web3.utils.toWei("0.0012345", "ether")).encodeABI();
                
        var sigs = await commons.signOffchain2(
            [tmpWallet],
            wallet.address,
            0,
            methodData,
            0,
            nonce,
            0,
            gasLimit,
            ethers.constants.AddressZero,
            feeWallet.address
        );

        await wallet.executeMetaTx(methodData, sigs, nonce, 0, gasLimit, ethers.constants.AddressZero, feeWallet.address);

        var newBalance = await web3.eth.getBalance(tmpWallet.address);
        console.log("Balance=", newBalance);
        assert.equal(newBalance, web3.utils.toWei(".0012345", "ether"), "withdraw amount is correct");

    });

    it("should transfer between smartvaults", async () => {
        const blockNumber = await web3.eth.getBlockNumber();
        var tmpWallet = web3.eth.accounts.create();
        var feeWallet = web3.eth.accounts.create();

        var {root, leaves, wallet} = await commons.createWallet(
            ethers.constants.AddressZero,
            ["",""],
            accounts[0] ,
            8, 
            web3.utils.toWei("100", "ether"),
            tmpWallet.address, 
            tmpWallet.address, 
            0);

        var wallet2 = await commons.createWallet(
            ethers.constants.AddressZero,
            ["",""],
            accounts[0] ,
            8, 
            web3.utils.toWei("100", "ether"),
            tmpWallet.address, 
            tmpWallet.address, 
            0);

        await web3.eth.sendTransaction({from: accounts[0], to: wallet.address, value: web3.utils.toWei("2", "ether")});

        // send to the other smart wallet
        await wallet.makeTransfer(wallet2.wallet.address, web3.utils.toWei("0.5", "ether"));
        var newBalance = await web3.eth.getBalance(wallet2.wallet.address);
        console.log("Balance 1=", newBalance);
        assert.equal(newBalance, web3.utils.toWei(".5", "ether"), "transfer is correct");        


        const methodData = wallet.contract.methods.makeTransfer(wallet2.wallet.address, web3.utils.toWei("0.1234", "ether")).encodeABI();
        const nonce = await commons.getNonceForRelay();
        const gasLimit = 100000;
        var sigs = await commons.signOffchain2(
            [tmpWallet],
            wallet.address,
            0,
            methodData,
            0,
            nonce,
            0,
            gasLimit,
            ethers.constants.AddressZero,
            feeWallet.address
        );

        await wallet.executeMetaTx(methodData, sigs, nonce, 0, gasLimit, ethers.constants.AddressZero, feeWallet.address);       
        newBalance = await web3.eth.getBalance(wallet2.wallet.address);
        console.log("Balance 2 =", newBalance);
    });

    async function createFactoryWallet(owner, salt) {
		const blockNumber = await web3.eth.getBlockNumber();
		const resolverAddr = "0x9590030b26dE3A037Cd679b33A177A645BFaC114";

		var merkelHeight = 6;
		var dailyLimit = web3.utils.toWei("1000");
		var walletFactory = await commons.createWalletFactory(resolverAddr);
		var {root_arr, leaves_arr} = walletLib.createHOTP("SECRET", merkelHeight);
		var relayerWallet = web3.eth.accounts.create();
		var feeReceipient = relayerWallet.address;
		var feeAmount = web3.utils.toWei("0.0012345", "ether");		

        const walletAddrComputed = await walletFactory.computeWalletAddress(
			owner,
			salt
		  );
		await web3.eth.sendTransaction({ from: accounts[0], to: walletAddrComputed, value: web3.utils.toWei("2", "ether") , gas: 300000});

        var subdomain = "superlongcrazynameverycheap000001" + blockNumber + salt;
		var smartWallet = await walletFactory.createWallet({
			resolver: resolverAddr,
			domain: [subdomain, "crazy"],
			owner: owner,
			rootHash: root_arr,
			merkelHeight: merkelHeight,
			drainAddr: owner,
			dailyLimit: dailyLimit,
			salt: salt,
			feeReceipient: feeReceipient,
			feeAmount: feeAmount
		});

        return walletAddrComputed;        
    }
    it("should transfer between smartvaults via factory", async()=>{
        var tmpWallet = web3.eth.accounts.create();
        var tmpWallet2 = web3.eth.accounts.create();

        var wallet1 = await createFactoryWallet(tmpWallet.address, 0);
        var wallet2 = await createFactoryWallet(tmpWallet2.address, 0);

        console.log("Balance 2 =", await web3.eth.getBalance(wallet1),
                                await web3.eth.getBalance(wallet2));

        var wallet = await commons.walletWithAddress(wallet1);
        const methodData = wallet.contract.methods.makeTransfer(wallet2, web3.utils.toWei("0.5", "ether")).encodeABI();
        const nonce = await commons.getNonceForRelay();
        const gasLimit = 100000;
        var feeWallet = web3.eth.accounts.create();
        var sigs = await commons.signOffchain2(
            [tmpWallet],
            wallet.address,
            0,
            methodData,
            0,
            nonce,
            0,
            gasLimit,
            ethers.constants.AddressZero,
            feeWallet.address
        );

        var tx = await wallet.executeMetaTx(methodData, sigs, nonce, 0, gasLimit, ethers.constants.AddressZero, feeWallet.address);       
        //console.log(web3utils.hexToAscii(tx.logs[0].args.returnData))

        newBalance = await web3.eth.getBalance(wallet2);
        console.log("Balance(AFTER) =", newBalance);
        assert.strictEqual(tx.logs[2].args.success, true)                  
    })
});