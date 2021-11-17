
const Web3 = require("web3");
const sha3 = require("web3-utils").sha3;
const utils = require("web3-utils");
const ENS = require("@ensdomains/ensjs").default;
const EthRegistrarSubdomainRegistrar = require("../build/contracts/RegistrarInterface.json");
const IERC20 = require("../build/contracts/IERC20.json");
const IERC20MetaData = require("../build/contracts/IERC20Metadata.json");
const { hash } = require("eth-ens-namehash");
const ethers = require("ethers");
const IUniswap = require("../build/contracts/IUniswapRouter.json");
const TOTPWallet = require("../build/contracts/TOTPWallet.json");
const TOTPWalletV2 = require("./archive/TOTPWallet_2.json");
const WalletFactory = require("../build/contracts/WalletFactory.json");
const axios = require("axios");
const RelayerClient = require("./relayer_client");
const {
    toBech32,
    fromBech32,
  } = require('@harmony-js/crypto');
const ifaces = [
    new ethers.utils.Interface(TOTPWallet.abi),
    new ethers.utils.Interface(IERC20.abi),
    new ethers.utils.Interface(IUniswap.abi),
    new ethers.utils.Interface(WalletFactory.abi),
    new ethers.utils.Interface([
        "event Transfer(address,address,uint256)",
        "function startRecoverCommit(bytes32 secretHash)"
    ])
]

class HarmonyClient {    
    constructor(url, registry) {
        //console.log(url, registry);
        this.url = url;
        this.registry = registry;
        this.provider = new Web3.providers.HttpProvider(url);
        this.web3 = new Web3(this.provider);
        this.ens = new ENS({ provider: this.provider, ensAddress: registry });
    }

    async getNetworkId() {
        return this.web3.eth.net.getId();
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
    
    async getSmartVaultInfo(address, abi) {
        const totpWallet = new this.web3.eth.Contract(
            abi || TOTPWallet.abi,
            address
        );
        
        try {
            var codeVersion = 0;
            try {
                var codeVersion = await totpWallet.methods.version().call(); 
                codeVersion = parseInt(codeVersion);             
            } catch(e) {
                console.log("Can't get version", e.message)
                // when contract dont' have version() constant
            }
            if(codeVersion <= 2 && !abi) {
                return await this.getSmartVaultInfo(address, TOTPWalletV2.abi);
            }

            const res = await totpWallet.methods.wallet().call();
            const guardians = await totpWallet.methods.getGuardians().call();
            const version = await totpWallet.methods.getMasterCopy().call();
            res.guardians = guardians;
            res.masterCopy = version;
            res.codeVersion = codeVersion;
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
            return {name: "Transfer"}
        }
        
        var decoded = null;
        var f = null;
        for(var iface of ifaces) {
            try {
                f = iface.getFunction(data.slice(0,10));    
                decoded = iface.decodeFunctionData(f.name, data);
                //console.log(decoded);        
            } catch(e) {}
        }

        if (f != null) {
            if(f.name == "executeMetaTx") {
                return HarmonyClient.decodeSmartVaultFunction(decoded.data);
            }
            if(f.name == "multiCall") {
                //console.log("Data?", f.name, decoded, decoded._transactions[0].data)
                return decoded._transactions.map(tx=>{return {...tx, ...HarmonyClient.decodeSmartVaultFunction(tx.data)}});
            }
            return {name: f.name, params: decoded}  
        } else {
            console.log("unrecognized", data);
            return {name: "", params: {}}
        }
    }

    static decodeReceiptLogs(logs) {
        return logs.map(log=>{
            for(var iface of ifaces) {
                try {
                    return iface.parseLog({"data": log.data, "topics": log.topics})
                } catch(e) {
                }
            }
            return null;
        }).filter(e=> e!=null)

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
        const foundExecuted = events.filter(e=>(e.name === "TransactionExecuted" || e.event === "TransactionExecuted")).length > 0;
        return Object.assign(tx, {
            function: HarmonyClient.decodeSmartVaultFunction(tx.input),
            events:  events,
            logs: receipt.logs,
            status: tx.input.length > 10 && events != "0x" ? HarmonyClient.isTransactionSuccess(events) : receipt.status,
            returnData: foundExecuted ? RelayerClient.parseRelayReceipt({ logs: events} ) : {success: receipt.status}
        })
    }

    //curl -H "Content-Type:application/json" -X GET "https://api.s0.b.hmny.io/address?id=one18d47sulz9ty4kysc4vrj8edpsk3nnmeddsvlvc"          

    async getTransactionsByAccount(account,  pageSize) {
        pageSize = pageSize || 10
        const configHeaders = {
            "Content-Type": "application/json",
            "Accept": "application/json"
          };
        const data = {
            "jsonrpc": "2.0",
            "method": "hmyv2_getTransactionsHistory",
            "params": [{
                "address": toBech32(account),
                "pageIndex": 0,
                "pageSize": pageSize,
                "fullTx": true,
                "txType": "ALL",
                "order": "DESC"
            }],
            "id": 1
        }
        const url = this.url;
        const res = await axios({url: url, method: "POST", headers: configHeaders, data:data})
        return Promise.all(res.data.result.transactions.map(e=>{
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

    async getErc20Balance(addresses, account) {
        var balances = addresses.map(address=>{
            const erc20Contract = new this.web3.eth.Contract(
                IERC20.abi,
                address
            );
            return erc20Contract.methods.balanceOf(account).call();
        })
        return await Promise.all(balances);
    }
}

module.exports = HarmonyClient;