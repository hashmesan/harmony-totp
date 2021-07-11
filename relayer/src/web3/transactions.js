const Web3 = require('web3');
const Provider = require('@truffle/hdwallet-provider');
const walletArtifacts = require('../../../build/contracts/TOTPWallet.json');
const walletFactoryArtifacts = require('../../../build/contracts/WalletFactory.json');
const ethers = require("ethers");

const { TruffleProvider } = require('@harmony-js/core')
const { Account } = require('@harmony-js/account')

var contract = require("@truffle/contract");
var Wallet = contract(walletArtifacts)
var WalletFactory = contract(walletFactoryArtifacts)

const NETWORK_FEE = Web3.utils.toWei("0.00123", "ether");
const duration = 60 * 60 * 24 * 365; // 1 year

const CONFIG = {
    development: {
        network_id: 1000,
        provider: "http://localhost:8545",
    },
    testnet0: {
        network_id: 1666700000,
        provider: "https://api.s0.b.hmny.io"
    },
    testnet3: {
        network_id: 1666700003,
        provider: "https://api.s3.b.hmny.io"
    },
    mainnet0: {
      network_id: 1666600000,
      provider: "https://api.s0.t.hmny.io",
      archiveFactories: ["0xf05C50D0C89E77ce49Da9D223f371fad475fa3fF"]
    }
}

// should support multiple env, between testnet & mainnet & multiple shards
function Transactions(env) {
    this.env = env;
    this.config = CONFIG[env];
    this.provider = new Provider(process.env.PRIVATE_KEY, this.config.provider);
    this.defaultAddress = this.provider.getAddress(0);
    console.log("Loaded ENV=" + env + " provider=" + this.config.provider, "defaultAddress=", this.defaultAddress);
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
    console.log("sent=", config);
    var tx = await factory.createWallet(config,{ from: this.defaultAddress, gas: 712388});
    return {tx: tx.tx};
}

Transactions.prototype.getFactoryInfo = async function() {
    const factory = await this.getWalletFactory();

    return {
        address: factory.address,
        implementation: await factory.walletImplementation(),
        walletsCreated: await factory.getCreated()
    }
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
     
Transactions.prototype.submitMetaTx = async function(data) {
    // console.log(data);
    var wallet = await this.getWallet(data.from);
    var tx = await wallet.executeMetaTx(data.data, data.signatures, data.nonce, data.gasPrice, data.gasLimit, data.refundToken, data.refundAddress, { from: this.defaultAddress, gasLimit: data.gasLimit});
    return {tx: tx}
}


module.exports = Transactions