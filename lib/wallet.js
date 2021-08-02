var merkle = require("./merkle_bytes.js");
var merkleHex = require("./merkle_hex.js");
const totp = require("./totp.js");
const ethers = require("ethers");
const ethAbi = require("web3-eth-abi");
const web3utils = require("web3-utils");
const { Keccak } = require('sha3');

function normalize(a) { return new web3utils.BN(a).toArrayLike(Buffer,"le", 32) }
function toHex(a) { return web3utils.toHex(Buffer.from(a)) }
function h32(a) { return new Keccak(256).update(new web3utils.BN(a).toArrayLike(Buffer,"le", 32)).digest(); }
function padNumber(x) { return web3utils.padRight(x, 64); }
function getTOTP(secret, counter, duration) { return totp(secret, {period: duration, counter: counter}); }
const NUMOFTOKENS = 5;

function generateWallet(secret, depth, duration, timeOffset, fProgress) {
    var leafs = [];
    console.log("!!", secret, depth, duration, timeOffset)
    var startCounter =  timeOffset / duration;
    console.log("Start counter=", startCounter);
    var percentMark = Math.floor(Math.pow(2, depth) / 50);

    for ( var i=0; i < Math.pow(2, depth); i++) {
        leafs.push(h16(padNumber(web3utils.toHex(getTOTP(secret, startCounter+i, duration)))));
        //console.log(i, getTOTP(secret, startCounter+i, duration), leafs[leafs.length-1])
        if (i%percentMark== 0 && fProgress) {
            fProgress(i, Math.pow(2, depth));
        }
    }

    const root = merkle.reduceMT(leafs);
    console.log("root="+ root);

    return {
        leafs: leafs,
        root: root
    }
}

function getLeavesAndRoot(secret, offset, depth) {
    const leaves = new Uint8Array(new ArrayBuffer(Math.pow(2, depth) * 32))
    //console.log(secret, offset, depth, leaves)

    for ( var i=0; i < Math.pow(2, depth); i++) {
      var token = "";
      for(var j=0;j < NUMOFTOKENS; j++) {
        token = token + getTOTP(secret, (i*NUMOFTOKENS)+j+offset);
      }
      //console.log(token);
      leaves.set(h32(token), i*32);
    }
    //console.log(secret, offset, depth);

    const root = toHex(merkle.reduceMT(leaves));
    return {leaves, root};
}


function byteArrayIsSame(a, b) {
  return a.every((e, index)=>{
    return e==b[index]
  })
}
/**
 * 
 * @param {*} hash 
 * @param {*} leavesSet 
 * @returns 
 */
function findInLeavesSet(hash, leavesSet) {
  var numOfNodes = ((leavesSet.length - 1)/32) / leavesSet[0];
  //console.log("total nodes", numOfNodes, "size=",leavesSet[0])
  const size = leavesSet[0];

  for(var j=0;j<numOfNodes; j++) {
    for(var i=0;i<size;i++){ // first byte is size
      const start = 1+(i*numOfNodes*32)+(j*32);
      //(j==0) && console.log( start, leavesSet.slice(start, start+32))
      if(byteArrayIsSame(hash, leavesSet.slice(start, start+32))) {
        return { leaves: leavesSet.slice(1+(i*numOfNodes*32), 1+((i+1)*numOfNodes*32)), counter: j , index: i};
      }
    }
  }
  return {leaves: null, counter: 0, index: -1};
}

function getProofWithOTP(currentOTPS, leavesSet) {  
  var token = currentOTPS.join("");

  //console.log("getProof for ", token, toHex(h32(token)));
  var {leaves, counter, index} = findInLeavesSet(h32(token), leavesSet);
  //console.log("Found in counter=", counter, "index=", index);

  if(leaves == null) {
    throw "Cannot build proof: Token cannot be found"
  }
  var proof = merkle.getProof(leaves, counter, normalize(token))
  return {token, proof, counter, index};
}

function verifyProof(proof, rootHash) {
  var proofCopy = proof.clone();
  proofCopy[0] = web3utils.soliditySha3({ t: 'bytes32', v: proofCopy[0], encoding: 'hex'})
  var reduced = merkleHex.reduceAuthPath(proofCopy);
  //console.log(reduced, rootHash);
  return rootHash.includes(reduced);
}

/**
 * leavesBuffer format: [byte0-size][data]
 * 
 * @param {*} secret 
 * @param {*} depth 
 * @param {*} progress 
 */
function createHOTP(secret, depth, progress) {
    var root_arr = [];
    const leaves_arr = new Uint8Array(new ArrayBuffer(1 + Math.pow(2, depth) *5 * 32))
    leaves_arr[0] = NUMOFTOKENS;
    
    for(var i=0; i < NUMOFTOKENS; i++) {
      const {leaves, root} = getLeavesAndRoot(secret, i, depth);
      //console.log(i, leaves.length);
      leaves_arr.set(leaves, 1+(leaves.length*i))
      root_arr.push(root);
      
      progress && progress(i/5.);
    }
    progress && progress(1.0);
    return {root_arr, leaves_arr};
  }
  
async function signRecoveryOffchain(signers, rootHash, merkelHeight, timePeriod, timeOffset) {
    const messageHash = getMessageHash(rootHash, merkelHeight, timePeriod, timeOffset);
    const signatures = await Promise.all(
      signers.map(async (signer) => {
        const sig = await signMessage(messageHash, signer);
        return sig.slice(2);
      })
    );
    const joinedSignatures = `0x${signatures.join("")}`;
    //console.log("sigs", joinedSignatures);

    return joinedSignatures;
  }

function getMessageHash(rootHash, merkelHeight, timePeriod, timeOffset) {
    const TYPE_STR = "startRecovery(bytes16, uint8, uint, uint)";
    const TYPE_HASH = ethers.utils.keccak256(Buffer.from(TYPE_STR));

    //console.log(rootHash, merkelHeight, timePeriod, timeOffset, TYPE_HASH);

    const encodedRequest = ethAbi.encodeParameters(
        ["bytes32", "bytes16", "uint8", "uint", "uint"],
        [TYPE_HASH, rootHash, merkelHeight, timePeriod, timeOffset]
      );

    const messageHash = ethers.utils.keccak256(encodedRequest);
    return messageHash;
}

async function signMessage(message, signer) {
  const sig = await signer.sign(message).signature;
  let v = parseInt(sig.substring(130, 132), 16);
  if (v < 27) v += 27;
  const normalizedSig = `${sig.substring(0, 130)}${v.toString(16)}`;
  return normalizedSig;
}

function sortWalletByAddress(wallets) {
    return wallets.sort((s1, s2) => {
        const bn1 = ethers.BigNumber.from(s1);
        const bn2 = ethers.BigNumber.from(s2);
        if (bn1.lt(bn2)) return -1;
        if (bn1.gt(bn2)) return 1;
        return 0;
    })
}


async function signCreateTx(signers,owner, rootHash, merkleHeight, drainAddr, dailyLimit, salt ) {
  const messageHash = getCreateHash(owner, rootHash, merkleHeight, drainAddr, dailyLimit, salt);
  const signatures = await Promise.all(
    signers.map(async (signer) => {
      const sig = await signMessage(messageHash, signer);
      //console.log(signer.address, sig);
      return sig.slice(2);
    })
  );
  const joinedSignatures = `0x${signatures.join("")}`;
  //console.log("sigs", joinedSignatures);

  return joinedSignatures;
}

async function signOffchain2(signers, from, value, data, chainId, nonce, gasPrice, gasLimit, refundToken, refundAddress) {
  const messageHash = getMessageHash2(from, value, data, chainId, nonce, gasPrice, gasLimit, refundToken, refundAddress);
  const signatures = await Promise.all(
    signers.map(async (signer) => {
      const sig = await signMessage(messageHash, signer);
      return sig.slice(2);
    })
  );
  const joinedSignatures = `0x${signatures.join("")}`;

  return joinedSignatures;
}

async function getNonceForRelay() {
  const block = 0;//await web3.eth.getBlockNumber();
  const timestamp = new Date().getTime();
  return `0x${ethers.utils.hexZeroPad(ethers.utils.hexlify(block), 16)
    .slice(2)}${ethers.utils.hexZeroPad(ethers.utils.hexlify(timestamp), 16).slice(2)}`;
}

function getMessageHash2(from, value, data, chainId, nonce, gasPrice, gasLimit, refundToken, refundAddress) {
  //console.log(from, value, data, chainId, nonce, gasPrice, gasLimit, refundToken, refundAddress)

  const message = `0x${[
    "0x19",
    "0x00",
    from,
    ethers.utils.hexZeroPad(ethers.utils.hexlify(value), 32),
    data,
    ethers.utils.hexZeroPad(ethers.utils.hexlify(chainId), 32),
    nonce,
    ethers.utils.hexZeroPad(ethers.utils.hexlify(gasPrice), 32),
    ethers.utils.hexZeroPad(ethers.utils.hexlify(gasLimit), 32),
    refundToken,
    refundAddress,
  ].map((hex) => hex.slice(2)).join("")}`;

  const messageHash = ethers.utils.keccak256(message);
  return messageHash;
}

module.exports = {
    byteArrayIsSame,
    createHOTP,
    getTOTP,
    getLeavesAndRoot,
    generateWallet,
    getProofWithOTP,
    signRecoveryOffchain,
    getNonceForRelay,
    signOffchain2,
    verifyProof
}