
const HarmonyClient = require("../harmony_client");
const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-as-promised'))
var assert = require('assert');
const web3utils = require("web3-utils");

describe("Library test", (accounts) => {
  it("checks for name available", async () => {
    var client = new HarmonyClient("https://api.s3.b.hmny.io", "0x4fb1C434101ced0773a3bc77D541B3465023639f");
    var available = await client.isNameAvailable("ha00.crazy.one", 31536000);
    console.log("Available?", available);
    return true;
  });

  it("checks transaction details", async () => {
    var client = new HarmonyClient("https://api.s3.b.hmny.io", "0x4fb1C434101ced0773a3bc77D541B3465023639f","https://explorer.pops.one:8888");
    console.log(await client.getTransactionDecoded("0x2159a9e542c48d37db0c1ffa7d59f95298f392b692a94832f87be47012fd3f02"))
    console.log(await client.getTransactionsByAccount("one13qv5p9ug7s0xpkrfc2y2gj30mr8llqr8z66yad"))
    return true;
  })

  it("checks transaction details", async () => {
    var client = new HarmonyClient("https://api.s3.b.hmny.io", "0x4fb1C434101ced0773a3bc77D541B3465023639f","https://explorer.pops.one:8888");
    console.log(await client.getPublicResolver())
  });

  it("error when wallet doesn't exist", async () => {
    var client = new HarmonyClient("https://api.s3.b.hmny.io", "0x4fb1C434101ced0773a3bc77D541B3465023639f","https://explorer.pops.one:8888");
    await expect(client.getSmartVaultInfo("0x1727adcce8f11e7b9cbdd065e5ab64158f8bce3b")).to.rejectedWith("Bad smartvault address")
  });

  it.only("precision test", async() => {

    var v = '1000000001010000047168000';
    //var targetvalue = new web3utils.BN(web3utils.fromWei(v))

    function roundWei(wei, unit) {
      unit = unit || 'milli';
      len = web3utils.unitMap[unit].length - 1;
      var threshold = new web3utils.BN(web3utils.toWei('1', unit));
      var smallfinny = web3utils.fromWei(v, unit).split(".")[1];  
      if(web3utils.toBN(smallfinny).gt(0)) {
        var zeroOut = v.substr(0,v.length-len) + web3utils.padRight('0', len);
        var roundedUp = web3utils.toBN(zeroOut).add(threshold);
        return roundedUp
      }
      return wei        
    }

    console.log('original', web3utils.fromWei(v, 'ether'))
    console.log('rounded:', web3utils.fromWei(roundWei(v)))
  });
});
