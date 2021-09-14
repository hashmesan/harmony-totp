import { Token, ISwap } from "./iswap";
import axios from "axios";
import { TokenAmount } from "@venomswap/sdk";
import SmartVault from '../smartvault_lib';

const RelayerClient = require('../relayer_client');
const web3utils = require("web3-utils");
const web3contract = require('web3-eth-contract');

const uniswapJSON = require("../../build/contracts/IUniswapRouter.json")
const erc20JSON = require("../../build/contracts/ERC20.json")

export default abstract class SwapBase<ISwap> {

    
    protected abstract getToken(env: string, token: Token);
    protected abstract getRouterAddress(env: string): string;
    protected abstract getWONEToken(env: string);
    protected client: SmartVault;

    constructor(client: SmartVault) {
        this.client = client;
    }

    protected async fetchTokenList(tokenList, networkId) {
        return axios.get(tokenList).then(e => {
            const tokens = e.data.tokens.filter(e => {
                if (networkId == "1666600000") {
                    return e.chainId == null || e.chainId == "1666600000";
                } else {
                    return e.chainId == networkId;
                }
            });
            return tokens;
        });
    }

    async getTokenBalance(token: Token) {
        var balance = null;
        if(token.symbol == "ONE") {
            balance = await this.client.harmonyClient.getBalance(this.client.walletData.walletAddress);
        } else {
            var balances = await this.client.harmonyClient.getErc20Balance([token.address], this.client.walletData.walletAddress);
            balance = balances[0];
        }
		return new TokenAmount(this.getToken(this.client.config.ENV, token), balance);
    }

    async swapToken(from: Token, to: Token, amountOut: string, amountIn: string) {
        //console.log("SWAPToken", this.client.config.ENV, from, to, amountIn, amountOut);

        var uniswapContract = new web3contract(uniswapJSON.abi)    
        var erc20Contract = new web3contract(erc20JSON.abi)    
        var routerAddress = this.getRouterAddress(this.client.config.ENV);
        var WONE = this.getWONEToken(this.client.config.ENV);

        const fromToken = this.getToken(this.client.config.ENV, from);
        const toToken = this.getToken(this.client.config.ENV, to);
        const path = [fromToken.address, toToken.address]; 
        const timestamp = Math.trunc(new Date().getTime() / 1000) + 2000;
        
        //console.log("UniswapAddr=", routerAddress, "wallet=", client.walletData.walletAddress, path)
        //console.log(fromToken, WONE.address);

        if(fromToken.address == WONE.address) {
            var data = uniswapContract.methods.swapExactETHForTokens(amountIn, path, this.client.walletData.walletAddress, timestamp).encodeABI()
            var methodData = RelayerClient.getContract().methods.multiCall([{ to: routerAddress, value: amountOut, data: data }]).encodeABI()
            var res = await this.client.submitTransaction(methodData, 1000000000, 1000000)
            return res;
        }
        else if(toToken.address == WONE.address) {
            const approve = erc20Contract.methods.approve(routerAddress, amountOut).encodeABI();
            var data = uniswapContract.methods.swapExactTokensForETH(amountOut, amountIn, path, this.client.walletData.walletAddress, timestamp).encodeABI()
            var methodData = RelayerClient.getContract().methods.multiCall([
                { to: fromToken.address, value: 0, data: approve},
                { to: routerAddress, value: 0, data: data }
            ]).encodeABI()
            var res2 = await this.client.submitTransaction(methodData, 1000000000, 1000000)
            return res;
        } 
        else {
            const approve = erc20Contract.methods.approve(routerAddress, amountOut).encodeABI();
            var data = uniswapContract.methods.swapExactTokensForTokens(amountOut, amountIn, path, this.client.walletData.walletAddress, timestamp).encodeABI()
            var methodData = RelayerClient.getContract().methods.multiCall([
                { to: fromToken.address, value: 0, data: approve},
                { to: routerAddress, value: 0, data: data }
            ]).encodeABI()
            var res2 = await this.client.submitTransaction(methodData, 1000000000, 1000000)
            return res;    
        }
    }

    async getDescription(tx, me, client) {
        async function getTokenInfo(token) {
            var indexIn = tx.events.indexOf(token)
            var address = tx.logs[indexIn].address
            return await client.getERC20Info(address);
        }
        // transfer from router means going out
        var inToken = tx.events.filter(e=> e.name == "Transfer" && (e.args.from == me || Object.values(UNISWAP_ADDRESS).includes(e.args.from)));
        var outToken = tx.events.filter(e=> e.name == "Transfer" && (e.args.to == me || Object.values(UNISWAP_ADDRESS).includes(e.args.to)));

        if(inToken.length > 0 && outToken.length > 0) {
            //console.log(inToken, outToken);

            var tokenIn = await getTokenInfo(inToken[0])
            var tokenOut = await getTokenInfo(outToken[0])

            return "Sent: " + Number(web3utils.fromWei(inToken[0].args.value.toString() || '0')).toFixedNoRounding(4) + " " + tokenIn.symbol 
                + " Received: " + Number(web3utils.fromWei(outToken[0].args.value.toString() || '0')).toFixedNoRounding(4) + " " + tokenOut.symbol
        }

        if(tx.status == 0) {
            return "Failed"
        }
    }   
}