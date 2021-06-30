const CONFIG = {
    "mainnet0" : {
        API_URL: "http://localhost:8080",
        EXPLORER_URL: "https://explorer.hmny.io:8888",
        gasPrice: 1000000000 // 1 Gwei
    },
    "testnet0" : {
        API_URL: "https://api.smartvault.one:8443/",
        EXPLORER_URL: "https://explorer.pops.one:8888",
        gasPrice: 1000000000
    },
    "testnet3" : {
        API_URL: "https://api.smartvault.one:8443/",
        EXPLORER_URL: "https://explorer.pops.one:8888",
        gasPrice: 1000000000
    }
};

export function getApiUrl(env) {
    return CONFIG[env].API_URL;
}

export function getStorageKey(env) {
    return "SMARTVAULT." + env;
}

export function getLocalWallet(env) {
    return localStorage.getItem(getStorageKey(env))
}

export function getExplorerUrl(env) {
    return CONFIG[env].EXPLORER_URL;
}

export function setLocalWallet(env, data) {
    return localStorage.setItem(getStorageKey(env), data)
}

export default CONFIG;