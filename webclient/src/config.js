const CONFIG = {
  mainnet0: {
    ENV: "mainnet0",
    API_URL: "https://api.smartvault.one:8443/",
    EXPLORER_URL: "https://explorer-v2-api.hmny.io/v0/shard/0",
    RPC_URL: "https://api.s0.t.hmny.io",
    ENS_ADDRESS: "0x3fa4135B88cE1035Fed373F0801118a3340B37e7",
    gasPrice: 1000000000, // 1 Gwei
    gasLimit: 200000,
  },
  testnet0: {
    ENV: "testnet0",
    //API_URL: "https://api.smartvault.one:8443/",
    API_URL: "https://api.smartvault.one:8443/",
    EXPLORER_URL: "https://h.api.explorer.pops.one/v0/shard/0",
    RPC_URL: "https://api.s0.b.hmny.io",
    ENS_ADDRESS: "0x51766DEF619112F76dF1FD7C361e0C6F47eE19de",
    gasPrice: 1000000000,
    gasLimit: 200000,
  },
  testnet3: {
    ENV: "testnet3",
    API_URL: "https://api.smartvault.one:8443/",
    EXPLORER_URL: "https://explorer.pops.one:8888",
    RPC_URL: "https://api.s3.b.hmny.io",
    ENS_ADDRESS: "0x4fb1C434101ced0773a3bc77D541B3465023639f",
    gasPrice: 1000000000,
    gasLimit: 200000,
  },
  development: {
    ENV: "development",
    API_URL: "http://localhost:8989",
    EXPLORER_URL: "https://explorer.pops.one:8888",
    RPC_URL: "http://localhost:8545", //check vs 7545
    ENS_ADDRESS: "0xD29154f92F4825202768961ca44d1ffE26C11F76",
    gasPrice: 1000000000,
    gasLimit: 200000,
  },
  firebaseConfig: {
    apiKey: "AIzaSyCjZCZDwel6uR8ghVX6ad82I2wyMbCI2YE",
    authDomain: "no-bank.firebaseapp.com",
    projectId: "no-bank",
    storageBucket: "no-bank.appspot.com",
    messagingSenderId: "513156150099",
    appId: "1:513156150099:web:ce6ff84bf06bc6f9eda7a6",
    measurementId: "G-LJD5SCD27K",
  },
};

const DEFAULT_TOKEN_LIST =
  "https://d1xrz6ki9z98vb.cloudfront.net/venomswap/lists/venomswap-default.tokenlist.json";

function getApiUrl(env) {
  return CONFIG[env].API_URL;
}

function getStorageKey(env, pending) {
  if (pending) {
    return "SMARTVAULT." + env + ".pending";
  }
  return "SMARTVAULT." + env;
}

function getLocalWallet(env, pending) {
  return localStorage.getItem(getStorageKey(env, pending));
}

function getExplorerUrl(env) {
  return CONFIG[env].EXPLORER_URL;
}

function setLocalWallet(env, data, pending) {
  var wallet = localStorage.setItem(getStorageKey(env, pending), data);
  return wallet;
}

module.exports = {
  CONFIG,
  getApiUrl,
  getStorageKey,
  getLocalWallet,
  getExplorerUrl,
  setLocalWallet,
  DEFAULT_TOKEN_LIST,
};
//export default CONFIG;
