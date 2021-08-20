
const Web3 = require("web3");
const sha3 = require("web3-utils").sha3;
const utils = require("web3-utils");
const ENS = require("@ensdomains/ensjs").default;
const EthRegistrarSubdomainRegistrar = require("../build/contracts/RegistrarInterface.json");
const IERC20MetaData = require("../build/contracts/IERC20Metadata.json");
const TOTPWallet = require("../build/contracts/TOTPWallet.json");
const { hash } = require("eth-ens-namehash");
const ethers = require("ethers");
const iface = new ethers.utils.Interface(TOTPWallet.abi);
const axios = require("axios");
const RelayerClient = require("./relayer_client");

class HarmonyClient {    
    constructor(url, registry, explorer_url) {
        //console.log(url, registry);
        this.url = url;
        this.registry = registry;
        this.provider = new Web3.providers.HttpProvider(url);
        this.web3 = new Web3(this.provider);
        this.ens = new ENS({ provider: this.provider, ensAddress: registry });
        this.explorer_url = explorer_url;
    }

    async getPublicResolver() {
        return await this.ens.name("resolver.one").getAddress();
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

    getContract(address) {
        const totpWallet = new this.web3.eth.Contract(
            TOTPWallet.abi,
            address
        );
        return totpWallet;
    }
    
    async getSmartVaultInfo(address) {
        const totpWallet = new this.web3.eth.Contract(
            TOTPWallet.abi,
            address
        );
        
        try {
            const guardians = await totpWallet.methods.getGuardians().call();
            const version = await totpWallet.methods.getMasterCopy().call();
            const res = await totpWallet.methods.wallet().call();
            res.guardians = guardians;
            res.masterCopy = version;
            return res;
        } catch(e) {
            if(e.message.startsWith("Returned values aren't valid")) {
                throw Error("Bad smartvault address")
            }
            throw e;
        }
    }

    static decodeSmartVaultFunction(data) {
        if (data.length < 10) {
            throw Error("Not a smart contract call")
        }
        const f = iface.getFunction(data.slice(0,10));    
        const decoded = iface.decodeFunctionData(f.name, data);
        //console.log(decoded);

        if(f.name == "executeMetaTx") {
            return HarmonyClient.decodeSmartVaultFunction(decoded.data);
        }

        return {name: f.name, params: Object.assign({}, decoded)}        
    }

    static decodeReceiptLogs(logs) {
        return logs.map(log=>{
            return iface.parseLog({"data": log.data, "topics": log.topics})
        })

    }

    static isTransactionSuccess(events) {
        return events.find(e=>{
            return e.name == "TransactionExecuted" && e.args.success == true;
        }) != undefined
    }

    async getTransactionDecoded(txHash) {
        var tx = await this.web3.eth.getTransaction(txHash)
        var receipt = await this.web3.eth.getTransactionReceipt(txHash)
        const events = HarmonyClient.decodeReceiptLogs(receipt.logs);

        return Object.assign(tx, {
            function: tx.input.length > 10 && HarmonyClient.decodeSmartVaultFunction(tx.input),
            events:  events,
            status: tx.input.length > 10 ? HarmonyClient.isTransactionSuccess(events) : tx.status,
            returnData: RelayerClient.parseRelayReceipt({ logs: events} )
        })
    }

    async getTransactionsByAccount(account) {
        const res = await axios.get(this.explorer_url+ "/address?id="+(account)+"&pageIndex=0&pageSize=20")
        return Promise.all(res.data.address.shardData[3].txs.map(e=>{
            return this.getTransactionDecoded(e.hash)
        }))
    }

    async getERC20Info(address) {
        const erc20Contract = new this.web3.eth.Contract(
            IERC20MetaData.abi,
            address
        );

        const name = await erc20Contract.methods.name().call();
        const decimals = await erc20Contract.methods.decimals().call();
        const symbol = await erc20Contract.methods.symbol().call();

        return {
            name,
            decimals,
            symbol
        }
    }
}

module.exports = HarmonyClient;