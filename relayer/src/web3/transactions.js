const Web3 = require('web3');
const ethers = require("ethers");
const { TruffleProvider } = require('@harmony-js/core')
const { Account } = require('@harmony-js/account')

const Provider = require('@truffle/hdwallet-provider');
var contract = require("@truffle/contract");
const walletArtifacts = require('../../../build/contracts/TOTPWallet.json');
const walletFactoryArtifacts = require('../../../build/contracts/WalletFactory.json');
var Wallet = contract(walletArtifacts)
var WalletFactory = contract(walletFactoryArtifacts)

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

class Transactions {

    /**
     * should support multiple env, between testnet & mainnet & multiple shards
     * @param {*} env 
     */
    constructor(env){
        this.env = env;
        this.config = CONFIG[env];
        this.provider = new Provider(process.env.PRIVATE_KEY, this.config.provider);
        this.defaultAddress = this.provider.getAddress(0);
        //console.log("Loaded ENV=" + env + " provider=" + this.config.provider, "defaultAddress=", this.defaultAddress);
    }

    async getWalletFactory() {   
        WalletFactory.setProvider(this.provider);
        const address = walletFactoryArtifacts.networks[this.config.network_id].address;
        // console.log("walletfactory=", address);
        return await WalletFactory.at(address);
    }

    async getWallet(address) {   
        Wallet.setProvider(this.provider);
        return await Wallet.at(address);
    }

    async createWallet(config) {
        var count = await new Web3(this.provider).eth.getTransactionCount(this.defaultAddress);
        const factory = await this.getWalletFactory();
        console.log("sent=", config);
        var tx = await factory.createWallet(config,{ from: this.defaultAddress, gas: 712388, nonce: count});
        return {tx: tx.tx};
    }

    async getFactoryInfo() {
        const factory = await this.getWalletFactory();

        return {
            address: factory.address,
            implementation: await factory.walletImplementation(),
            walletsCreated: await factory.getCreated()
        }
    }

    // returns how much deposits receive
    async getBalance(address) {
        const tx = await new Web3(this.provider).eth.getBalance(address);
        return {balance: tx}
    }

    async getDepositAddress(data) {
        const factory = await this.getWalletFactory();
        var tx = await factory.computeWalletAddress(data.owner, data.salt);
        return {address: tx};
    }
        
    async submitMetaTx(data) {
        // console.log(data);
        var count = await new Web3(this.provider).eth.getTransactionCount(this.defaultAddress);
        var wallet = await this.getWallet(data.from);
        var tx = await wallet.executeMetaTx(data.data, data.signatures, data.nonce, data.gasPrice, data.gasLimit, data.refundToken, data.refundAddress, { from: this.defaultAddress, gasLimit: data.gasLimit, nonce: count});
        return {tx: tx}
    }
}

module.exports = Transactions