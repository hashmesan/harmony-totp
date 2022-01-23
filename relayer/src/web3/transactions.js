const Web3 = require('web3');
const ethers = require("ethers");
const fs = require("fs");

const { Contract } = require('@ethersproject/contracts');
const { JsonRpcProvider } = require("@ethersproject/providers");

const walletArtifacts = require('../../../build/contracts/TOTPWallet.json');
const walletFactoryArtifacts = require('../../../build/contracts/WalletFactory.json');


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
        this.provider = new JsonRpcProvider(this.config.provider, this.config.network_id);
        this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
        this.defaultAddress = this.wallet.address;

        //console.log("WalletFactory=",walletFactoryArtifacts.networks[this.config.network_id].address);
        //console.log("Loaded ENV=" + env + " provider=" + this.config.provider, "defaultAddress=", this.defaultAddress);
    }

    async getWalletFactory(write) {   
        const address = walletFactoryArtifacts.networks[this.config.network_id].address;
        return new Contract(address, walletFactoryArtifacts.abi, write? this.wallet : this.provider)
    }

    async getWallet(address) {   
        return new Contract(address, walletArtifacts.abi, this.wallet)
    }

    async createWallet(config) {
        //var count = await this.provider.getTransactionCount(this.defaultAddress);
        const factory = await this.getWalletFactory(true);
        console.log("sent=", count, this.env, config);
        var tx = await factory.createWallet(config,{ from: this.defaultAddress, gasLimit: 812388});
        return {tx: tx};
    }


    /**
     * verify the tx before we send it, why bother if it will fail?
     * validate gas minimums as well with estimateGas
     * 
     * @param {*} data 
     * @returns 
     */
    async submitMetaTx(data) {
        // console.log(data);
       // var count = await this.provider.getTransactionCount(this.defaultAddress);
        var wallet = await this.getWallet(data.from);
        var tx = await wallet.executeMetaTx(data.data, data.signatures, data.nonce, data.gasPrice, data.gasLimit, data.refundToken, data.refundAddress, { from: this.defaultAddress, gasLimit: data.gasLimit, gasPrice: data.gasPrice });
        return { tx: tx }
    }

    async getFactoryInfo() {
        const factory = await this.getWalletFactory();
        const implementation = await factory.walletImplementation();
        const releasePath = __dirname + "/../../releases/" + this.env + "/" + implementation + ".txt"
        
        var releaseNotes = null;
        if(fs.existsSync(releasePath)) {
            releaseNotes = fs.readFileSync(releasePath).toString()
        }
        return {
            address: factory.address,
            implementation: implementation,
            walletsCreated: await factory.getCreated(),
            releaseNotes: releaseNotes
        }
    }

    // returns how much deposits receive
    async getBalance(address) {
        const tx = await this.provider.getBalance(address);
        return {balance: tx.toString()}
    }

    async getDepositAddress(data) {
        const factory = await this.getWalletFactory();
        var tx = await factory.computeWalletAddress(data.owner, data.salt);
        return {address: tx};
    }

    async getContractCreated() {
        const deployedPath = __dirname + "/../../../contracts/deployed.json";
        let rawdata = fs.readFileSync(deployedPath);
        let jsonData = JSON.parse(rawdata);
        const factories = jsonData[this.env];
        let res = {};
        var web3 = new Web3(this.provider);

        for(var i=0; i < factories.length; i++) {
            var address = factories[i];
            const factoryContract = new Contract(address, walletFactoryArtifacts.abi, this.provider)
            const created = await factoryContract.getCreated();
            res[address] = created.map(e=>{ return {"wallet": e.wallet, "domain": e.domain}})
        }

        return {"factories": res };
    }
}

module.exports = Transactions