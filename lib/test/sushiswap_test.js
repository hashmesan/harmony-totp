
const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-as-promised'))
var assert = require('assert');

const web3utils = require("web3-utils");
const ethers = require("ethers")
var contract = require("@truffle/contract");
const config = require("../../webclient/src/config");
const SmartVault = require("../smartvault_lib");
var Contract = require('web3-eth-contract');
const Web3 = require("web3");
const Provider = require('@truffle/hdwallet-provider');

const walletLib = require("../../lib/wallet")
const { ChainId, Pair, Token, Trade, JSBI, Percent, CurrencyAmount } = require('@sushiswap/sdk')
const wallet = require("../../lib/wallet.js");

const ERC20 = require('../../build/contracts/ERC20.json');
var ERC20Contract = contract(ERC20)
var ERC20Contract2 = new Contract(ERC20.abi)

const UniswapContractJSON = require('../../build/sushiswap/UniswapV2Router02.json');
var UniswapContract = new Contract(UniswapContractJSON.abi)

const WalletJSON = require('../../build/contracts/TOTPWallet.json');
var Wallet = contract(WalletJSON)

const configNetwork = "testnet0";
const network = configNetwork == "mainnet0" ? ChainId.HARMONY : ChainId.HARMONY_TESTNET;

var WETH = {
    [ChainId.HARMONY_TESTNET] : new Token(ChainId.HARMONY_TESTNET, '0x7a2afac38517d512e55c0bce3b6805c10a04d60f', 18, 'ONE', 'ONE'),
    [ChainId.HARMONY] : new Token(ChainId.HARMONY, '0xcF664087a5bB0237a0BAd6742852ec6c8d69A27a', 18, 'ONE', 'ONE'),
}
var USDC_MAP = {
	[ChainId.HARMONY_TESTNET] : new Token(ChainId.HARMONY_TESTNET, '0xc555b5c6743512d39c3637c31747fe8bcdc46b6e', 18, 'USDC', 'USDC'),
	[ChainId.HARMONY] : new Token(ChainId.HARMONY, '0x985458E523dB3d53125813eD68c274899e9DfAb4', 6, 'USDC', 'USDC')
}

// https://uniswap.org/docs/v2/smart-contract-integration/trading-from-a-smart-contract/
describe("SmartVault test", () => {
	//const walletFile = "/home/quoc/.smartvault/testnet0/.smartvault-one1yczfrtqqjsk93hwau3rwecfghj73yssjndl72c-hashmesan03.crazy.one"
	//const walletFile = "/home/quoc/.smartvault/testnet0/.smartvault-one13un75gkemvq73gavpmkdyjpq74h4yhs6wmfqhv-hashmesan04.crazy.one"
	const walletFile = "/home/quoc/.smartvault/testnet0/.smartvault-one1chps000etlq4zujf38zl8dclx3jyt5qavmauev-hashmesan002.crazy.one"

	var client = new SmartVault(config.CONFIG[configNetwork]);
	client.loadFromLocal(walletFile);

	const privateKeyProvider = new Provider(client.walletData.ownerSecret, config.CONFIG[configNetwork].RPC_URL);
	const web3 = new Web3(privateKeyProvider);

	Wallet.setProvider(privateKeyProvider)
	ERC20Contract.setProvider(privateKeyProvider)

	const WONE = WETH[network]
	const USDC = USDC_MAP[network]	
	const ONE_BIPS = new Percent(JSBI.BigInt(10), JSBI.BigInt(10000))
	const TWO_BIPS = new Percent(JSBI.BigInt(10), JSBI.BigInt(20000))
	const ZERO_BIPS = new Percent(JSBI.BigInt(0), JSBI.BigInt(20000))

	const uniswapRouter = "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506";

	const uniswapContract = new web3.eth.Contract(
		UniswapContractJSON.abi,
		uniswapRouter
	);

    async function getAmountOut(amountIn, coinIn, coinOut) {
        const c = new web3.eth.Contract(UniswapContractJSON.abi, uniswapRouter)
        const path = [coinIn.address, coinOut.address]

        const amountsOut = await c.methods.getAmountsOut(amountIn, path).call()

        return new Pair(CurrencyAmount.fromRawAmount(coinIn, amountsOut[0]), CurrencyAmount.fromRawAmount(coinOut, amountsOut[1]))
    }

    async function getAmountIn(amountOut, coinIn, coinOut ) {
        const c = uniswapContract
        const path = [coinIn.address, coinOut.address]
        const amountsIn = await c.methods.getAmountsIn(amountOut, path).call()
        return new Pair(CurrencyAmount.fromRawAmount(coinIn, amountsIn[0]), CurrencyAmount.fromRawAmount(coinOut, amountsIn[1]))
    }

	it.skip("ad", async () => {
		console.log("Loading smartvault wallet", walletFile);
		var viperContract = await ERC20Contract.at("0x11F477aE5f42335928fC94601a8A81ec77b27b2b")
		console.log("BEFORE", web3utils.fromWei(await viperContract.balanceOf("0x260491ac00942c58dddde446ece128bcbd124212")), "VIPER")
		console.log("BEFORE", web3utils.fromWei(await web3.eth.getBalance("0x260491ac00942c58dddde446ece128bcbd124212")), "ONE")

	})
	it("can swap in Testnet", async () => {
        await client.setup()

		console.log("Loading smartvault wallet", walletFile);
		var usdcContract = await ERC20Contract.at(USDC.address)
		console.log("BEFORE", web3utils.fromWei(await usdcContract.balanceOf(client.walletData.walletAddress)), USDC.symbol)
		console.log("BEFORE", web3utils.fromWei(await web3.eth.getBalance(client.walletData.walletAddress)), "ONE")

        const amountOut = web3utils.toWei("0.5")
        const tokenOut = CurrencyAmount.fromRawAmount(WONE, amountOut);

        const pairData = await getAmountOut(amountOut, WONE, USDC)
        const res = Trade.bestTradeExactIn([pairData], tokenOut, USDC);
        const amountIn0 = res[0].minimumAmountOut(ONE_BIPS);
		const amountIn = res[0].minimumAmountOut(ONE_BIPS).numerator.toString();
		console.log("Execution Price", res[0].executionPrice.toSignificant(6))
		console.log("Result=", amountIn, res[0].worstExecutionPrice(ONE_BIPS).toSignificant(6));

        //7083581104733660993
        // 500000000000000000 ONE
        // const pairData = await Fetcher.fetchPairData(WONE, VIPER, anotherProvider)

		// // TRADE ONE -> VIPER
		// const amountOut = web3utils.toWei("1")
		// const tokenOut = new TokenAmount(WONE, amountOut);
		// const res = Trade.bestTradeExactIn([pairData], tokenOut, VIPER, { maxHops: 1, maxNumResults: 1 });
		// const amountIn = res[0].minimumAmountOut(ONE_BIPS).raw.toString()
		// console.log("Execution Price", res[0].executionPrice.toSignificant(6))
		// console.log("Expected Amount (VIPER)=", amountIn, res[0].outputAmount.toFixed())

        var smartWallet = client.harmonyClient.getContract(client.walletData.walletAddress);

		const path = [WONE.address, USDC.address]; // good
		const timestamp = parseInt(new Date().getTime() / 1000) + 2000; //good
		var data = uniswapContract.methods.swapExactETHForTokens(amountIn, path, client.walletData.walletAddress, timestamp).encodeABI()
		 
		
		var methodData = smartWallet.methods.multiCall([{ to: uniswapContract.options.address, value: amountOut, data: data }]).encodeABI()
		var res2 = await client.submitTransaction(methodData, 2000000000, 400000)
		console.log(res2);
		console.log("AFTER", web3utils.fromWei(await usdcContract.balanceOf(client.walletData.walletAddress)), USDC.symbol)
		console.log("AFTER", web3utils.fromWei(await web3.eth.getBalance(client.walletData.walletAddress)), "ONE")

		
	});

	it.only("swapTokenforETH", async ()=>{
		await client.setup()
		var viperContract = await ERC20Contract.at(USDC.address)
		var balanceUSDC = await viperContract.balanceOf(client.walletData.walletAddress);
		var balanceUSDC_CA = CurrencyAmount.fromRawAmount(USDC, balanceUSDC);
		console.log("BEFORE", balanceUSDC_CA.toFixed(6), USDC.symbol)
		console.log("BEFORE", web3utils.fromWei(await web3.eth.getBalance(client.walletData.walletAddress)), "ONE")

		const amountIn = web3utils.toWei("0.05")
		const tokenIn = CurrencyAmount.fromRawAmount(USDC, amountIn);
        const pairData = await getAmountOut(amountIn, USDC, WONE)
        const res = Trade.bestTradeExactIn([pairData], tokenIn, WONE);
		const amountOut = res[0].minimumAmountOut(TWO_BIPS).numerator.toString();
		console.log("Execution Price", res[0].executionPrice.toSignificant(6))
		console.log("Expected AmountIn=", amountIn, "AmountOut=", amountOut)

		const path = [USDC.address, WONE.address];
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

		console.log("allowance=", (await viperContract.allowance(client.walletData.walletAddress, uniswapContract.options.address)).toString())
		var balanceUSDC = await viperContract.balanceOf(client.walletData.walletAddress);
		var balanceUSDC_CA = CurrencyAmount.fromRawAmount(USDC, balanceUSDC);
		console.log("AFTER",  balanceUSDC_CA.toFixed(6), "VIPER")
		console.log("AFTER", web3utils.fromWei(await web3.eth.getBalance(client.walletData.walletAddress)), "ONE")
	})
})