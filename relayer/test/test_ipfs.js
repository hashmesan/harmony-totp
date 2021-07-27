var expect = require('chai').expect;
var assert = require('assert');

var ipfs = require("./../src/ipfs.js");
var wallet = require("../../lib/wallet.js");

const env = "development";

describe.skip('test IPFS()', function () {
//   it('test add', async function () {
//       const text = "abcdef";
//       const res = await ipfs.add(text);
//       console.log(res);

//       const res2 = await ipfs.cat(res.Hash);
//       console.log(res2);
//       assert.strictEqual(text, res2);
//   });
    it('should validate', async function() {
        var mywallet = wallet.createHOTP("BIGSECRET", 8);
        assert.ok(ipfs.isValidHashes(mywallet.root_arr, mywallet.leaves_arr));
    })

    it('should get wallet and validate', async function() {
        // this wallet uses "BIGSECRET"
        const preDeployedWallet = "0xc1cD169cCB7C79F85765641613f12430AA611a23";
        var mywallet = wallet.createHOTP("BIGSECRET", 4);
        var cid = await ipfs.storeHash(preDeployedWallet,mywallet.leaves_arr);
        console.log("got cid=", cid);
    });
});