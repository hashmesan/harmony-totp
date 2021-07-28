const Web3 = require('web3');
const Provider = require('@truffle/hdwallet-provider');
const walletArtifacts = require('../../build/contracts/TOTPWallet.json');
const walletProxyArtifacts = require('../../build/contracts/WalletProxy.json');
const walletFactoryArtifacts = require('../../build/contracts/WalletFactory.json');

const { TruffleProvider } = require('@harmony-js/core')
const { Account } = require('@harmony-js/account')

var contract = require("@truffle/contract");
var Wallet = contract(walletArtifacts)
var WalletFactory = contract(walletFactoryArtifacts)
var WalletProxy = contract(walletProxyArtifacts)

function getHarmonyProvider() {
    console.log(process.env.PRIVATE_KEY)
    const provider = new Provider(process.env.PRIVATE_KEY, "https://api.s0.b.hmny.io");
    return provider;
}

async function getWallet(address) {   
    const provider = getHarmonyProvider();
    const accounts = await new Web3(provider).eth.getAccounts();
    Wallet.setProvider(provider);
    Wallet.defaults({from: accounts[0]});

    return await Wallet.at(address);
}

async function transferTx() {
    const wallet = await getWallet("0x21bA1bdfC2cD6BfA72e487Acd504Ab429C29EF5C");
    const amount = Web3.utils.toWei("0.0123", "ether");
    const tx = await wallet.makeTransfer("0x1727adCCe8F11E7b9cbDd065e5ab64158F8BcE3B", amount);
    console.log(tx);
}

transferTx().then(e=>{
    console.log(e);
}).catch(e=>{
    console.log(e);
})