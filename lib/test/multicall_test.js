const truffleAssert = require("truffle-assertions");
const ethers = require("ethers");
const web3utils = require("web3-utils");
const Provider = require('@truffle/hdwallet-provider');
const config = require("../../webclient/src/config");
var Contract = require('web3-eth-contract');
var contract = require("@truffle/contract");
const { ChainId, Pair, Token, TokenAmount, Trade, JSBI, WETH, Fetcher, Percent } = require('@venomswap/sdk')

const ERC20 = require('../../build/contracts/ERC20.json');
var ERC20Contract = contract(ERC20)

var ERC20Contract2 = new Contract(ERC20.abi)

const UniswapContractJSON = require('../../build/contracts/IUniswapRouter.json');
var UniswapContract = new Contract(UniswapContractJSON.abi)

//var contractAddr = "0xa586562F4E348129FAEBa9cCAA2f1b349E8f3078"
var contractAddr = "0x14e5Cd8AE462E50697FCc0F67B5109abbcC2096f";
const uniswapRouter = "0xda3DD48726278a7F478eFaE3BEf9a5756ccdb4D0";
const path = [
    '0x11F477aE5f42335928fC94601a8A81ec77b27b2b',
    '0x7466d7d0C21Fa05F32F5a0Fa27e12bdC06348Ce2'
  ];

const TestMulticallJSON = require('../../build/contracts/TestMulticall.json');
var TestMulticall = new Contract(TestMulticallJSON.abi,contractAddr)
var TestMulticall2 = contract(TestMulticallJSON)

const privateKeyProvider = new Provider(process.env.PRIVATE_KEY, config.CONFIG["testnet0"].RPC_URL);
const anotherProvider = new ethers.providers.JsonRpcProvider(config.CONFIG["testnet0"].RPC_URL);

ERC20Contract.setProvider(privateKeyProvider);
TestMulticall.setProvider(privateKeyProvider);
TestMulticall2.setProvider(privateKeyProvider);

describe("multicall test", () => {
    const WONE = WETH[ChainId.HARMONY_TESTNET]
	const VIPER = new Token(ChainId.HARMONY_TESTNET, '0x11F477aE5f42335928fC94601a8A81ec77b27b2b', 18, 'VIPER', 'Viper')
	const ONE_BIPS = new Percent(JSBI.BigInt(100), JSBI.BigInt(10000))
	const TWO_BIPS = new Percent(JSBI.BigInt(100), JSBI.BigInt(20000))

    console.log(privateKeyProvider.getAddress());

    it("should swap for viper", async()=>{
        var viperContract = await ERC20Contract.at(path[0])
		console.log("BEFORE", web3utils.fromWei(await viperContract.balanceOf(contractAddr)), "VIPER")
        
        const pairData = await Fetcher.fetchPairData(WONE, VIPER, anotherProvider)

		// TRADE ONE -> VIPER
		const amountOut = web3utils.toWei("1")
		const tokenOut = new TokenAmount(WONE, amountOut);
		const res = Trade.bestTradeExactIn([pairData], tokenOut, VIPER, { maxHops: 1, maxNumResults: 1 });
		const amountIn = res[0].minimumAmountOut(ONE_BIPS).raw.toString()
		console.log("Execution Price", res[0].executionPrice.toSignificant(6))
		console.log("Expected Amount (VIPER)=", amountIn, res[0].outputAmount.toFixed())

        const deadline = parseInt(new Date().getTime() / 1000) + 5000; //good
		var data = UniswapContract.methods.swapETHForExactTokens(amountIn, path.reverse(), contractAddr, deadline).encodeABI();
        //const tx = TestMulticall.methods.multiCall([{to: uniswapRouter, value: web3utils.toWei("1.0"), data: data}]);
        //const res2 = await tx.call({gas: 600000})        
        const instance = await TestMulticall2.at(contractAddr)
        const res2 = await instance.multiCall([{to: uniswapRouter, value: web3utils.toWei("1.0"), data: data}], { from: privateKeyProvider.getAddress()});
        console.log(res2);    

		console.log("AFTER", web3utils.fromWei(await viperContract.balanceOf(contractAddr)), "VIPER")

    });

    it.only("should start recovery with HOTP", async () => {
        var viperContract = await ERC20Contract.at(path[0])

        const instance = await TestMulticall2.at(contractAddr)
        const deadline = parseInt(new Date().getTime() / 1000) + 5000; //good
        // const res2 = await instance.swapCoin(web3utils.toWei("0.1"), '0', path, contractAddr, deadline,  { from: privateKeyProvider.getAddress()});
        // console.log(res2);

		const approve = ERC20Contract2.methods.approve(uniswapRouter, web3utils.toWei("0.1")).encodeABI();

        var data = UniswapContract.methods.swapExactTokensForETH(web3utils.toWei("0.1"), '0', path, contractAddr, deadline).encodeABI();
        console.log(data);
        // const res2 = await instance.multiCall([
        //                         {to: path[0], value: 0, data: approve},
        //                         {to: uniswapRouter, value: 0, data: data}],
        //                          { from: privateKeyProvider.getAddress()});

        const methodData = instance.contract.methods.multiCall([
            {to: path[0], value: 0, data: approve},
            {to: uniswapRouter, value: 0, data: data}]).encodeABI();

        const res2 = await instance.metaTx(methodData,
                                 { from: privateKeyProvider.getAddress()});

        console.log(res2);
        console.log("AFTER", web3utils.fromWei(await viperContract.balanceOf(contractAddr)), "VIPER")

    });
});