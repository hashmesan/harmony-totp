const merkle = require("../../lib/merkle");
const request = require('request-promise-native');
const Transactions = require('./web3/transactions');

const IPFS_URL="https://ipfs.infura.io:5001/api/v0"
const AUTH={user: process.env.IPFS_ID, pass: process.env.IPFS_SECRET}
/*
curl -X POST -F file=@myfile \
-u "PROJECT_ID:PROJECT_SECRET" \
"https://ipfs.infura.io:5001/api/v0/add"

> {
      "Name":"ipfs_file_docs_getting_started_demo.txt",
      "Hash":"QmeGAVddnBSnKc1DLE7DLV9uuTqo5F7QbaveTjr45JUdQn",
      "Size":"44"
  }
*/
async function add(value) {
    var res = await request.post({url: IPFS_URL + "/add", formData: {
        hash_file: {
            value: value,
            options: {
                filename: 'smartvault_hashes.txt',
                contentType: 'text/plain'
            }
        }
    }, json: true, auth: AUTH}); 
    
    return res;
}

//curl -X POST -u "PROJECT_ID:PROJECT_SECRET" \
"https://ipfs.infura.io:5001/api/v0/cat?arg=QmeGAVddnBSnKc1DLE7DLV9uuTqo5F7QbaveTjr45JUdQn"

async function cat(id) {
    const url = IPFS_URL + "/cat?arg=" + id;
    //console.log(url);
    var res = await request.post({url: url, json: true, auth: AUTH});     
    return res;
}

function isValidHashes(roots, hashes) {
    for(var i=0; i < roots.length; i++) {
        if(roots[i] != merkle.reduceMT(hashes[i])) {
            return false;
        }
    }
    return true;
}

async function storeHash(env, wallet, hashes) {
    // get the root hash
    var wallet = await new Transactions(env || "testnet").getWallet(wallet);
    var rootHashes = await wallet.getRootHashes();

    // ensure reduction of hashes match with rootHash
    if(!isValidHashes(rootHashes, hashes)) {
        throw "Hashes don't match"
    }

    // upload to IPFS
    var cid = add(JSON.stringify(hashes));

    // get the CID
    return cid;

    // store it in the smart contract 
}

async function getHash(env, walletAddress) {
    // get the root hash
    var wallet = await new Transactions(env || "testnet").getWallet(walletAddress);
    var hashId = await wallet.getHashStorageId();
    return await cat(hashId);
}

module.exports = {
    add,
    cat,
    getHash,
    storeHash,
    isValidHashes
}