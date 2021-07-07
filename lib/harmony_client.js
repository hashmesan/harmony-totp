
const Web3 = require("web3");
const sha3 = require("web3-utils").sha3;
const utils = require("web3-utils");
const ENS = require("@ensdomains/ensjs").default;
const EthRegistrarSubdomainRegistrar = require("../build/contracts/RegistrarInterface.json");
const TOTPWallet = require("../build/contracts/TOTPWallet.json");
const { hash } = require("eth-ens-namehash");
const ethers = require("ethers");

class HarmonyClient {    
    constructor(url, registry) {
        //console.log(url, registry);
        this.url = url;
        this.registry = registry;
        this.provider = new Web3.providers.HttpProvider(url);
        this.web3 = new Web3(this.provider);
        this.ens = new ENS({ provider: this.provider, ensAddress: registry });
    }

    /**
     * Check on ENS if name is available 
     * <subdomain>.<domain>.one
     * @param {string} host 
     */
    async isNameAvailable(host, duration) {
        var parts = host.split(".");
        var subdomain = parts[0];
        var domain = parts.slice(1).join(".");

        const found = await this.ens.name(host).getAddress();

        if (found == ethers.constants.AddressZero) {
            const subdomainRegisterAddress = await this.ens.name(domain).getAddress();

            const subdomainRegistrar = new this.web3.eth.Contract(
                EthRegistrarSubdomainRegistrar.abi,
                subdomainRegisterAddress
            );
            
            const rentPrice = await subdomainRegistrar.methods
            .rentPrice(subdomain, duration)
            .call();

            return {address: found, rentPrice: rentPrice};
        }
        
        return {address: found};
    }

    async getBalance(address) {
        const tx = await this.web3.eth.getBalance(address);
        return tx;
    }

    async getSmartVaultInfo(address) {
        const totpWallet = new this.web3.eth.Contract(
            TOTPWallet.abi,
            address
        );
        
        const res = await totpWallet.methods.wallet().call();
        return res;
    }
}

module.exports = HarmonyClient;