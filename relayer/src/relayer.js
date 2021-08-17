require('dotenv').config()
var Transactions = require("./web3/transactions");
var ipfs = require("./ipfs");
const web3utils = require("web3-utils");
const CREATE_FEE = web3utils.toWei("0.00123", "ether");

// accepts createwallet, then forwards to our own relayer
const createWallet = (input, callback) => {
  new Transactions(input.env || "testnet").createWallet(input.config).then(fd=>{
    callback(200, {result: "Success", tx: fd})
  }).catch(ex=>{
    console.log(ex)
    callback(500,ex.message)
  })
}

const getDepositAddress = (input, callback) => {
  new Transactions(input.env || "testnet").getDepositAddress(input.data).then(res => {
    callback(200, {result: res});
  }).catch(ex=>{
    console.log(ex)
    callback(500, ex.message)
  })
};

// be sure not to use the same calling address, circular loop!!!!
const getRefundInfo = (input, callback) => {
  console.log("input here: ", input);
  var tx = new Transactions(input.env || "testnet");
  callback(200, {result: {createFee: CREATE_FEE, refundAddress: tx.defaultAddress}});
};

const submitMetaTx = (input, callback) => {
  new Transactions(input.env || "testnet").submitMetaTx(input.data).then(res=>{
    callback(200, {result: res});
  }).catch(ex=>{
    console.error(ex);
    callback(500,ex.message)
  })
};

const storeHash = (input, callback) => {
  ipfs.storeHash(input.env, input.data.wallet, input.data.hashes).then(res=>{
    callback(200, {result: res});
  }).catch(ex=>{
    console.log(ex);
    callback(500,ex.message)
  })
};

const getHash = (input, callback) => {
  ipfs.getHash(input.env, input.address).then(res=>{
    callback(200, {result: res});
  }).catch(ex=>{
    callback(500, ex.message)
  })
};


const getFactoryInfo = (input, callback) => {
  new Transactions(input.env || "testnet").getFactoryInfo().then(res => {
    callback(200, {result: res});
  }).catch(ex=>{
    console.log(ex)
    callback(500,ex.message)
  })
};

/* 

curl -X POST -H 'Content-Type: application/json' -d '{"id": "", "operation": "createWallet","config": {"owner":"0x05005C6AD9C7Ed696Ed7940Bae811C9a73244E09","rootHash":["0x2f7152cd47bb6da071530d83d36b889afa2f5114cea72b4ef0ab877cb918f8d0","0x28af6af61a6e817f202de8c8dc7ee427efb9dfa6c279bd27932b641e753c6960","0x35692afadd1f5fc6a38615c5b84beee06b0f4e50bc7171983f349f79ef33d61a","0x4a26b28bb9339696fcd38e8580bb44bedd5c317d90f3f7f47dbe2df33b512241","0xb85ddaeacf8fbf5618df8492cc1c28b0b110ead7ab15c3468e2f3f8f00f3f7cc"],"merkelHeight":6,"drainAddr":"0x05005C6AD9C7Ed696Ed7940Bae811C9a73244E09","dailyLimit":"10000000000000000","salt":100}}' "http://localhost:8080/"
curl -X POST -H 'Content-Type: application/json' -d '{"id": "", "env": "testnet3", "operation": "getBalance", "address": "0x57aAd250cF0b02010EcD772a835Ca5FD173158e1"}'  "http://localhost:8989/"
curl -X POST -H 'Content-Type: application/json' -d '{"id": "", "operation": "getDepositAddress", "data": { "owner": "0x57aAd250cF0b02010EcD772a835Ca5FD173158e1", "salt": 123}}'  "http://localhost:8080/"
curl -X POST -H 'Content-Type: application/json' -d '{"id": "", "operation": "checkName","name": "blahblah.crazy.one"}' "http://localhost:8080/"
curl -X POST -H 'Content-Type: application/json' -d '{"id": "", "operation": "checkName","name": "blahblah.crazy.one"}' https://l6oobwso1l.execute-api.us-east-1.amazonaws.com/default/smartvault_relayer

curl -X POST -H 'Content-Type: application/json' -d '{"id": "", "operation": "getHash","address": "0xeAaf2E780CE6A161AD5F22f51cB06060236f1Dc8", "env": "development"}' "http://localhost:8080/"
curl -X POST -H 'Content-Type: application/json' -d '{"operation": "getHash", "env": "mainnet0", "address": "0x1DC1C77c6eAb7725eCBF134DdBb547Dae46B8622"}' https://api.smartvault.one:8443/
curl -X POST -H 'Content-Type: application/json' -d '{"operation": "getHash", "env": "mainnet0", "address": "0x1DC1C77c6eAb7725eCBF134DdBb547Dae46B8622"}' http://localhost:8989/
curl -X POST -H 'Content-Type: application/json' -d '{"operation": "getFactoryInfo", "env": "mainnet0"}' http://localhost:8989/
curl -X POST -H 'Content-Type: application/json' -d '{"operation": "getWallet", "address": "0xfFDe5FA53cA674562a04ea547658dBdB13E0D88f", "env": "mainnet0"}' http://localhost:8989/
*/

const createRequest = (input, callback) => {
    //console.log(input)
    const operation = input.operation
    switch(operation) {
      case "createWallet": createWallet(input, callback); break;
      case "getDepositAddress": getDepositAddress(input, callback); break;
      case "getRefundInfo": getRefundInfo(input, callback); break;
      case "submitMetaTx": submitMetaTx(input, callback); break;
      case "storeHash": storeHash(input, callback); break;
      case "getHash": getHash(input, callback); break;
      case "getWallet": getWallet(input, callback); break;
      case "getFactoryInfo": getFactoryInfo(input, callback); break;
      default: callback(400, "Invalid operation");
    }


}

module.exports.createRequest = createRequest