require('dotenv').config()
var transactions = require("./web3/transactions");

const NETWORK_FEE = 1000;
console.log("NETWORK_ID=", process.env.NETWORK_ID);

// accepts createwallet, then forwards to our own relayer
const createWallet = (input, callback) => {
  console.log("CONFIG=", input.config);

  transactions.submitNewWalletQueue(input.config, NETWORK_FEE, true).then(fd=>{
    callback(200, {result: "Success", forwarder: fd})
  }).catch(ex=>{
    console.log(ex)
    callback(500,{})
  })
}

const getStatus = (input, callback) => {
  transactions.getStatus(input.forwarder).then(res => {
    callback(200, {result: res});
  }).catch(ex=>{
    console.log(ex)
    callback(500,{})
  })
};

const processWallet = (input, callback) => {
  transactions.processWallet(input.forwarder).then(res => {
    callback(200, {result: res});
  }).catch(ex=>{
    console.log(ex)
    callback(500,{})
  })
};
/* 

curl -X POST -H 'Content-Type: application/json' -d '{"id": "", "operation": "create","config": {"owner":"0x05005C6AD9C7Ed696Ed7940Bae811C9a73244E09","rootHash":["0x2f7152cd47bb6da071530d83d36b889afa2f5114cea72b4ef0ab877cb918f8d0","0x28af6af61a6e817f202de8c8dc7ee427efb9dfa6c279bd27932b641e753c6960","0x35692afadd1f5fc6a38615c5b84beee06b0f4e50bc7171983f349f79ef33d61a","0x4a26b28bb9339696fcd38e8580bb44bedd5c317d90f3f7f47dbe2df33b512241","0xb85ddaeacf8fbf5618df8492cc1c28b0b110ead7ab15c3468e2f3f8f00f3f7cc"],"merkelHeight":6,"drainAddr":"0x05005C6AD9C7Ed696Ed7940Bae811C9a73244E09","dailyLimit":"10000000000000000","signature":"0xdf76c504622a99ce2202fe506be2df555be5db4f241aa9a6fd205d47cd9fb68c7ab12aa30e1f8d67775ccc52b5c6155d67d6137731bcb19199cf7b2cdbf3e2ab1c","salt":100}}' "http://localhost:8080/"
curl -X POST -H 'Content-Type: application/json' -d '{"id": "", "operation": "getStatus", "forwarder": "0x57aAd250cF0b02010EcD772a835Ca5FD173158e1"}'  "http://localhost:8080/"
curl -X POST -H 'Content-Type: application/json' -d '{"id": "", "operation": "processWallet", "forwarder": "0x57aAd250cF0b02010EcD772a835Ca5FD173158e1"}'  "http://localhost:8080/"

*/

const createRequest = (input, callback) => {
    console.log(input)
    const operation = input.operation
    switch(operation) {
      case "create": createWallet(input, callback); break;
      case "getStatus": getStatus(input, callback); break;
      case "processWallet": processWallet(input, callback); break;
      default: callback(400, "Invalid operation");
    }


}

module.exports.createRequest = createRequest