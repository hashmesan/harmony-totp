const Web3 = require('web3');
const Provider = require('@truffle/hdwallet-provider');
const relayerArtifacts = require('../../../build/contracts/Relayer.json');
const { TruffleProvider } = require('@harmony-js/core')
const { Account } = require('@harmony-js/account')

var contract = require("@truffle/contract");
var Relayer = contract(relayerArtifacts)

const RELAYER_ADDRESS = relayerArtifacts.networks[process.env.NETWORK_ID].address;
console.log("Deployed relayer=", RELAYER_ADDRESS);

function getHarmonyProvider() {
    // const provider = new TruffleProvider('https://api.s0.b.hmny.io', {}, { shardID: 0, chainId: process.env.NETWORK_ID });
    // provider.addByPrivateKey(process.env.PRIVATE_KEY); 
    // const account = new Account(process.env.PRIVATE_KEY)
    // provider.setSigner(account.checksumAddress)
    const provider = new Provider(process.env.PRIVATE_KEY, "https://api.s0.b.hmny.io");
    return provider;
}

async function getRelayer() {   
    const provider = getHarmonyProvider();
    const accounts = await new Web3(provider).eth.getAccounts();
    Relayer.setProvider(provider);
    Relayer.defaults({from: accounts[0]});
    return await Relayer.at(RELAYER_ADDRESS);
}

// submits wallet and receive a forwarder address
async function submitNewWalletQueue(config, networkFee) {
    const relayer = await getRelayer();
    var tx = await relayer.submitNewWalletQueue(config, networkFee, false);
    return tx.logs[0].args[0];
}

// returns how much deposits receive
async function getStatus(forwarder) {
    const relayer = await getRelayer();
    var tx = await relayer.getStatus(forwarder);
    console.log("getStatus", tx[0].toString());
    return {deposits: tx[0], isReady: tx[1]};
}

async function processWallet(forwarder) {
    const relayer = await getRelayer();
    var tx = await relayer.processWallet(forwarder);
    return tx.logs[0].args[0];
}

function submitMetaTx() {

}

module.exports = {
    submitNewWalletQueue,
    getStatus,
    processWallet
}