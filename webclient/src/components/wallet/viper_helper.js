const { ChainId, Pair, Token, TokenAmount, Trade, JSBI, WETH, Fetcher, Percent } = require('@venomswap/sdk')
const ethers = require("ethers")
const Web3 = require("web3");
const {JsonRpcProvider} = require("@ethersproject/providers");
const uniswapJSON = require("../../../../build/contracts/IUniswapRouter.json")
const erc20JSON = require("../../../../build/contracts/ERC20.json")

const Contract = require('web3-eth-contract');
import RelayerClient from '../../../../lib/relayer_client';

const UNISWAP_ADDRESS = {
    "testnet0" : "0xda3DD48726278a7F478eFaE3BEf9a5756ccdb4D0"
}

function getChainId(env) {
    if(env.startsWith("testnet")) {
        return ChainId.HARMONY_TESTNET
    } else {
        return ChainId.HARMONY_MAINNET
    }
}

function getToken(env, token) {
    if(token.address) {
        return new Token(getChainId(env), token.address, token.decimals, token.symbol, token.name)
    }
    if(token.symbol == "ONE" && !token.address) {
        return WETH[getChainId(env)]
    }
}

export async function getBestAmountOut(client, from, to, amountOut) {
    const provider = new JsonRpcProvider(client.config.RPC_URL);

    const fromToken = getToken(client.config.ENV, from);
    const toToken = getToken(client.config.ENV, to);
    const pairData = await Fetcher.fetchPairData(fromToken, toToken, provider)

    const ONE_BIPS = new Percent(JSBI.BigInt(100), JSBI.BigInt(10000))
    const tokenOut = new TokenAmount(fromToken, amountOut);
    const res = Trade.bestTradeExactIn([pairData], tokenOut, toToken, { maxHops: 1, maxNumResults: 1 });
    const amountIn = res[0].minimumAmountOut(ONE_BIPS).raw.toString()
    return amountIn;
}

export async function swapToken(client, from, to, amountIn, amountOut) {
    console.log("SWAPToken", from, to, amountIn, amountOut);
    var uniswapContract = new Contract(uniswapJSON.abi)    
    var erc20Contract = new Contract(erc20JSON.abi)    

    const fromToken = getToken(client.config.ENV, from);
    const toToken = getToken(client.config.ENV, to);
    const path = [fromToken.address, toToken.address]; 
    const timestamp = parseInt(new Date().getTime() / 1000) + 2000;
    console.log("UniswapAddr=", UNISWAP_ADDRESS[client.config.ENV], "wallet=", client.walletData.walletAddress, path)

    if(fromToken.address == WETH[getChainId(client.config.ENV)].address) {
        var data = uniswapContract.methods.swapETHForExactTokens(amountOut, path, client.walletData.walletAddress, timestamp).encodeABI()
		var methodData = RelayerClient.getContract().methods.multiCall([{ to: UNISWAP_ADDRESS[client.config.ENV], value: amountIn, data: data }]).encodeABI()
		var res = await client.submitTransaction(methodData, 1000000000, 400000)
        console.log(res);
        return res;
    }
    else if(toToken.address == WETH[getChainId(client.config.ENV)].address) {
		const approve = erc20Contract.methods.approve(UNISWAP_ADDRESS[client.config.ENV], amountIn).encodeABI();
        var data = uniswapContract.methods.swapExactTokensForETH(amountIn, amountOut, path, client.walletData.walletAddress, timestamp).encodeABI()
		var methodData = RelayerClient.getContract().methods.multiCall([
            { to: fromToken.address, value: 0, data: approve},
            { to: UNISWAP_ADDRESS[client.config.ENV], value: 0, data: data }
        ]).encodeABI()
		var res2 = await client.submitTransaction(methodData, 1000000000, 700000)
    } 
    else {
        var data = uniswapContract.methods.swapExactTokensForTokens(amountIn, path, client.walletData.walletAddress, timestamp).encodeABI()
		var methodData = RelayerClient.getContract().methods.multiCall([{ to: uniswapContract.options.address, value: web3utils.toWei("2.5"), data: data }]).encodeABI()
		var res2 = await client.submitTransaction(methodData)
    }
}