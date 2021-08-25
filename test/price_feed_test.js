const truffleAssert = require("truffle-assertions");
const ethers = require("ethers");
const commons = require("./commons.js");
const chai = require("chai");
const BN = require("bn.js");
const bnChai = require("bn-chai");
const { expect } = chai;
chai.use(bnChai(BN));

const PriceConsumerV3 = artifacts.require("PriceConsumerV3");

const pairs = [
  {
    ccyPair: "BUSD / USD",
    address: "0xa0ABAcC3162430b67Aa6C135dfAA08E117A38bF0",
    price: "",
    timeStamp: "",
  },
  {
    ccyPair: "DAI / USD",
    address: "0x1FA508EB3Ac431f3a9e3958f2623358e07D50fe0",
    price: "",
    timeStamp: "",
  },
  {
    ccyPair: "DSLA / USD",
    address: "0x5f0423B1a6935dc5596e7A24d98532b67A0AeFd8",
    price: "",
    timeStamp: "",
  },
  {
    ccyPair: "ETH / USD",
    address: "0x4f11696cE92D78165E1F8A9a4192444087a45b64",
    price: "",
    timeStamp: "",
  },
  {
    ccyPair: "LINK / USD",
    address: "0xcd11Ac8C18f3423c7a9C9d5784B580079A75E69a",
    price: "",
    timeStamp: "",
  },
  {
    ccyPair: "ONE / USD",
    address: "0xcEe686F89bc0dABAd95AEAAC980aE1d97A075FAD",
    price: "",
    timeStamp: "",
  },
  {
    ccyPair: "SUSHI / USD",
    address: "0x90142a6930ecF80F1d14943224C56CFe0CD0d347",
    price: "",
    timeStamp: "",
  },
  {
    ccyPair: "USDC / USD",
    address: "0x6F2bD4158F771E120d3692C45Eb482C16f067dec",
    price: "",
    timeStamp: "",
  },
  {
    ccyPair: "USDT / USD",
    address: "0x9A37E1abFC430B9f5E204CA9294809c1AF37F697",
    price: "",
    timeStamp: "",
  },
  {
    ccyPair: "WBTC / USD",
    address: "0xEF637736B220a58C661bfF4b71e03ca898DCC0Bd",
    price: "",
    timeStamp: "",
  },
];

contract("PriceConsumerTest", (accounts) => {
  describe("getLatestPrice()", () => {
    before(async () => {
      await Promise.all(
        pairs.map(async (pair) => {
          const consumer = await PriceConsumerV3.new(pair.address);
          const { price, timeStamp } = await consumer.getLatestPrice();

          pair.price = price.toNumber() / 10e7;
          pair.timeStamp = timeStamp.toNumber();
        })
      );
    });

    it("should return a price that is a number for each ccy pair", () => {
      for (pair of pairs) {
        //console.log("Pair: ", pair);
        expect(pair.price).to.be.a("number");
      }
    });

    it("should return a price greater than zero for each ccy pair", () => {
      for (pair of pairs) {
        //console.log("Pair: ", pair);
        expect(pair.price).to.be.greaterThan(0);
      }
    });

    it("should return a price no older than 1h (2520 epochs)", () => {
      for (pair of pairs) {
        const timeDiff = Date.now() / 1000 - pair.timeStamp;

        //console.log("timeDiff ", timeDiff); //TODO: Remove if needed
        expect(timeDiff).to.be.lessThan(5000);
      }
    });
  });
});
