const Web3 = require('web3');
const Provider = require('@truffle/hdwallet-provider');
const walletArtifacts = require('../../../build/contracts/TOTPWallet.json');
const walletFactoryArtifacts = require('../../../build/contracts/WalletFactory.json');
const resolverArtifacts = require('../../../build/contracts/EnsResolver.json');
const registrarArtifacts = require('../../../build/contracts/RegistrarInterface.json');
const namehash = require('eth-ens-namehash');
const ethers = require("ethers");

const { TruffleProvider } = require('@harmony-js/core')
const { Account } = require('@harmony-js/account')

var contract = require("@truffle/contract");
var Wallet = contract(walletArtifacts)
var WalletFactory = contract(walletFactoryArtifacts)
var Resolver = contract(resolverArtifacts);
var RegistrarInterface = contract(registrarArtifacts);

const NETWORK_FEE = Web3.utils.toWei("0.00123", "ether");
const duration = 60 * 60 * 24 * 365; // 1 year

const CONFIG = {
    development: {
        network_id: 1000,
        resolver: "0x9590030b26dE3A037Cd679b33A177A645BFaC114",
        provider: "http://localhost:8545"
    },
    testnet0: {
        network_id: 1666700000,
        resolver: "0x335b5b3b0Acdf3aFabA00F71a3c7090e73990818",
        provider: "https://api.s0.b.hmny.io"
    },
    testnet3: {
        network_id: 1666700003,
        resolver: "0x335b5b3b0Acdf3aFabA00F71a3c7090e73990818",
        provider: "https://api.s3.b.hmny.io"
    },
    mainnet0: {
      network_id: 1666600000,
      resolver: "0x48D421c223E32B68a8973ef05e1314C97BBbc4bE",
      provider: "https://api.s0.t.hmny.io"
    }
}


// should support multiple env, between testnet & mainnet & multiple shards
function Transactions(env) {
    this.env = env;
    this.config = CONFIG[env];
    this.provider = new Provider(process.env.PRIVATE_KEY, this.config.provider);
    this.defaultAddress = this.provider.getAddress(0);
    // console.log("Loaded ENV=" + env + " provider=" + this.config.provider, "defaultAddress=", this.defaultAddress);
}

Transactions.prototype.getResolver = async function() {
    Resolver.setProvider(this.provider);
    return await Resolver.at(this.config.resolver);
}

Transactions.prototype.getWalletFactory = async function() {   
    WalletFactory.setProvider(this.provider);
    const address = walletFactoryArtifacts.networks[this.config.network_id].address;
    // console.log("walletfactory=", address);
    return await WalletFactory.at(address);
}

Transactions.prototype.getWallet = async function(address) {   
    Wallet.setProvider(this.provider);
    return await Wallet.at(address);
}

// submits wallet and receive a forwarder address
Transactions.prototype.createWallet = async function(config) {
    const factory = await this.getWalletFactory();
    config.resolver = this.config.resolver;
    console.log("sent=", config);
    var tx = await factory.createWallet(config,{ from: this.defaultAddress, gas: 712388});
    return {tx: tx.tx};
}

// returns how much deposits receive
Transactions.prototype.getBalance = async function(address) {
    const tx = await new Web3(this.provider).eth.getBalance(address);
    return {balance: tx}
}

Transactions.prototype.getDepositAddress = async function(data) {
    const factory = await this.getWalletFactory();
    var tx = await factory.computeWalletAddress(data.owner, data.salt);
    return {address: tx};
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
Transactions.prototype.submitMetaTx = async function(data) {
    // console.log(data);
    var wallet = await this.getWallet(data.from);
    var tx = await wallet.executeMetaTx(data.data, data.signatures, data.nonce, data.gasPrice, data.gasLimit, data.refundToken, data.refundAddress, { from: this.defaultAddress, gasLimit: data.gasLimit});
    return {tx: tx}
}

// used for nonce
Transactions.prototype.getTransactionCount = async function(address) {
    const tx = await new Web3(this.provider).eth.getTransactionCount(address);
    return {result: tx}
}

Transactions.prototype.checkName = async function(name) {
    const resolver = await this.getResolver();
    const tx = await resolver.addr(namehash.hash(name));
    //console.log("TX=", tx);
    if (tx == ethers.constants.AddressZero) {
        var domain = name.split(".").splice(1).join(".");
        var subdomain = name.split(".")[0];
        var subdomainAddr = await resolver.addr(namehash.hash(domain));
        console.log("subdomainRegistrar=", subdomainAddr);
        
        RegistrarInterface.setProvider(this.provider);
        const subdomainRegistrar = await RegistrarInterface.at(subdomainAddr);
        const rentPriceSub = await subdomainRegistrar.rentPrice(subdomain, duration);
        console.log("tx?", rentPriceSub)

        return { address: tx, cost: rentPriceSub.toString()};
    } else {
        return { address: tx, cost: 0 };
    }
}

/**
 * Get wallet contract information, including optional reverse lookup, and root hashes
 * @param {*} address 
 */
Transactions.prototype.getWalletInfo = async function(address) {
    var wallet = await this.getWallet(address);
    return await wallet.wallet();
}

module.exports = Transactions