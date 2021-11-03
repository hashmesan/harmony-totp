
const { toBech32, fromBech32 } = require('@harmony-js/crypto');
const web3utils = require("web3-utils");

//one13nw99xl53swl8jr742fx3aucf0l5vgzjvwe85h -- testnet0

var account = "one12qcrjg49a9quwyfyu3zauedmj4pc6jwhuplq85"; //mainnet
var account = "0x8cdc529bf48c1df3c87eaa9268f7984bff462052"; //testnet0
var account = fromBech32("one1c8dpswxg2p50znzecnq0peuxlxtcm9je7q7yje");

module.exports = async function(callback) {
    console.log("Send to ", account);
    try {
        var balance = await web3.eth.getBalance(account);
        console.log("balance (before)=", balance)

        var accounts = await web3.eth.getAccounts();
        var tx = await web3.eth.sendTransaction({from: accounts[0], to: (account), value: web3utils.toWei("0.1"), gas: 21033, gasPrice: web3utils.toWei("0.000000001")})
        console.log("GAS USED tx.gasUsed);

        var balance = await web3.eth.getBalance(account);
        console.log("balance (after)=", balance)
     
    }catch(e) {
        console.log(e);
    }
   callback();
};