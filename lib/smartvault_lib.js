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
const {
    toBech32,
    fromBech32,
  } = require('@harmony-js/crypto');
const default_depth = 12;

// new SmartVault(CONFIG)
class SmartVault {
    constructor(config) {
        console.log("Connecting to ", config.RPC_URL);
        this.config = config;
        this.harmonyClient = new HarmonyClient(config.RPC_URL, config.ENS_ADDRESS);    
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
    async create(name, duration) {
        await this.relayClient.getFees();

        const available = await this.harmonyClient.isNameAvailable(name, duration || 31536000);
        if(available.address != ethers.constants.AddressZero) {
            console.error(`${name} is not available (${available.address})`);
            return null;
        }    
        this.walletData = {name: name, rentPrice: available.rentPrice, createFee: this.relayClient.createFee};
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
        const encodedQuery = query.replace('?', '%3F').replace('&', '%26')
        const uri = `otpauth://hotp/${this.walletData.name}${encodedQuery}`
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
        return this.harmonyClient.getBalance(this.walletData.walletAddress);
    }

    /**
     * 
     * @param {*} dailyLimit 
     * @param {function(message)} fStatus 
     */
    async submitWallet(dailyLimit, fStatus) {
        await this.relayClient.getFees();

        this.generateHashes(null, (p) =>{
            fStatus && fStatus(`Generated hashes ${p*100}%`);
        });

        console.log(this.walletData.leaves_arr);

        if(this.walletData.root_arr == undefined) {
            throw new Error("Must generate leaves first; try calling generateHashes()")
        }
 
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
        const tx = await this.relayClient.storeHashes(this.walletData.walletAddress, base64.encode(this.walletData.leaves_arr));
        fStatus && fStatus(`Uploaded Hashes to IPFS Hash=${tx.data.result.Hash} (${tx.data.result.Size} Bytes)`);

        // update Contract
        const setIdTx = await await this.relayClient.setHashStorageId(
                        this.walletData.walletAddress, 
                        tx.data.result.Hash, 
                        this.config.gasPrice, 
                        this.config.gasLimit, 
                        this.ownerAccount);     

        this.walletData.created = true;
        fStatus && fStatus("Successful stored hash on tx=" + setIdTx.data.result.tx.tx);
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
        
        // var verified = verifyProof(proof,[
        //     '0xd2aa7e76af4f02dd8ebb113ec4e26c88fd082a1ed41caa096c7242f543027ba7',
        //     '0x5b75ba75a794b3f69d1d74891cdb7608ecbd34d64dada875ea67cfee7c9a7b18',
        //     '0x42847a2ac95314ae79415a73ead9b482866b67be076906c6d14d3ae0b328976b',
        //     '0x5de86ae7af26fc0aca4a220d069716500be7278297bce5023443f5c637219dc8',
        //     '0x53cf98d2cfe1b9ecb57303d25be16d82b6b3c144760408d1274e512e59f86f72'
        //   ])
        //     console.log("Verified=", verified);

        fStatus && fStatus(`Generated proof(${proof.length}) counter=${counter}`);

        // submit commit
        var commitHash = web3utils.soliditySha3(merkleHex.concat(this.walletData.ownerAddress,
                                                    proof[0]));

        var tx = await this.relayClient.startRecoverCommit(this.walletData.walletAddress, 
                                            commitHash,
                                            this.config.gasPrice, 
                                            this.config.gasLimit)
                                            
        fStatus && fStatus(`Submitted recovery commitHash=${commitHash}`);
        // console.log(tx.data.result.tx);
        if (tx.data.result.tx.receipt.stack) {
            fStatus && fStatus(`Failed! ${tx.data.result.tx.receipt.stack}`);
            return;
        }
        if(!tx.data.result.tx.logs[0].args.success) {
            fStatus && fStatus(`Failed!`);
            return false;            
        }

        // submit reveal
        tx = await this.relayClient.startRecoverReveal(this.walletData.walletAddress, 
            this.walletData.ownerAddress,
            proof,
            0, 
            this.config.gasLimit)
        
        fStatus && fStatus(`Submitted recovery reveal`);
        //console.log(tx.data.result.tx.logs[0].args);
        if(!tx.data.result.tx.logs[0].args.success) {
            fStatus && fStatus(`Failed! ${web3utils.hexToAscii(tx.data.result.tx.logs[0].args.returnData)}`);
            return false;            
        }

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
        dir = dir || "./";
        var walletData = Object.assign({}, this.walletData);
        //console.log(walletData);
        walletData.leaves_arr = base64.encode(walletData.leaves_arr);
        var filename = dir + `.smartvault-${toBech32(walletData.walletAddress)}-${walletData.name}`;
        fs.writeFileSync(filename, JSON.stringify(walletData));
        console.log("Wrote to ", filename);
        return filename;
    }

    loadFromLocal(filename) {
        var walletData = JSON.parse(fs.readFileSync(filename));
        walletData.leaves_arr = base64.decode(walletData.leaves_arr);
        this.walletData = walletData;
        this.ownerAccount = new Web3EthAccounts().privateKeyToAccount(walletData.ownerSecret);
    }

    listWallets(dir) {
        dir = dir || "./";
        var matches = [];
        fs.readdirSync(dir).forEach(file => {
            if(file.startsWith(".smartvault-")) {
                matches.push(file)
            }
          });          
        var addresses = matches.map(e=> { return e.split("-")[1]})
        var names = matches.map(e=> { return e.split("-")[2]})
        return {matches, addresses, names};
    }

}

module.exports = SmartVault;