
const wallet = require("../../lib/wallet");
const ethers = require("ethers");
const web3utils = require("web3-utils");
const TOTPWalletArtifact = require('../../build/contracts/TOTPWallet.json');
var Contract = require('web3-eth-contract');
var contract = new Contract(TOTPWalletArtifact.abi)

class Transactions {
    constructor(env, chainId) {
        this.env = env;
        this.chainId = chainId;
    }

    async setHashStorageId(from, id, gasPrice, gasLimit, ownerAccount) {
        const methodData = contract.methods.setHashStorageId(id).encodeABI();
        return this.submitMetaTx(from, methodData, gasPrice, gasLimit, [ownerAccount]);
    }

    async submitMetaTx(from, methodData, gasPrice, gasLimit, signers) {
        var nonce = await wallet.getNonceForRelay();
        var sigs = await wallet.signOffchain2(
            signers,
            from,
            0,
            methodData,
            this.chainId, // support pre-audit code
            nonce,
            gasPrice,
            gasLimit,
            ethers.constants.AddressZero,
            ethers.constants.AddressZero
        );    

        return {
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
                refundAddress: ethers.constants.AddressZero
            }
        };
    }
}

module.exports = Transactions;