import { ChainId, Pair, Token as VToken, TokenAmount, Trade, JSBI, WETH, Fetcher, Percent } from '@venomswap/sdk'
const {JsonRpcProvider} = require("@ethersproject/providers");
import { Token, ISwap } from "./iswap";
import SmartVault from '../smartvault_lib';
import SwapBase from "./swap_base";

const DEFAULT_LIST = "https://d1xrz6ki9z98vb.cloudfront.net/venomswap/lists/venomswap-default.tokenlist.json";

const UNISWAP_ADDRESS = {
    "testnet0" : "0xda3DD48726278a7F478eFaE3BEf9a5756ccdb4D0",
    "mainnet0": ""
}

function getChainId(env: string) {
    if(env.startsWith("testnet")) {
        return ChainId.HARMONY_TESTNET
    } else {
        return ChainId.HARMONY_MAINNET
    }
}

export default class ViperSwap extends SwapBase<ISwap> {

    constructor(client: SmartVault) {
        super(client);
    }

    getToken(env: string, token: Token) {
        if(token.address) {
            return new VToken(getChainId(env), token.address, token.decimals, token.symbol, token.name)
        }
        if(token.symbol == "ONE" && !token.address) {
            return WETH[getChainId(env)]
        }
    }
    getRouterAddress(env: string) {
        return UNISWAP_ADDRESS[env];
    }

    getWONEToken(env: string) {
        return WETH[getChainId(env)];
    }

    getTokenList(networkId: string) {
        return this.fetchTokenList(DEFAULT_LIST, networkId);
    }

    /**
     * Given amountOut (sending), get the best amountIn (receive)
     * 
     * @param from 
     * @param to 
     * @param amountOut 
     * @returns 
     */
    async getBestAmountIn(from: Token, to: Token, amountOut: string) {
        const provider = new JsonRpcProvider(this.client.config.RPC_URL);

        const fromToken = this.getToken(this.client.config.ENV, from);
        const toToken = this.getToken(this.client.config.ENV, to);
        const pairData = await Fetcher.fetchPairData(fromToken, toToken, provider)
    
        const ONE_BIPS = new Percent(JSBI.BigInt(100), JSBI.BigInt(10000))
        const tokenOut = new TokenAmount(fromToken, amountOut);

        const res = Trade.bestTradeExactIn([pairData], tokenOut, toToken, { maxHops: 1, maxNumResults: 1 });
        const amountIn = res[0].minimumAmountOut(ONE_BIPS)
        return amountIn;
    }

    /**
     * Given amountIn (receiving), get the best amountOut (sending)
     * 
     * @param from 
     * @param to 
     * @param amountOut 
     * @returns 
     */
    async getBestAmountOut(from: Token, to: Token, amountIn: string) {
        const provider = new JsonRpcProvider(this.client.config.RPC_URL);

        const fromToken = this.getToken(this.client.config.ENV, from);
        const toToken = this.getToken(this.client.config.ENV, to);
        const pairData = await Fetcher.fetchPairData(fromToken, toToken, provider)
    
        const ONE_BIPS = new Percent(JSBI.BigInt(100), JSBI.BigInt(10000))
        const tokenIn = new TokenAmount(toToken, amountIn);
        const res = Trade.bestTradeExactOut([pairData], fromToken, tokenIn, { maxHops: 1, maxNumResults: 1 });
        const amountOut = res[0].maximumAmountIn(ONE_BIPS)
        return amountOut;
    }
}
