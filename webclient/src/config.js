const CONFIG = {
    "mainnet0" : {
        API_URL: "http://localhost:8080/",
        gasPrice: 1000000000 // 1 Gwei
    },
    "testnet0" : {
        API_URL: "http://localhost:8080/",
        gasPrice: 1000000000
    },
    "testnet3" : {
        API_URL: "http://localhost:8080/",
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

export function setLocalWallet(env, data) {
    return localStorage.setItem(getStorageKey(env), data)
}

export default CONFIG;