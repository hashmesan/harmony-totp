/**
 * SmartVaultLib is a higher level order client used by CLI &
 * web to create wallets and manage operations.
 * 
 * Uses HarmonyClient, and RelayClient
 */

const HarmonyClient = require("./harmony_client");
const RelayerFactory = require("./relayer_client");
const { getTOTP, createHOTP } = require('./wallet');
const web3utils = require("web3-utils");

const crypto = require("crypto");
const b32 = require("thirty-two");
const Web3EthAccounts = require('web3-eth-accounts');
const ethers = require("ethers");


// new SmartVault(CONFIG)
class SmartVault {
    constructor(config) {
        console.log("Connecting to ", config.RPC_URL);
        this.config = config;
        this.harmonyClient = new HarmonyClient(config.RPC_URL, config.ENS_ADDRESS);    
        this.relayClient = new RelayerFactory(config.API_URL, config.ENV);    
        this.walletData = {};
        this.DefaultLimit = web3utils.toWei("1000");
    }
    
    /**
     * 
     * @param {string} name 
     * @param {int} duration 
     * 
     * Returns null if not available
     * Returns walletData if it is available
     */
    async create(name, duration) {
        await this.relayClient.getFees();

        const available = await this.harmonyClient.isNameAvailable(name, duration || 31536000);
        if(available.address != ethers.constants.AddressZero) {
            console.error(`${name} is not available (${available.address})`);
            return null;
        }    
        this.walletData = {name: name, rentPrice: available.rentPrice};
        this.getOTPSecret();

        const res = await this.relayClient.getDepositAddress(this.walletData.ownerAddress, this.walletData.salt);
        this.walletData.walletAddress = res.data.result.address;

        console.log("OTP Secret:", this.walletData.secret);
        console.log("Signing Key:", this.walletData.ownerAddress);
        console.log("WalletAddress Key:", this.walletData.walletAddress);

        return this.walletData;
    }

    getOTPSecret() {
        const account = new Web3EthAccounts().create();
        const bin = crypto.randomBytes(20);
        const base32 = b32.encode(bin).toString("utf8").replace(/=/g, "");
        const self = this;

        const secret = base32
        .toLowerCase()
        .replace(/(\w{4})/g, "$1 ")
        .trim()
        .split(" ")
        .join("")
        .toUpperCase();
        
        this.ownerAccount = account;
        this.walletData = Object.assign(this.walletData, {secret: secret, ownerAddress: account.address, ownerSecret: account.privateKey, salt: bin.readUIntLE(0, 6)})
    }

    getWalletData() {
        return this.walletData;
    }

    // validateOTP()
    validateOTP(input) {
        return getTOTP(this.walletData.secret, 2) == input;
    }

    /**
     * Generate the hashes asynchronously on mainthread and 
     * return status
     * @param {function(progress)} progress 
     */
    generateHashes(height, progress) {
        var mywallet = createHOTP(this.walletData.secret, height || 12, progress);    
        this.walletData = Object.assign(this.walletData, mywallet);
        this.walletData.merkleHeight = height || 12;
    }

    async getDepositAddress () {
        return this.walletData.walletAddress;
    }

    getDepositInfo() {
        return {
            walletAddress: this.walletData.walletAddress,
            createFee: this.walletData.createFee,
            rentPrice: this.walletData.rentPrice
        }
    }

    // waitForDeposit()
    async getDeposits() {
        return this.harmonyClient.getBalance(this.walletData.walletAddress);
    }

    /**
     * 
     * @param {*} dailyLimit 
     * @param {function(message)} fStatus 
     */
    async submitWallet(dailyLimit, fStatus) {
        // submitWallet()
        fStatus && fStatus("Deploying wallet, waiting for tx");
        await this.relayClient.submitWallet(
                    this.walletData.name, 
                    this.walletData.ownerAddress, 
                    this.walletData.root_arr,
                    this.walletData.merkleHeight,
                    ethers.constants.AddressZero,
                    dailyLimit || this.DefaultLimit,
                    this.walletData.salt
                )
        
        // upload IPFS
        fStatus && fStatus("Uploading hashes to IPFS... ");
        const tx = await this.relayClient.storeHashes(this.walletData.walletAddress, this.walletData.leaves_arr);
        fStatus && fStatus("Uploaded Hashes to IPFS Hash=" + tx.data.result.Hash);

        // update Contract
        const setIdTx = await await this.relayClient.setHashStorageId(
                        this.walletData.walletAddress, 
                        tx.data.result.Hash, 
                        this.config.gasPrice, 
                        this.config.gasLimit, 
                        this.ownerAccount);     

        fStatus && fStatus("Successful stored hash on tx=" + setIdTx.data.result.tx.tx);
    }

}

module.exports = SmartVault;