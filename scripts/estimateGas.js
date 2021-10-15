const { toBech32, fromBech32 } = require('@harmony-js/crypto');

var account = "one12qcrjg49a9quwyfyu3zauedmj4pc6jwhuplq85"; //mainnet
var account = "one13nw99xl53swl8jr742fx3aucf0l5vgzjvwe85h"; //testnet0
var account = "0xc1da1838c85068f14c59c4c0f0e786f9978d9659"; // new mainnet hashmesan12

module.exports = async function(callback) {
    try {
        const code = await web3.eth.getCode(("0xE00Dc9913721BE83d569E97B9f8FDcbb6a42620D"))
        console.log("Code", code)
        const res = await web3.eth.estimateGas({
            to: (account),
        })
        console.log(res);    
    }catch(e) {
        console.log(e);
    }
    callback();
}