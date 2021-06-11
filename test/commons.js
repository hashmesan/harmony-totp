const TOTPWallet = artifacts.require("TOTPWallet");
const Guardians = artifacts.require("Guardians");
const DailyLimit = artifacts.require("DailyLimit");
const Recovery = artifacts.require("Recovery");
const totp = require("../lib/totp.js");
const merkle = require("../lib/merkle.js");
const ethers = require("ethers");
const ethAbi = require("web3-eth-abi");
const NUMOFTOKENS = 5;

function h16(a) { return web3.utils.soliditySha3({v: a, t: "bytes", encoding: 'hex' }).substring(0, 34); }
function h32(a) { return web3.utils.soliditySha3(a); }
function h16a(a) { return web3.utils.soliditySha3(a).substring(0, 34); }
function padNumber(x) { return web3.utils.padRight(x, 64); }
function getTOTP(counter) { return totp("JBSWY3DPEHPK3PXP", {counter: counter}); }

function getLeavesAndRoot(depth) {
    var leaves = [];
    for ( var i=0; i < Math.pow(2, depth); i++) {
      var token = "";
      for(var j=0;j < NUMOFTOKENS; j++) {
        token = token + getTOTP((i*NUMOFTOKENS)+j);
      }
      //console.log(token);
      leaves.push(h32(padNumber(web3.utils.toHex(token))));
    }
    const root = merkle.reduceMT(leaves);
    return {leaves, root};
}

async function createWallet(owner, depth, drainAddr) {
    const {leaves, root} = getLeavesAndRoot(depth);

    const guardians = await Guardians.new();
    const dailyLimit = await DailyLimit.new();
    const recovery = await Recovery.new();
    await TOTPWallet.link("Guardians", guardians.address);
    await TOTPWallet.link("DailyLimit", dailyLimit.address);
    await TOTPWallet.link("Recovery", recovery.address);
    
    var wallet = await TOTPWallet.new(owner, root, depth, drainAddr, web3.utils.toWei("0.01", "ether"));

    return {
        root,
        leaves,
        wallet
    }
}

async function getTOTPAndProof(counter, leaves) {
    var token = "";
    for(var j=0;j < NUMOFTOKENS; j++) {
      token = token + getTOTP((counter*NUMOFTOKENS)+j);
    }

    var proof = merkle.getProof(leaves, counter, padNumber(web3.utils.toHex(token)))
    return {token, proof};
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
    //console.log(message, sig);
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

async function web3GetClient () {
    return new Promise((resolve, reject) => {
        web3.eth.getNodeInfo((err, res) => {
        if (err !== null) return reject(err);
        return resolve(res);
        });
  })
}

async function increaseTime (seconds) {
    const client = await web3GetClient();
    const p = new Promise((resolve, reject) => {
      if (client.indexOf("TestRPC") === -1) {
        console.warning("Client is not ganache-cli and cannot forward time");
      } else {
        web3.currentProvider.send(
          {
            jsonrpc: "2.0",
            method: "evm_increaseTime",
            params: [seconds],
            id: 0,
          },
          (err) => {
            if (err) {
              return reject(err);
            }
            return web3.currentProvider.send(
              {
                jsonrpc: "2.0",
                method: "evm_mine",
                params: [],
                id: 0,
              },
              (err2, res) => {
                if (err2) {
                  return reject(err2);
                }
                return resolve(res);
              }
            );
          }
        );
      }
    });
    return p;
  }

module.exports = {
    h16,
    h16a,
    padNumber,
    getTOTP,
    createWallet,
    getTOTPAndProof,
    getLeavesAndRoot,
    signRecoveryOffchain,
    increaseTime
}