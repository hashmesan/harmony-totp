const merkle_bytes = require("../../lib/merkle_bytes");
const request = require('request-promise-native');
const Transactions = require('./web3/transactions');
const base64 = require("@ethersproject/base64");

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
            value: Buffer.from(value),
            options: {
                filename: 'smartvault_hashes.bin',
                contentType: 'application/octet-stream'
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
    var res = await request.post({url: url, auth: AUTH, encoding: null});     
    return res;
}

function isValidHashes(roots, hashes) {
    var treeSizeBytes = hashes.length / hashes[0];
    //console.log("tree size=", treeSizeBytes)
    for(var i=0; i < roots.length; i++) {
        var reduced = merkle_bytes.toHex(merkle_bytes.reduceMT(hashes.slice(1+(i*treeSizeBytes), 1+((i+1)* treeSizeBytes))))
        //console.log(reduced, roots[i]);
        if(roots[i] != reduced ) {
            return false;
        }
    }
    return true;
}

async function storeHash(env, wallet, hashesBase64) {
    // get the root hash
    var wallet = await new Transactions(env || "testnet").getWallet(wallet);
    var rootHashes = await wallet.getRootHashes();
    var rawData = base64.decode(hashesBase64);
    // ensure reduction of hashes match with rootHash
    if(!isValidHashes(rootHashes, rawData)) {
        throw "Hashes don't match"
    }

    // upload to IPFS
    var cid = add(rawData);

    // get the CID
    return cid;

    // store it in the smart contract 
}

async function getHash(env, walletAddress) {
    // get the root hash
    var wallet = await new Transactions(env || "testnet").getWallet(walletAddress);
    var hashId = await wallet.getHashStorageId();
    return base64.encode(await cat(hashId));
}

module.exports = {
    add,
    cat,
    getHash,
    storeHash,
    isValidHashes
}