var Transactions = require("./../src/web3/transactions.js");
var ENS = require('@ensdomains/ensjs');
const Web3 = require('web3');
const ethers = require("ethers");

const tx = new Transactions("mainnet");
var provider = new ethers.providers.Web3Provider(tx.provider);
console.log(ENS);

const address = '0x6313F8Cf1eEb32390CC1811906eAF2833a27562b';


var ens = new ENS.default({ provider, ensAddress: "0xaE7FFb8E6e38d80e4d032f53FA9A271764C2FDad"})

ens.name("lijiang2087.crazy.one").getAddress().then(e=>{
  console.log(e);
});
ens.getName(address).then(e=>{
  console.log("reverse?", e);
})
