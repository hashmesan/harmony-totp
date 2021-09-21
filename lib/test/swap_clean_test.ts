
const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-as-promised'))
var assert = require('assert');
const config = require("../../webclient/src/config");
const SmartVault = require("../smartvault_lib");

import { CurrencyAmount, TokenAmount } from "@venomswap/sdk";
import { ISwap, Token } from "../swaps/iswap";
import ViperSwap from "../swaps/viperswap";
import Sushiswap from "../swaps/sushiswap";
import { exec } from "child_process";

const web3utils = require("web3-utils");

describe("SmartVault test", () => {
	const walletFile = "/home/quoc/.smartvault/testnet0/.smartvault-one1chps000etlq4zujf38zl8dclx3jyt5qavmauev-hashmesan002.crazy.one"
	var client = new SmartVault(config.CONFIG["mainnet0"]);
	//client.loadFromLocal(walletFile);

    //testnet tokens
    const VIPER: Token = {
        address: "0x11F477aE5f42335928fC94601a8A81ec77b27b2b",
        decimals: 18,
        symbol: "VIPER",
        name: "Viper"
    }

    const USDC_MAP = {"testnet0": {
        address: "0xC555B5c6743512D39c3637C31747fE8BCDc46b6e",
        decimals: 18,
        symbol: "USDC",
        name: "USDC"
    }, "mainnet0": {
        address: "0x985458E523dB3d53125813eD68c274899e9DfAb4",
        decimals: 6,
        symbol: "USDC",
        name: "USDC"
    }}
    const USDC = USDC_MAP[client.config.ENV];

    const ONE: Token = {
        address: "",
        decimals: 18,
        symbol: "ONE",
        name: "Harmony"
    }
    
    async function swapToken(swap: ISwap, from: Token, to: Token, amountOut: string) {
		console.log("BEFORE", (await swap.getTokenBalance(from)).toFixed(6), VIPER.symbol)
		console.log("BEFORE", (await swap.getTokenBalance(to)).toFixed(6), "ONE")

        const bestIn = await swap.getBestAmountIn(from, to, amountOut);
        console.log("BestIn", bestIn.toFixed(6));

        var res = await swap.swapToken(from, to, amountOut, bestIn.numerator.toString());
        console.log(res);

        // AFTER
		console.log("AFTER", (await swap.getTokenBalance(from)).toFixed(6), VIPER.symbol)
		console.log("AFTER", (await swap.getTokenBalance(to)).toFixed(6), "ONE")
    }

    it("can viperswap in Testnet", async () => {
        await client.setup();
        var swap = new ViperSwap(client);
        await swapToken(swap, ONE, VIPER, web3utils.toWei("0.1"));
    });
    
    it("can viperswap out Testnet", async () => {
        await client.setup();
        var swap = new ViperSwap(client);

        await swapToken(swap, VIPER, ONE, web3utils.toWei("0.1"));

    });
    
    it("can sushiswap in Testnet", async () => {
        await client.setup();
        var swap = new Sushiswap(client);

        await swapToken(swap, ONE, USDC, web3utils.toWei("0.1"));
    });    

    it.only("check price, and in, and out matches", async () => {
        await client.setup();
        var swap = new Sushiswap(client);

        // ONE to USD  0.1 => ..
        var {amountWithSlippage, executionPrice, amount} = await swap.getBestAmountIn(ONE, USDC, web3utils.toWei("5"));
        console.log("SUSHI getBestAmountIn=", amountWithSlippage.toFixed(6), "USDC" , "ExecutionPrice=", executionPrice, "Amount=", amount.toFixed(6))

        var prevAmount = amount;
        var {amountWithSlippage, executionPrice, amount} = await swap.getBestAmountOut(ONE,USDC, amount.numerator.toString());
        console.log("SUSHI getBestAmountOut=", prevAmount.toFixed(6), "USDC", "Bestout=", amount.toFixed(10), "ONE")
    });

    it.only("check 2 price, and in, and out matches", async () => {
        await client.setup();
        var swap = new ViperSwap(client);

        // ONE to USD  0.1 => ..
        const bestIn = await swap.getBestAmountIn(ONE, VIPER, web3utils.toWei("0.1"));
        const bestOut = await swap.getBestAmountOut(ONE,VIPER, bestIn.numerator.toString());
        console.log("VIPER bestin=", bestIn.toFixed(6), "VIPER", "Bestout=", bestOut.toFixed(6), "ONE")
    });
});