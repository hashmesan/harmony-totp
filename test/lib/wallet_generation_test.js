
const wallet = require("../../lib/wallet");
const base64 = require("@ethersproject/base64");
var assert = require('assert');
const web3utils = require("web3-utils");

describe("Library test", (accounts) => {
  it("wallet generation", async () => {
    var {root_arr, leaves_arr} = wallet.createHOTP("SECRET", 4, (p)=>{
        console.log("progress", p);
    })
    console.log(root_arr, leaves_arr);
    console.log(leaves_arr[leaves_arr.length-1])
    console.log(base64.encode(leaves_arr).length)

    var tokens = [];
    for(var i=0; i<5;i++) {
        tokens.push(wallet.getTOTP("SECRET", i))
    }
    
    var a = new web3utils.BN("123123").toBuffer("le", 32);
    var b = new web3utils.BN("193123").toBuffer("le", 32);
    console.log("values=", a, b);
    assert.strictEqual(wallet.byteArrayIsSame(a, b), false);
    assert.strictEqual(wallet.byteArrayIsSame(a, a), true);

    console.log("Tokens=", tokens, tokens.join(""))
    var {token, proof} = wallet.getProofWithOTP(tokens, leaves_arr);
    console.log(token, proof);

    assert.strictEqual(wallet.verifyProof(proof, root_arr), true);

    return true;
  });
});
