const truffleAssert = require("truffle-assertions");
const ethers = require("ethers");
const commons = require("./commons.js");
const chai = require("chai");
const BN = require("bn.js");
const bnChai = require("bn-chai");
const { expect } = chai;
chai.use(bnChai(BN));

const LiquidityValueCalculator = artifacts.require("LiquidityValueCalculator");
const WONE = "0x7a2afac38517d512E55C0bCe3b6805c10a04D60F";
const USDC = "0xc555b5c6743512d39c3637c31747fe8bcdc46b6e";
const factory = "0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac";

contract("LiquidityValueCalculator", (accounts) => {
  describe("pairInfo()", () => {
    before(async () => {
      const calculator = await LiquidityValueCalculator.new();
    });

    it("should return the Pair Info", () => {
      const info = calculator.pairInfo(factory, WONE, USDC);
      console.log("Info: ", info);
    });
  });
});
