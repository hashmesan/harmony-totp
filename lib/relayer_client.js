const wallet = require("./wallet");
const ethers = require("ethers");
const web3utils = require("web3-utils");
const axios = require("axios");

const {
    toBech32,
    fromBech32,
  } = require('@harmony-js/crypto');
  
  const TOTPWalletArtifact = require('../build/contracts/TOTPWallet.json');
  const NUMOFTOKENS = 5;
  var Contract = require('web3-eth-contract');
  var contract = new Contract(TOTPWalletArtifact.abi)
  
class RelayerClient { 
    
    constructor(url, env) {
        this.url = url;
        this.env = env;
    }

    async getFees() {
        const res = await axios.post(this.url,{
                operation: "getRefundInfo",
                env: this.env
            })
        this.createFee = res.data.result.createFee;
        this.refundAddress = fromBech32(res.data.result.refundAddress);
        //console.log(`Create Fee ${this.createFee} RefundAddress=${this.refundAddress}`)
    }

    async getDepositAddress(ownerAddress, salt) {
        return axios.post(this.url, {
                operation: "getDepositAddress",
                env: this.env,
                data: {
                    owner: ownerAddress,
                    salt: salt
                }
            });
    }

    async submitMetaTx(from, methodData, gasPrice, gasLimit, feeAccount, signers) {

        var nonce = await wallet.getNonceForRelay();
        var sigs = await wallet.signOffchain2(
            signers,
            from,
            0,
            methodData,
            0,
            nonce,
            0,
            gasLimit,
            ethers.constants.AddressZero,
            feeAccount
        );    

        return axios.post(this.url, {
                operation: "submitMetaTx",
                env: this.env,
                data: {
                    from: from,
                    data: methodData,
                    signatures: sigs,
                    nonce,
                    gasPrice,
                    gasLimit,
                    refundToken: ethers.constants.AddressZero,
                    refundAddress: feeAccount
                }
            });
    }

    async transferTX(from, destination, amount, gasPrice, gasLimit, ownerAccount) {
        if(!this.refundAddress) {
            await this.getFees();
        }
        //console.log("Transfer", from, destination, amount)
        const methodData = contract.methods.makeTransfer(destination,amount).encodeABI();
        return this.submitMetaTx(from, methodData, gasPrice, gasLimit, this.refundAddress, [ownerAccount]);
    }

    async setHashStorageId(from, id, gasPrice, gasLimit, ownerAccount) {
        const methodData = contract.methods.setHashStorageId(id).encodeABI();
        return this.submitMetaTx(from, methodData, gasPrice, gasLimit, this.refundAddress, [ownerAccount]);
    }

    async startRecoverCommit(from, commitHash, gasPrice, gasLimit) {
        const methodData = contract.methods.startRecoverCommit(commitHash).encodeABI();
        return this.submitMetaTx(from, methodData, gasPrice, gasLimit, this.refundAddress, []);
    }

    async startRecoverReveal(from, owner, proof, gasPrice, gasLimit) {
        const methodData = contract.methods.startRecoveryReveal(owner, proof).encodeABI();
        return this.submitMetaTx(from, methodData, gasPrice, gasLimit, this.refundAddress, []);
    }

    async submitWallet(name, ownerAddress, root_arr, merkleHeight, drainAddr, dailyLimit, salt, resolver) {
        return axios.post(this.url, {
            operation: "createWallet",
            env: this.env,
            config: {
                domain: [name.split(".")[0], name.split(".")[1]],
                owner: ownerAddress,
                rootHash: root_arr,
                merkelHeight: merkleHeight,
                drainAddr: drainAddr,
                dailyLimit: dailyLimit,
                salt: salt,
                feeReceipient: this.refundAddress,
                feeAmount: this.createFee,
                resolver: resolver
            }
        })
    }

    async storeHashes(wallet, hashes) {
        return axios.post(this.url, {
            operation: "storeHash",
            env: this.env,
            data: {
                wallet: wallet,
                hashes: hashes
            }
        })
    }

    async getHashes(address) {
        return axios.post(this.url, {
            operation: "getHash",
            env: this.env,
            address: address
        })
    }    
}

module.exports = RelayerClient;
