const CONFIG = {
    "mainnet0" : {
        ENV: "mainnet0",
        API_URL: "https://api.smartvault.one:8443/",
        EXPLORER_URL: "https://explorer.hmny.io:8888",
        RPC_URL: "https://api.s0.t.hmny.io",
        ENS_ADDRESS: "0x3fa4135B88cE1035Fed373F0801118a3340B37e7",
        gasPrice: 1000000000, // 1 Gwei
        gasLimit: 200000
    },
    "testnet0" : {
        ENV: "testnet0",
        API_URL: "https://api.smartvault.one:8443/",
        EXPLORER_URL: "https://explorer.pops.one:8888",
        RPC_URL: "https://api.s0.b.hmny.io",
        gasPrice: 1000000000,
        gasLimit: 200000
    },
    "testnet3" : {
        ENV: "testnet3",
        API_URL: "https://api.smartvault.one:8443/",
        EXPLORER_URL: "https://explorer.pops.one:8888",
        RPC_URL: "https://api.s3.b.hmny.io",
        ENS_ADDRESS: "0x4fb1C434101ced0773a3bc77D541B3465023639f",
        gasPrice: 1000000000,
        gasLimit: 200000
    },
    "development" : {
        ENV: "development",
        API_URL: "http://localhost:8989",
        EXPLORER_URL: "https://explorer.pops.one:8888",
        RPC_URL: "http://localhost:8545",
        ENS_ADDRESS: "0xD29154f92F4825202768961ca44d1ffE26C11F76",
        gasPrice: 1000000000,
        gasLimit: 200000
    }    
};

function getApiUrl(env) {
    return CONFIG[env].API_URL;
}

function getStorageKey(env, pending) {
    if(pending) {
        return "SMARTVAULT." + env + ".pending";
    }
    return "SMARTVAULT." + env;
}

function getLocalWallet(env, pending) {
    return localStorage.getItem(getStorageKey(env, pending))
}

function getExplorerUrl(env) {
    return CONFIG[env].EXPLORER_URL;
}

function setLocalWallet(env, data, pending) {
    var wallet = localStorage.setItem(getStorageKey(env, pending), data)
    return wallet;
}

module.exports = {
    CONFIG,
    getApiUrl,
    getStorageKey,
    getLocalWallet,
    getExplorerUrl,
    setLocalWallet
}
//export default CONFIG;