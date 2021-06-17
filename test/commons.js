const TOTPWallet = artifacts.require("TOTPWallet");
const Guardians = artifacts.require("Guardians");
const DailyLimit = artifacts.require("DailyLimit");
const Recovery = artifacts.require("Recovery");
const MetaTx = artifacts.require("MetaTx");
const WalletFactory = artifacts.require("WalletFactory");

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

function getLeavesAndRoot(offset, depth) {
    var leaves = [];
    for ( var i=0; i < Math.pow(2, depth); i++) {
      var token = "";
      for(var j=0;j < NUMOFTOKENS; j++) {
        token = token + getTOTP((i*NUMOFTOKENS)+j+offset);
      }
      //console.log(token);
      leaves.push(h32(padNumber(web3.utils.toHex(token))));
    }
    const root = merkle.reduceMT(leaves);
    return {leaves, root};
}

async function createWalletFactory() {
  const guardians = await Guardians.new();
  const dailyLimit = await DailyLimit.new();
  const recovery = await Recovery.new();
  const metatx = await MetaTx.new();

  await TOTPWallet.link("Guardians", guardians.address);
  await TOTPWallet.link("DailyLimit", dailyLimit.address);
  await TOTPWallet.link("Recovery", recovery.address);
  await TOTPWallet.link("MetaTx", metatx.address);

  var wallet = await TOTPWallet.new();

  var walletFactory = await WalletFactory.new(wallet.address);
  return walletFactory;
}

async function createNewImplementation() {
  const guardians = await Guardians.new();
  const dailyLimit = await DailyLimit.new();
  const recovery = await Recovery.new();
  const metatx = await MetaTx.new();

  await TOTPWallet.link("Guardians", guardians.address);
  await TOTPWallet.link("DailyLimit", dailyLimit.address);
  await TOTPWallet.link("Recovery", recovery.address);
  await TOTPWallet.link("MetaTx", metatx.address);

  var wallet = await TOTPWallet.new();
  return wallet;
}

function createHOTP(depth) {
  var leaves_arr = [], root_arr = [];
  for(var i=0; i < 5; i++) {
    const {leaves, root} = getLeavesAndRoot(i, depth);
    leaves_arr.push(leaves);
    root_arr.push(root);
  }
  return {root_arr, leaves_arr};
}

async function walletWithAddress(address) {
  return await TOTPWallet.at(address);
}

async function createWallet(owner, depth, drainAddr) {
    const {root_arr, leaves_arr} = createHOTP(depth);

    const guardians = await Guardians.new();
    const dailyLimit = await DailyLimit.new();
    const recovery = await Recovery.new();
    const metatx = await MetaTx.new();

    await TOTPWallet.link("Guardians", guardians.address);
    await TOTPWallet.link("DailyLimit", dailyLimit.address);
    await TOTPWallet.link("Recovery", recovery.address);
    await TOTPWallet.link("MetaTx", metatx.address);

    var wallet = await TOTPWallet.new();
    await wallet.initialize(owner, root_arr, depth, drainAddr, web3.utils.toWei("0.01", "ether"));

    return {
        root_arr,
        leaves_arr,
        wallet
    }
}

function findInLeavesSet(hash, leavesSet) {
  for(var i=0;i<leavesSet.length;i++){
    for(var j=0;j<leavesSet[i].length; j++) {
      if(hash==leavesSet[i][j]) {
        return leavesSet[i];
      }
    }
  }
  return null;
}

async function getTOTPAndProof(offset, counter, leavesSet) {
    var token = "";
    for(var j=0;j < NUMOFTOKENS; j++) {
      token = token + getTOTP((counter*NUMOFTOKENS)+j+offset);
    }

    var leaves = findInLeavesSet(h32(padNumber(web3.utils.toHex(token))), leavesSet);
    if(leaves == null) {
      throw Exception("Hash not found in leaves")
    }
    var proof = merkle.getProof(leaves, counter, padNumber(web3.utils.toHex(token)))
    return {token, proof};
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
    const block = await web3.eth.getBlockNumber();
    const timestamp = new Date().getTime();
    return `0x${ethers.utils.hexZeroPad(ethers.utils.hexlify(block), 16)
      .slice(2)}${ethers.utils.hexZeroPad(ethers.utils.hexlify(timestamp), 16).slice(2)}`;
  }

function getMessageHash2(from, value, data, chainId, nonce, gasPrice, gasLimit, refundToken, refundAddress) {
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

function getCreateHash(owner, rootHash, merkleHeight, drainAddr, dailyLimit, salt) {
    const TYPE_STR = "createWallet(address owner, bytes32[] rootHash, uint8 merkelHeight, address payable drainAddr, uint dailyLimit,uint256 salt)";
    const TYPE_HASH = ethers.utils.keccak256(Buffer.from(TYPE_STR));

    const encodedRequest = ethAbi.encodeParameters(
        ["bytes32", "address", "bytes32[]", "uint8", "address","uint", "uint256"],
        [TYPE_HASH, owner, rootHash, merkleHeight, drainAddr, dailyLimit, salt]
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
    signCreateTx,
    increaseTime,
    getMessageHash2,
    signOffchain2,
    getNonceForRelay,
    createWalletFactory,
    createHOTP,
    walletWithAddress,
    createNewImplementation
}