
const truffleAssert = require("truffle-assertions");
const ethers = require("ethers");
const commons = require("./commons.js");
const walletLib = require("../lib/wallet.js");

const DURATION = 300;
const time = Math.floor((Date.now() / 1000));
const timeOffset = time - (time% 300);        

contract("DrainTest", accounts => {

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
		await web3.eth.sendTransaction({ from: accounts[0], to: walletAddrComputed, value: web3.utils.toWei("10", "ether") , gas: 300000});

        var subdomain = "superlongcrazynameverycheap000001" + blockNumber + salt;
		var smartWallet = await walletFactory.createWallet({
			resolver: resolverAddr,
			domain: [subdomain, "crazy","hashId"],
			owner: owner,
			rootHash: root_arr,
			merkelHeight: merkelHeight,
			drainAddr: owner,
			dailyLimit: dailyLimit,
			salt: salt,
			feeReceipient: feeReceipient,
			feeAmount: feeAmount,
		});

        return walletAddrComputed;        
    }

    it("should test for drain test", async () => {
        var owner = accounts[7];
        var startBalance = await web3.eth.getBalance(owner);
        //console.log(owner, startBalance);

        var wallet = await createFactoryWallet(owner, 0);
        await web3.eth.sendTransaction({ from: owner, to: wallet, value: web3.utils.toWei("1.0", "ether") , gas: 300000});

        var newBalance = await web3.eth.getBalance(owner);
        var delta = new web3.utils.BN(newBalance).sub(new web3.utils.BN(startBalance));
        //console.log(web3.utils.fromWei(delta));
        assert.equal(delta.gt(new web3.utils.BN(web3.utils.toWei("8.99"))), true)
    })

})