/**
 * SmartVaultLib is a higher level order client used by CLI &
 * web to create wallets and manage operations.
 * 
 * Uses HarmonyClient, and RelayClient
 */

const HarmonyClient = require("./harmony_client");
const RelayerFactory = require("./relayer_client");
const { getTOTP, createHOTP, getProofWithOTP, verifyProof } = require('./wallet');
const web3utils = require("web3-utils");
const merkleHex = require("./merkle_hex");
const crypto = require("crypto");
const b32 = require("thirty-two");
const Web3EthAccounts = require('web3-eth-accounts');
const ethers = require("ethers");
const base64 = require("@ethersproject/base64");
const fs = require('fs');
const utils = require('./utils');

const {
    toBech32,
    fromBech32,
  } = require('@harmony-js/crypto');
const RelayerClient = require("./relayer_client");
const default_depth = 12;

// new SmartVault(CONFIG)
class SmartVault {
    constructor(config, dir) {
        console.log("Connecting to ", config.RPC_URL, dir);
        this.config = config;
        this.localDir = dir || ".smartvault/";
        this.harmonyClient = new HarmonyClient(config.RPC_URL, config.ENS_ADDRESS, config.EXPLORER_URL);    
        this.relayClient = new RelayerFactory(config.API_URL, config.ENV);    
        this.walletData = {created: false};
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
    async create(name, duration, dailyLimit, drainAddress) {
        await this.relayClient.getFees();

        duration = duration || 31536000;
        dailyLimit = dailyLimit || this.DefaultLimit;
        drainAddress = drainAddress || ethers.constants.AddressZero;

        const available = await this.harmonyClient.isNameAvailable(name, duration);
        if(available.address != ethers.constants.AddressZero) {
            //console.error(`${name} is not available (${available.address})`);
            return null;
        }    
        this.walletData = {name, dailyLimit, drainAddress, rentPrice: utils.roundWei(available.rentPrice), createFee: this.relayClient.createFee};
        this.getOTPSecret();

        const res = await this.relayClient.getDepositAddress(this.walletData.ownerAddress, this.walletData.salt);
        this.walletData.walletAddress = res.data.result.address;

        // console.log("OTP Secret:", this.walletData.secret);
        // console.log("Signing Key:", this.walletData.ownerAddress);
        // console.log("WalletAddress Key:", this.walletData.walletAddress);

        return this.walletData;
    }

    generateNewOwnerKey() {
        const account = new Web3EthAccounts().create();
        this.ownerAccount = account;
        this.walletData = Object.assign(this.walletData, {ownerAddress: account.address, ownerSecret: account.privateKey});
    }

    /**
     * Generates owner key, and OTP Secret
     * 
     */
    getOTPSecret() {
        this.generateNewOwnerKey();
        const bin = crypto.randomBytes(20);
        const base32 = b32.encode(bin).toString("utf8").replace(/=/g, "");

        var secret = base32
        .toLowerCase()
        .replace(/(\w{4})/g, "$1 ")
        .trim()
        .split(" ")
        .join("")
        .toUpperCase();
        //secret = "JBSWY3DPEHPK3PXP"; // for testing
        this.walletData = Object.assign(this.walletData, {secret: secret,  salt: bin.readUIntLE(0, 3)})
        
        //DEBUG
        console.log("DEBUG:", getTOTP(this.walletData.secret, 2));
    }

    getOTPScanUrl() {
        const query = `?counter=1&secret=${this.walletData.secret}&issuer=smartvault.one`
        const uri = `otpauth://hotp/${this.walletData.name}${query}`
        return uri;
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
        var mywallet = createHOTP(this.walletData.secret, height || default_depth, progress);    
        this.walletData = Object.assign(this.walletData, mywallet);
        this.walletData.merkleHeight = height || default_depth;
    }

    /**
     * setHashes is set manually if it is generated separately like WebWorker
     * 
     * @param {*} root_arr 
     * @param {*} leaves_arr 
     * @param {*} height 
     */
    setHashes(root_arr, leaves_arr, height) {
        this.walletData.merkleHeight = height;
        this.walletData.root_arr = root_arr;
        this.walletData.leaves_arr = leaves_arr;
    }

    async getDepositAddress () {
        return this.walletData.walletAddress;
    }

    getDepositInfo() {
        return {
            walletAddress: this.walletData.walletAddress,
            createFee: this.walletData.createFee,
            rentPrice: this.walletData.rentPrice,
            totalFee: new web3utils.BN(this.walletData.createFee).add(new web3utils.BN(this.walletData.rentPrice)).toString()
        }
    }

    // waitForDeposit()
    async getDeposits() {
        //console.log("Getting deposits for: ", this.walletData.walletAddress);
        return this.harmonyClient.getBalance(this.walletData.walletAddress);
    }

    /**
     * 
     * @param {*} dailyLimit 
     * @param {function(message)} fStatus 
     */
    async submitWallet(fStatus, skipIPFS, height) {
        await this.relayClient.getFees();

        this.generateHashes(height, (p) =>{
            fStatus && fStatus(`Generated hashes ${p*100}%`);
        });

        if(this.walletData.root_arr == undefined) {
            throw new Error("Must generate leaves first; try calling generateHashes()")
        }
        
        const resolver = await this.harmonyClient.getPublicResolver()

        // submitWallet()
        fStatus && fStatus("Deploying wallet, waiting for tx");
        await this.relayClient.submitWallet(
                    this.walletData.name, 
                    this.walletData.ownerAddress, 
                    this.walletData.root_arr,
                    this.walletData.merkleHeight,
                    this.walletData.drainAddress,
                    this.walletData.dailyLimit,
                    this.walletData.salt,
                    resolver
                )
        
        if (!skipIPFS) {
            // upload IPFS
            fStatus && fStatus("Uploading hashes to IPFS... ");
            const tx = await this.relayClient.storeHashes(this.walletData.walletAddress, base64.encode(this.walletData.leaves_arr));
            fStatus && fStatus(`Uploaded Hashes to IPFS Hash=${tx.data.result.Hash} (${tx.data.result.Size} Bytes)`);

            // update Contract
            const setIdTx = await this.relayClient.setHashStorageId(
                            this.walletData.walletAddress, 
                            tx.data.result.Hash, 
                            this.config.gasPrice, 
                            this.config.gasLimit, 
                            this.ownerAccount);     
            fStatus && fStatus("Successful stored hash on contract.");
        }

        this.walletData.created = true;
        return true;
    }

    async recoverWallet(name, codes, fStatus) {
        await this.relayClient.getFees();

        // get address
        console.log("recoverWallet", name)

        var available = await this.harmonyClient.isNameAvailable(name);
        if(available.address == ethers.constants.AddressZero) {
            console.error("Wallet Address not found");
            return;
        }

        fStatus && fStatus("Found at address=" + available.address);
        
        // check wallet
        this.walletData.walletAddress = available.address;
        this.walletData.name = name;
        var info = await this.harmonyClient.getSmartVaultInfo(available.address);
        
        // console.log(info);

        fStatus && fStatus(`Wallet owned by ${info.owner} counter=${info.counter} hashStorageId=${info.hashStorageID}`);

        this.generateNewOwnerKey();
        fStatus && fStatus("Generated new owner key=" + this.walletData.ownerAddress);

        // load hashes
        const hashData = await this.relayClient.getHashes(this.walletData.walletAddress);
        this.walletData.leaves_arr = base64.decode(hashData.data.result);

        fStatus && fStatus("Loaded merkle hashes len=" + this.walletData.leaves_arr.length);

        // get proof
        var {token, proof, counter, index} = getProofWithOTP(codes, 
                                this.walletData.leaves_arr);

        fStatus && fStatus(`Generated proof(${proof.length}) counter=${counter}`);

        // submit commit
        var commitHash = web3utils.soliditySha3(merkleHex.concat(this.walletData.ownerAddress,
                                                    proof[0]));

        var tx = await this.relayClient.startRecoverCommit(this.walletData.walletAddress, 
                                            commitHash,
                                            this.config.gasPrice, 
                                            this.config.gasLimit)
                                            
        fStatus && fStatus(`Submitted recovery commitHash=${commitHash}`);
        
        // submit reveal
        tx = await this.relayClient.startRecoverReveal(this.walletData.walletAddress, 
            this.walletData.ownerAddress,
            proof,
            0, 
            this.config.gasLimit)
        
        fStatus && fStatus(`Submitted recovery reveal`);

        var info = await this.harmonyClient.getSmartVaultInfo(available.address);
        if(info.owner == this.walletData.ownerAddress) {
            fStatus && fStatus("Successfully recovered to new address="+ info.owner);
        }
        this.walletData.created = true;
        return true;
    }

    loadFromWalletData(data) {
        this.walletData = data;
        if(data.ownerSecret) {
            console.log("setup owner account");
            this.ownerAccount = new Web3EthAccounts().privateKeyToAccount(data.ownerSecret);
        }
    }

    saveWalletLocal(dir) {
        dir = (dir || this.localDir) + this.config.ENV + "/";
        fs.mkdirSync(dir, {recursive: true});

        var walletData = Object.assign({}, this.walletData);
        //console.log(walletData);
        walletData.leaves_arr = base64.encode(walletData.leaves_arr);
        var filename = dir + `.smartvault-${toBech32(walletData.walletAddress)}-${walletData.name}`;
        fs.writeFileSync(filename, JSON.stringify(walletData));
        console.log("Wrote to ", filename);
        return filename;
    }

    loadFromLocal(filename) {
        console.log("loading..", filename)
        var walletData = JSON.parse(fs.readFileSync(filename));
        walletData.leaves_arr = base64.decode(walletData.leaves_arr);
        this.walletData = walletData;
        //console.log("loading ", walletData)
        this.ownerAccount = new Web3EthAccounts().privateKeyToAccount(walletData.ownerSecret);
    }

    listWallets(dir) {
        dir = (dir || this.localDir) + this.config.ENV + "/";
        fs.mkdirSync(dir, {recursive: true});

        var matches = [];
        fs.readdirSync(dir).forEach(file => {
            if(file.startsWith(".smartvault-")) {
                matches.push(file)
            }
          });          
        var addresses = matches.map(e=> { return e.split("-")[1]})
        var names = matches.map(e=> { return e.split("-")[2]})
        return {dir, matches, addresses, names};
    }

    async submitTransaction(methodData, gasPrice, gasLimit) {
        gasPrice = gasPrice || this.config.gasPrice
        gasLimit = gasLimit || this.config.gasLimit
        return await this.relayClient.submitMetaTx(this.walletData.walletAddress, methodData, gasPrice, gasLimit, [this.ownerAccount])        
    }

    async getTransactions() {
        return await this.harmonyClient.getTransactionsByAccount(this.walletData.walletAddress);
    }

    async getSmartVaultInfo() {
        return await this.harmonyClient.getSmartVaultInfo(this.walletData.walletAddress);
    }
}

module.exports = SmartVault;