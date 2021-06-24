const Web3 = require('web3');
const Provider = require('@truffle/hdwallet-provider');
const walletFactoryArtifacts = require('../../../build/contracts/WalletFactory.json');
const { TruffleProvider } = require('@harmony-js/core')
const { Account } = require('@harmony-js/account')

var contract = require("@truffle/contract");
var WalletFactory = contract(walletFactoryArtifacts)

const FACTORY_ADDRESS = walletFactoryArtifacts.networks[process.env.NETWORK_ID].address;
const NETWORK_FEE = Web3.utils.toWei("0.00123", "ether");

console.log("Deployed WALLET FACTORY=", FACTORY_ADDRESS);

function getHarmonyProvider() {
    const provider = new Provider(process.env.PRIVATE_KEY, "https://api.s0.b.hmny.io");
    return provider;
}

async function getDefaultAccount() {
    const provider = getHarmonyProvider();
    const accounts = await new Web3(provider).eth.getAccounts();
    return accounts[0];
}

async function getWalletFactory() {   
    const provider = getHarmonyProvider();
    const accounts = await new Web3(provider).eth.getAccounts();
    WalletFactory.setProvider(provider);
    WalletFactory.defaults({from: accounts[0]});
    console.log("Relayer=", accounts[0]);

    return await WalletFactory.at(FACTORY_ADDRESS);
}

// submits wallet and receive a forwarder address
async function createWallet(config) {
    const factory = await getWalletFactory();
    config.feeReceipient = await getDefaultAccount();
    config.feeAmount = NETWORK_FEE;
    var tx = await factory.createWallet(config);
    return {tx: tx.tx};
}

// returns how much deposits receive
async function getBalance(address) {
    const provider = getHarmonyProvider();
    const tx = await new Web3(provider).eth.getBalance(address);
    return {balance: tx}
}

async function getDepositAddress(data) {
    const factory = await getWalletFactory();
    var tx = await factory.computeWalletAddress(data.owner, data.salt);
    return {address: tx, networkFee: NETWORK_FEE};
}

/*
function executeMetaTx(
    bytes   calldata data,
    bytes   calldata signatures,
    uint256 nonce,
    uint256 gasPrice,  
    uint256 gasLimit,
    address refundToken, 0x0
    address refundAddress my main address         
) external 
 */       
function submitMetaTx(data, signatures, nonce) {

}

// used for nonce
async function getTransactionCount(address) {
    const provider = getHarmonyProvider();
    const tx = await new Web3(provider).eth.getTransactionCount(address);
    return {result: tx}
}

async function checkName(name) {
    const factory = await getWalletFactory();
    var tx = await factory.getContractDetails(name);
    console.log(tx);
    return tx[0];
}

module.exports = {
    getDefaultAccount,
    createWallet,
    getBalance,
    getDepositAddress,
    checkName
}