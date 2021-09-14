import { ChainId, Pair, Token as SToken, Trade, JSBI, Percent, CurrencyAmount } from '@sushiswap/sdk';
const {JsonRpcProvider} = require("@ethersproject/providers");
import { Token, ISwap } from "./iswap";
import SmartVault from '../smartvault_lib';
import SwapBase from "./swap_base";
import { Contract } from '@ethersproject/contracts'

const IUniswapV2Pair = require('../../build/contracts/IUniswapV2Pair.json');
const UniswapContractJSON = require('../../build/contracts/IUniswapRouter.json');

const DEFAULT_LIST = {
    "testnet0": "https://raw.githubusercontent.com/sushiswap/default-token-list/master/tokens/harmony-testnet.json",
    "mainnet0" : "https://raw.githubusercontent.com/sushiswap/default-token-list/master/tokens/harmony.json"
}

const ROUTER_ADDRESS = {
    "testnet0" : "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
    "mainnet0": "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506"
}

var WETH = {
    [ChainId.HARMONY_TESTNET] : new SToken(ChainId.HARMONY_TESTNET, '0x7a2afac38517d512E55C0bCe3b6805c10a04D60F', 18, 'ONE', 'ONE'),
    [ChainId.HARMONY] : new SToken(ChainId.HARMONY, '0xcF664087a5bB0237a0BAd6742852ec6c8d69A27a', 18, 'ONE', 'ONE'),
}

function getChainId(env: string) {
    if(env.startsWith("testnet")) {
        return ChainId.HARMONY_TESTNET
    } else {
        return ChainId.HARMONY
    }
}

export default class Sushiswap extends SwapBase<ISwap> {

    constructor(client: SmartVault) {
        super(client);
    }

    getToken(env: string, token: Token) {
        if(token.address) {
            return new SToken(getChainId(env), token.address, token.decimals, token.symbol, token.name)
        }
        if(token.symbol == "ONE" && !token.address) {
            return WETH[getChainId(env)]
        }
    }
    getRouterAddress(env: string) {
        return ROUTER_ADDRESS[env];
    }

    getWONEToken(env: string) {
        return WETH[getChainId(env)];
    }

    getTokenList(networkId: string) {
        return this.fetchTokenList(DEFAULT_LIST[networkId], networkId);
    }

    async fetchPairData(tokenA: SToken, tokenB: SToken) {
        const address = Pair.getAddress(tokenA, tokenB);
        console.log("Address?", address);

        const provider = new JsonRpcProvider(this.client.config.RPC_URL);
        const [reserves0, reserves1, blocktime] = await new Contract(address, IUniswapV2Pair.abi, provider).getReserves()
        const balances = tokenA.sortsBefore(tokenB) ? [reserves0, reserves1] : [reserves1, reserves0]
        return new Pair(CurrencyAmount.fromRawAmount(tokenA, balances[0]), CurrencyAmount.fromRawAmount(tokenB, balances[1]))    
    }

    async getAmountOut(amountIn: string, coinIn: SToken, coinOut: SToken) {
        const c = new this.client.harmonyClient.web3.eth.Contract(UniswapContractJSON.abi, this.getRouterAddress(this.client.config.ENV))
        const path = [coinIn.address, coinOut.address]

        const amountsOut = await c.methods.getAmountsOut(amountIn, path).call()
        console.log("SUSHI-getAmountOut", amountIn, amountsOut)
        return new Pair(CurrencyAmount.fromRawAmount(coinIn, amountsOut[0]), CurrencyAmount.fromRawAmount(coinOut, amountsOut[1]))
    }

    /**
     * 
     * @param amountToBuy - asset to buy
     * @param coinIn - asset to send
     * @param coinToBuy - asset to buy
     * @returns amount of coinIn required to buy
     */
    async getAmountIn(amountToBuy: string, coinToSend: SToken, coinToBuy: SToken) {
        console.log("Buy", coinToBuy.symbol, amountToBuy, coinToBuy.symbol,coinToSend.symbol)

        const c = new this.client.harmonyClient.web3.eth.Contract(UniswapContractJSON.abi, this.getRouterAddress(this.client.config.ENV))
        const path = [coinToSend.address,coinToBuy.address]

        const amountsIn = await c.methods.getAmountsIn(amountToBuy, path).call()
        return new Pair(CurrencyAmount.fromRawAmount(coinToBuy, amountToBuy), CurrencyAmount.fromRawAmount(coinToSend, amountsIn[0]))
    }

    async getBestAmountIn(from: Token, to: Token, amountOut: string) {
        const fromToken = this.getToken(this.client.config.ENV, from);
        const toToken = this.getToken(this.client.config.ENV, to);
        const pairData = await this.fetchPairData(fromToken, toToken);
        const ONE_BIPS = new Percent(JSBI.BigInt(100), JSBI.BigInt(10000))
        const tokenOut = CurrencyAmount.fromRawAmount(fromToken, amountOut);
        const res = Trade.bestTradeExactIn([pairData], tokenOut, toToken, { maxHops: 1, maxNumResults: 1 });
        const amountIn = res[0].minimumAmountOut(ONE_BIPS)
        return {minimum: amountIn, executionPrice: res[0].executionPrice.toFixed(6), midPrice: res[0].outputAmount};
    }

    /**
     * 
     * @param from - asset to send
     * @param to - asset to buy
     * @param amountIn - asset to buy
     * @returns 
     */
    async getBestAmountOut(from: Token, to: Token, amountToBuy: string) {
        const fromToken = this.getToken(this.client.config.ENV, from);
        const toToken = this.getToken(this.client.config.ENV, to);
        const pairData = await this.fetchPairData(fromToken, toToken);

        console.log("getBestAmountOut::Execution Price: ", pairData.token1Price.toFixed(6)); // ONE->USD  is  ONE/USD
        const ONE_BIPS = new Percent(JSBI.BigInt(100), JSBI.BigInt(10000))
        const tokenIn = CurrencyAmount.fromRawAmount(toToken, amountToBuy);
        const res = Trade.bestTradeExactOut([pairData], fromToken, tokenIn, { maxHops: 1, maxNumResults: 1 });
        const amountOut = res[0].maximumAmountIn(ONE_BIPS)
        return amountOut;
    }
}
