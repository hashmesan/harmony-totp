
const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-as-promised'))
var assert = require('assert');

var contract = require("@truffle/contract");
const config = require("../../webclient/src/config");
const SmartVault = require("../smartvault_lib");
var Contract = require('web3-eth-contract');
const Web3 = require("web3");
const { ChainId, Pair, Token, TokenAmount, Trade, JSBI, WETH, Fetcher, Percent } = require('@venomswap/sdk')
const web3utils = require("web3-utils");
const ethers = require("ethers")
const wallet = require("../../lib/wallet.js");
const Provider = require('@truffle/hdwallet-provider');
const ERC20 = require('../../build/contracts/ERC20.json');
var ERC20Contract = contract(ERC20)
var ERC20Contract2 = new Contract(ERC20.abi)
const walletLib = require("../../lib/wallet")
const UniswapContractJSON = require('../../build/contracts/IUniswapRouter.json');
var UniswapContract = new Contract(UniswapContractJSON.abi)

const WalletJSON = require('../../build/contracts/TOTPWallet.json');
var Wallet = contract(WalletJSON)

// https://uniswap.org/docs/v2/smart-contract-integration/trading-from-a-smart-contract/
describe("SmartVault test", () => {
	//const walletFile = "/home/quoc/.smartvault/testnet0/.smartvault-one1yczfrtqqjsk93hwau3rwecfghj73yssjndl72c-hashmesan03.crazy.one"
	//const walletFile = "/home/quoc/.smartvault/testnet0/.smartvault-one13un75gkemvq73gavpmkdyjpq74h4yhs6wmfqhv-hashmesan04.crazy.one"
	const walletFile = "/home/quoc/.smartvault/testnet0/.smartvault-one1chps000etlq4zujf38zl8dclx3jyt5qavmauev-hashmesan002.crazy.one"

	var client = new SmartVault(config.CONFIG["testnet0"]);
	client.loadFromLocal(walletFile);

	const privateKeyProvider = new Provider(client.walletData.ownerSecret, config.CONFIG["testnet0"].RPC_URL);
	const web3 = new Web3(privateKeyProvider);
	const anotherProvider = new ethers.providers.JsonRpcProvider(config.CONFIG["testnet0"].RPC_URL);

	Wallet.setProvider(privateKeyProvider)
	ERC20Contract.setProvider(privateKeyProvider)

	const WONE = WETH[ChainId.HARMONY_TESTNET]
	const VIPER = new Token(ChainId.HARMONY_TESTNET, '0x11F477aE5f42335928fC94601a8A81ec77b27b2b', 18, 'VIPER', 'Viper')
	const ONE_BIPS = new Percent(JSBI.BigInt(100), JSBI.BigInt(10000))
	const TWO_BIPS = new Percent(JSBI.BigInt(100), JSBI.BigInt(20000))
	const uniswapRouter = "0xda3DD48726278a7F478eFaE3BEf9a5756ccdb4D0";

	const uniswapContract = new web3.eth.Contract(
		UniswapContractJSON.abi,
		// "0x8e9A3cE409B13ef459fE4448aE97a79d6Ecd8b4b"
		"0xda3DD48726278a7F478eFaE3BEf9a5756ccdb4D0"
	);

	it.skip("ad", async () => {
		console.log("Loading smartvault wallet", walletFile);
		var viperContract = await ERC20Contract.at("0x11F477aE5f42335928fC94601a8A81ec77b27b2b")
		console.log("BEFORE", web3utils.fromWei(await viperContract.balanceOf("0x260491ac00942c58dddde446ece128bcbd124212")), "VIPER")
		console.log("BEFORE", web3utils.fromWei(await web3.eth.getBalance("0x260491ac00942c58dddde446ece128bcbd124212")), "ONE")

	})
	it("can swap in Testnet", async () => {
		console.log("Loading smartvault wallet", walletFile);
		var viperContract = await ERC20Contract.at("0x11F477aE5f42335928fC94601a8A81ec77b27b2b")
		console.log("BEFORE", web3utils.fromWei(await viperContract.balanceOf(client.walletData.walletAddress)), "VIPER")
		console.log("BEFORE", web3utils.fromWei(await web3.eth.getBalance(client.walletData.walletAddress)), "ONE")

		const pairData = await Fetcher.fetchPairData(WONE, VIPER, anotherProvider)

		// TRADE ONE -> VIPER
		const amountOut = web3utils.toWei("1")
		const tokenOut = new TokenAmount(WONE, amountOut);
		const res = Trade.bestTradeExactIn([pairData], tokenOut, VIPER, { maxHops: 1, maxNumResults: 1 });
		const amountIn = res[0].minimumAmountOut(ONE_BIPS).raw.toString()
		console.log("Execution Price", res[0].executionPrice.toSignificant(6))
		console.log("Expected Amount (VIPER)=", amountIn, res[0].outputAmount.toFixed())

		var smartWallet = client.harmonyClient.getContract(client.walletData.walletAddress);

		const path = [WONE.address, VIPER.address]; // good
		const timestamp = parseInt(new Date().getTime() / 1000) + 2000; //good
		var data = uniswapContract.methods.swapExactETHForTokens(amountIn, path, client.walletData.walletAddress, timestamp).encodeABI()
		 
		console.log(path, amountIn, amountOut);
		
		var methodData = smartWallet.methods.multiCall([{ to: uniswapContract.options.address, value: web3utils.toWei("1.0"), data: data }]).encodeABI()
		var res2 = await client.submitTransaction(methodData, 2000000000, 400000)
		console.log(res2);
		console.log("AFTER", web3utils.fromWei(await viperContract.balanceOf(client.walletData.walletAddress)), "VIPER")
		console.log("AFTER", web3utils.fromWei(await web3.eth.getBalance(client.walletData.walletAddress)), "ONE")

		
	});

	it.only("swapTokenforETH", async ()=>{
		var viperContract = await ERC20Contract.at("0x11F477aE5f42335928fC94601a8A81ec77b27b2b")
		console.log("BEFORE", web3utils.fromWei(await viperContract.balanceOf(client.walletData.walletAddress)), "VIPER")
		console.log("BEFORE", web3utils.fromWei(await web3.eth.getBalance(client.walletData.walletAddress)), "ONE")

		const amountIn = web3utils.toWei("0.1")
		const tokenIn = new TokenAmount(VIPER, amountIn);
		const pairData = await Fetcher.fetchPairData(WONE, VIPER, anotherProvider)
		const res = Trade.bestTradeExactIn([pairData], tokenIn, WONE, { maxHops: 1, maxNumResults: 1 });
		const amountOut = res[0].minimumAmountOut(TWO_BIPS).raw.toString()
		console.log("Execution Price", res[0].executionPrice.toSignificant(6))
		console.log("Expected AmountIn=", amountIn, "AmountOut=", amountOut)

		const path = [VIPER.address, WONE.address];
		const timestamp = parseInt(new Date().getTime() / 1000) + 5000;
		var data = uniswapContract.methods.swapExactTokensForETH(amountIn, "0", path, client.walletData.walletAddress, timestamp).encodeABI()
		console.log("Contract", amountIn, amountOut, path)
		
		const approve = ERC20Contract2.methods.approve(uniswapRouter, amountIn).encodeABI();

		const smartWallet = new web3.eth.Contract(
			WalletJSON.abi,
			client.walletData.walletAddress
		);

		smartWallet.setProvider(privateKeyProvider)

		var methodData = smartWallet.methods.multiCall([
			{ to: path[0], value: 0, data: approve},
			{ to: uniswapRouter, value: 0, data: data }
		]).encodeABI()
		
		var res2 = await client.submitTransaction(methodData, 1000000000, 1000000)
		console.log(res2);

		// try {
		// 	console.log(res2);	
		// } catch(ex) {
		// 	console.log(ex);
		// }

		// smartWallet.events.Invoked({}, function(error, event){ console.log("event0", error, event); })
		// .on('data', function(event){
		// 	console.log("event1", event); // same results as the optional callback above
		// })

		// var gasLimit = 800000;
		// console.log(methodData, client.ownerAccount)
		// var nonce = await walletLib.getNonceForRelay();
		// var sigs = await walletLib.signOffchain2(
        //     [client.ownerAccount],
        //     client.walletData.walletAddress,
        //     0,
        //     methodData,
        //     0,
        //     nonce,
        //     0,
        //     gasLimit,
        //     ethers.constants.AddressZero,
        //     ethers.constants.AddressZero,
        // );

		// console.log("ownerAddress:",client.walletData.ownerAddress)
		// var wallet = await Wallet.at(client.walletData.walletAddress);		
		//await smartWallet.methods.setDrainAddress("0x1727adCCe8F11E7b9cbDd065e5ab64158F8BcE3B").call();
		// var res1 = await wallet.multiCall([
		// 	{ to: VIPER.address, value: 0, data: approve},
		// 	{ to: uniswapContract.options.address, value: 0, data: data }],{from: client.walletData.ownerAddress})

		/*    function executeMetaTx(
            bytes   calldata data,
            bytes   calldata signatures, 
            uint256 nonce,
            uint256 gasPrice,
            uint256 gasLimit,
            address refundToke,
            address payable refundAddress            
		*/

		// var res1 = await wallet.executeMetaTx(methodData, 
		// 	sigs, 
		// 	nonce, 
		// 	0, 
		// 	gasLimit, 
		// 	ethers.constants.AddressZero,
        //     ethers.constants.AddressZero,{from: client.walletData.ownerAddress, gas: 1000000});

		// console.log(res1); // ethers.utils.toUtf8String(res1[0])
		// console.log(res1.logs[0].args)

		// console.log(ethers.utils.toUtf8String("0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000013fbe85edc9000000000000000000000000000000000000000000000000000005c10c5e4ca6f7de"))

		console.log("allowance=", (await viperContract.allowance(client.walletData.walletAddress, uniswapContract.options.address)).toString())
		console.log("AFTER", web3utils.fromWei(await viperContract.balanceOf(client.walletData.walletAddress)), "VIPER")
		console.log("AFTER", web3utils.fromWei(await web3.eth.getBalance(client.walletData.walletAddress)), "ONE")

		
        // const iface = new ethers.utils.Interface(UniswapContractJSON.abi);
        // // var res2 = iface.decodeFunctionData("swapExactTokensForETH", data);
        // // console.log("OURS", res2, web3utils.fromWei(res2.amountIn.toString()), web3utils.fromWei(res2.amountOutMin.toString()))

        // var res3 = iface.decodeFunctionData("swapExactTokensForETH", "0x18cbafe5000000000000000000000000000000000000000000000000016345785d8a0000000000000000000000000000000000000000000000000000065ce07d0f45f40300000000000000000000000000000000000000000000000000000000000000a00000000000000000000000001727adcce8f11e7b9cbdd065e5ab64158f8bce3b0000000000000000000000000000000000000000000000000000000061256199000000000000000000000000000000000000000000000000000000000000000200000000000000000000000011f477ae5f42335928fc94601a8a81ec77b27b2b0000000000000000000000007466d7d0c21fa05f32f5a0fa27e12bdc06348ce2");
        // console.log("EXPECTED", res3, web3utils.fromWei(res3.amountIn.toString()), web3utils.fromWei(res3.amountOutMin.toString()))
		
		
		//0x18cbafe5000000000000000000000000000000000000000000000000016345785d8a0000000000000000000000000000000000000000000000000000065ce07d0f45f40300000000000000000000000000000000000000000000000000000000000000a00000000000000000000000001727adcce8f11e7b9cbdd065e5ab64158f8bce3b0000000000000000000000000000000000000000000000000000000061256199000000000000000000000000000000000000000000000000000000000000000200000000000000000000000011f477ae5f42335928fc94601a8a81ec77b27b2b0000000000000000000000007466d7d0c21fa05f32f5a0fa27e12bdc06348ce2
	})
})