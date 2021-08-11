
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

const UniswapContractJSON = require('../../build/contracts/IUniswapRouter.json');
var UniswapContract = new Contract(UniswapContractJSON.abi)

const WalletJSON = require('../../build/contracts/TOTPWallet.json');
var Wallet = contract(WalletJSON)

// https://uniswap.org/docs/v2/smart-contract-integration/trading-from-a-smart-contract/
describe("SmartVault test", () => {
	const walletFile = "/home/quoc/.smartvault/testnet0/.smartvault-one1yczfrtqqjsk93hwau3rwecfghj73yssjndl72c-hashmesan03.crazy.one"
	//const walletFile = "/home/quoc/.smartvault/testnet0/.smartvault-one13un75gkemvq73gavpmkdyjpq74h4yhs6wmfqhv-hashmesan04.crazy.one"
	var client = new SmartVault(config.CONFIG["testnet0"]);
	client.loadFromLocal(walletFile);

	const provider = new Web3.providers.HttpProvider(config.CONFIG["testnet0"].RPC_URL);
	const web3 = new Web3(provider);
	const anotherProvider = new ethers.providers.JsonRpcProvider(config.CONFIG["testnet0"].RPC_URL);
	const privateKeyProvider = new Provider(process.env.PRIVATE_KEY, config.CONFIG["testnet0"].RPC_URL);
	Wallet.setProvider(privateKeyProvider)
	ERC20Contract.setProvider(privateKeyProvider)
	it.skip("ad", async () => {
		var viperContract = await ERC20Contract.at("0x11F477aE5f42335928fC94601a8A81ec77b27b2b")
		console.log("Loading smartvault wallet", walletFile);
		console.log("BEFORE", web3utils.fromWei(await viperContract.balanceOf("0x260491ac00942c58dddde446ece128bcbd124212")), "VIPER")
		console.log("BEFORE", web3utils.fromWei(await web3.eth.getBalance("0x260491ac00942c58dddde446ece128bcbd124212")), "ONE")

	})
	it.only("can swap in Testnet", async () => {
		var viperContract = await ERC20Contract.at("0x11F477aE5f42335928fC94601a8A81ec77b27b2b")
		console.log("Loading smartvault wallet", walletFile);
		console.log("BEFORE", web3utils.fromWei(await viperContract.balanceOf("0x260491ac00942c58dddde446ece128bcbd124212")), "VIPER")
		console.log("BEFORE", web3utils.fromWei(await web3.eth.getBalance("0x260491ac00942c58dddde446ece128bcbd124212")), "ONE")
		const uniswapContract = new web3.eth.Contract(
			UniswapContractJSON.abi,
			// "0x8e9A3cE409B13ef459fE4448aE97a79d6Ecd8b4b"
			"0xda3DD48726278a7F478eFaE3BEf9a5756ccdb4D0"
		);
		const WONE = WETH[ChainId.HARMONY_TESTNET]
		const VIPER = new Token(ChainId.HARMONY_TESTNET, '0x11F477aE5f42335928fC94601a8A81ec77b27b2b', 18, 'VIPER', 'Viper')
		const pairData = await Fetcher.fetchPairData(WONE, VIPER, anotherProvider)

		// const res = await uniswapContract.methods.WETH().call();
		// console.log(res);
		const ONE_BIPS = new Percent(JSBI.BigInt(100), JSBI.BigInt(10000))

		// TRADE 1ETH -> VIPER ?
		const amountOut = web3utils.toWei("2")
		const tokenOut = new TokenAmount(WONE, amountOut);
		const res = Trade.bestTradeExactIn([pairData], tokenOut, VIPER, { maxHops: 1, maxNumResults: 1 });
		const amountIn = res[0].minimumAmountOut(ONE_BIPS).raw.toString()
		console.log("Execution Price", res[0].executionPrice.toSignificant(6))
		console.log("Expected Amount (VIPER)=", amountIn, res[0].outputAmount.toFixed())

		var smartWallet = client.harmonyClient.getContract(client.walletData.walletAddress);

		const path = [WONE.address, VIPER.address]; // good
		const timestamp = parseInt(new Date().getTime() / 1000) + 2000; //good
		var data = uniswapContract.methods.swapETHForExactTokens(amountIn, path, client.walletData.walletAddress, timestamp).encodeABI()

		var truffleWallet = await Wallet.at(client.walletData.walletAddress);
		const from = privateKeyProvider.getAddress(0);

		var methodData = smartWallet.methods.multiCall([{ to: uniswapContract.options.address, value: web3utils.toWei("2.5"), data: data }]).encodeABI()
		var res2 = await client.submitTransaction(methodData, 2000000000, 400000)
		console.log(res2);
		console.log("AFTER", web3utils.fromWei(await viperContract.balanceOf("0x260491ac00942c58dddde446ece128bcbd124212")), "VIPER")
		console.log("AFTER", web3utils.fromWei(await web3.eth.getBalance("0x260491ac00942c58dddde446ece128bcbd124212")), "ONE")


	});

})