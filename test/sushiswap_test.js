const ethers = require("ethers");
const chai = require("chai");
const BN = require("bn.js");
const bnChai = require("bn-chai");
const { expect } = chai;
chai.use(bnChai(BN));

const ERC20 = artifacts.require("ERC20");
const Sushiswap = artifacts.require("Sushiswap");

const WONE = "0x7a2afac38517d512E55C0bCe3b6805c10a04D60F";
const USDC = "0xc555b5c6743512d39c3637c31747fe8bcdc46b6e";
const POWER = "0x01c4611637c2ffc7d07245c7395c6dd56eee7260";

//const Sushiswap = require("../build/contracts/Sushiswap.json");
//var SushiswapContract = new Contract(Sushiswap.abi);

contract("SushiswapTest", (accounts) => {
  // SushiSwap contract
  // https://explorer.harmony.one/address/0x1b02da8cb0d097eb8d57a175b88c7d8b47997506?activeTab=6
  // https://explorer.testnet.harmony.one/address/0x1b02da8cb0d097eb8d57a175b88c7d8b47997506?activeTab=6
  const contractAddress = "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506";
  let sushi;
  let USDCContract;
  const myAddress = accounts[0];
  const deadline = parseInt(new Date().getTime() / 1000) + 2000;

  before(async () => {
    sushi = await Sushiswap.at(contractAddress);
    USDCContract = await ERC20.at(USDC);
  });

  describe("artifact", () => {
    it("should get correct one", async () => {
      //console.log(sushi.address);
      actual = sushi.address.toLowerCase();
      expect(actual).to.equal(contractAddress);
    });

    // WETH is equal to WONE on harmony
    it("should get correct sushiswap WETH address", async () => {
      const WETH = await sushi.WETH();
      //console.log(WETH);
      expect(WETH).to.equal(WONE);
    });

    it("should getAmountsOut", async () => {
      const amountsOut = await sushi.getAmountsOut(100, [WONE, USDC]);

      amountsOut.map((amount) => {
        //console.log(amount.toNumber());
        expect(amount.toNumber()).to.be.greaterThan(0);
      });
    });
  });

  /*
  it("should addLiquidity", async () => {});
  */

  //swap ONE to USDC
  describe("swapExactETHForTokens()", () => {
    let balance;
    const amountSend = 1;
    const amountSendWei = web3.utils.toWei(String(amountSend));

    before(async () => {
      const balanceBN = await web3.eth.getBalance(myAddress);
      balance = Number(ethers.utils.formatEther(balanceBN));
    });

    it("should send transaction", async () => {
      const path = [WONE, USDC];
      const deadline = parseInt(new Date().getTime() / 1000) + 2000;

      // TODO: should be dynamic value
      const amountOutMin = web3.utils.toWei("0.01");

      const result = await sushi.swapExactETHForTokens(amountOutMin, path, myAddress, deadline, { from: myAddress, value: amountSendWei });
      //console.log(result.receipt);
      expect(result.receipt).not.to.be.empty;
    });

    it("should subtract sendAmount ONE from balance after swap", async () => {
      const AfterbalanceBN = await web3.eth.getBalance(myAddress);
      const afterBalance = Number(ethers.utils.formatEther(AfterbalanceBN));
      //console.log(afterBalance);
      expect(afterBalance).to.be.lessThan(balance - amountSend);
    });

    it("should get USDC after swap", async () => {
      const USDCBalance = web3.utils.fromWei(await USDCContract.balanceOf(myAddress));
      //console.log(USDCBalance);
      expect(Number(USDCBalance)).to.be.greaterThan(0);
    });
  });

  //swap USDC to ONE
  describe("swapExactTokensForETH()", () => {
    let balance;
    const amountSend = 0.01;
    const amountSendWei = web3.utils.toWei(String(amountSend));
    let USDCBalance;

    before(async () => {
      const balanceBN = await web3.eth.getBalance(myAddress);
      balance = Number(ethers.utils.formatEther(balanceBN));

      USDCBalance = Number(web3.utils.fromWei(await USDCContract.balanceOf(myAddress)));
    });

    it("should approve USDC spending", async () => {
      const result = await USDCContract.approve(contractAddress, amountSendWei);
      //console.log(result);
      expect(result.receipt).not.to.be.empty;
    });

    it("should send transaction", async () => {
      const path = [USDC, WONE];

      // TODO: should be dynamic value
      const amountOutMin = web3.utils.toWei("0.001");

      const result = await sushi.swapExactTokensForETH(amountSendWei, amountOutMin, path, myAddress, deadline, { from: myAddress });
      //console.log(result.receipt);
      expect(result.receipt).not.to.be.empty;
    });

    it("should subtract sendAmount USDC from balance after swap", async () => {
      const USDCBalanceAfter = web3.utils.fromWei(await USDCContract.balanceOf(myAddress));

      expect(Number(USDCBalanceAfter)).to.be.lessThan(USDCBalance);
    });

    it("should get ONE after swap", async () => {
      const AfterbalanceBN = await web3.eth.getBalance(myAddress);
      const afterBalance = Number(ethers.utils.formatEther(AfterbalanceBN));
      //console.log(afterBalance);
      expect(afterBalance).to.be.greaterThan(balance);
    });
  });

  //swap USDC to POWER
  describe("swapExactTokensForTokens()", () => {
    const amountSend = 0.02;
    const amountSendWei = web3.utils.toWei(String(amountSend));
    let USDCBalance;
    let POWERContract;
    let POWERBalance;

    before(async () => {
      POWERContract = await ERC20.at(POWER);
      POWERBalance = Number(web3.utils.fromWei(await POWERContract.balanceOf(myAddress)));
      //console.log(POWERBalance);
      USDCBalance = Number(web3.utils.fromWei(await USDCContract.balanceOf(myAddress)));
      //console.log(USDCBalance);
    });

    it("should approve USDC spending", async () => {
      const result = await USDCContract.approve(contractAddress, amountSendWei);
      //console.log(result);
      expect(result.receipt).not.to.be.empty;
    });

    /*
    it("get amount out", async () => {
      const amountsOut = await sushi.getAmountsOut(1, [WONE, POWER]);

      amountsOut.map((amount) => {
        console.log(amount);
        //expect(amount.toNumber()).to.be.greaterThan(0);
      });
    });
    */

    it("should send transaction", async () => {
      const path = [USDC, WONE, POWER];

      // TODO: should be dynamic value
      const amountOutMin = web3.utils.toWei("0.00001");

      const result = await sushi.swapExactTokensForTokens(amountSendWei, amountOutMin, path, myAddress, deadline, { from: myAddress });
      //console.log(result.receipt);
      expect(result.receipt).not.to.be.empty;
    });

    it("should subtract sendAmount USDC from balance after swap", async () => {
      const USDCBalanceAfter = web3.utils.fromWei(await USDCContract.balanceOf(myAddress));
      //console.log(USDCBalanceAfter);
      expect(Number(USDCBalanceAfter)).to.be.lessThan(USDCBalance);
    });

    it("should get POWER after swap", async () => {
      const POWERBalanceAfter = Number(web3.utils.fromWei(await POWERContract.balanceOf(myAddress)));
      //console.log(POWERBalanceAfter);
      expect(POWERBalanceAfter).to.be.greaterThan(POWERBalance);
    });
  });
});
