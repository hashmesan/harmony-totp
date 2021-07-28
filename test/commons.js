const TOTPWallet = artifacts.require("TOTPWallet");
const Guardians = artifacts.require("Guardians");
const DailyLimit = artifacts.require("DailyLimit");
const Recovery = artifacts.require("Recovery");
const MetaTx = artifacts.require("MetaTx");
const WalletFactory = artifacts.require("WalletFactory");
const NameRegistry = artifacts.require("NameRegistry");
const NameService = artifacts.require("NameService");

const totp = require("../lib/totp.js");
const walletLib = require("../lib/wallet.js");
const ethers = require("ethers");
const ethAbi = require("web3-eth-abi");
const NUMOFTOKENS = 5;
const secret = "JBSWY3DPEHPK3PXP";

function padNumber(x) { return web3.utils.padRight(x, 64); }
function getTOTP(counter) { return totp(secret, {counter: counter}); }

async function createWalletFactory(resolver) {
  const guardians = await Guardians.new();
  const dailyLimit = await DailyLimit.new();
  const recovery = await Recovery.new();
  const metatx = await MetaTx.new();
  const nameservice = await NameService.new();

  await TOTPWallet.link("Guardians", guardians.address);
  await TOTPWallet.link("DailyLimit", dailyLimit.address);
  await TOTPWallet.link("Recovery", recovery.address);
  await TOTPWallet.link("MetaTx", metatx.address);
  await TOTPWallet.link("NameService", nameservice.address);

  var wallet = await TOTPWallet.new();

  // WalletFactory.link("NameRegistry", registry.address);
  var walletFactory = await WalletFactory.new(wallet.address);
  return walletFactory;
}

async function createNewImplementation(resolver) {
  const guardians = await Guardians.new();
  const dailyLimit = await DailyLimit.new();
  const recovery = await Recovery.new();
  const metatx = await MetaTx.new();
  const nameservice = await NameService.new();

  await TOTPWallet.link("Guardians", guardians.address);
  await TOTPWallet.link("DailyLimit", dailyLimit.address);
  await TOTPWallet.link("Recovery", recovery.address);
  await TOTPWallet.link("MetaTx", metatx.address);
  await TOTPWallet.link("NameService", nameservice.address);

  var wallet = await TOTPWallet.new();
  return wallet;
}

async function walletWithAddress(address) {
  return await TOTPWallet.at(address);
}

async function createWallet(resolver, domain,owner, depth, spendingLimit, drainAddr, feeAddress, feeAmount) {
    const {root_arr, leaves_arr} = walletLib.createHOTP(secret, depth);

    const guardians = await Guardians.new();
    const dailyLimit = await DailyLimit.new();
    const recovery = await Recovery.new();
    const metatx = await MetaTx.new();
    const nameservice = await NameService.new();

    await TOTPWallet.link("Guardians", guardians.address);
    await TOTPWallet.link("DailyLimit", dailyLimit.address);
    await TOTPWallet.link("Recovery", recovery.address);
    await TOTPWallet.link("MetaTx", metatx.address);
    await TOTPWallet.link("NameService", nameservice.address);

    /*
        function initialize(
        address              resolver_,
        string[2]   calldata domain_, // empty means no registration
        address             owner_, 
        bytes32[] calldata    rootHash_, 
        uint8               merkelHeight_, 
        address payable     drainAddr_, 
        uint                dailyLimit_,
        address             feeRecipient,
        uint                feeAmount                
        ) external 
    */

   const encodedRequest = ethAbi.encodeParameters(
    ["address", "string[2]", "address", "bytes32[]", "uint8","address", "uint", "address", "uint"],
    [resolver, ["quoc", "supercrazy"], owner, root_arr, depth, drainAddr, spendingLimit, feeAddress, feeAmount]
  );
    var wallet = await TOTPWallet.new();
    console.log(resolver, domain, owner, root_arr, depth, drainAddr, spendingLimit, feeAddress, feeAmount);
    await wallet.initialize(resolver, 
                            domain, 
                            owner,
                            root_arr,
                            depth,
                            drainAddr,
                            spendingLimit,
                            feeAddress,
                            feeAmount);

    return {
        root_arr,
        leaves_arr,
        wallet
    }
}

async function getTOTPAndProof(offset, counter, leavesSet) {
    var token = [];
    for(var j=0;j < NUMOFTOKENS; j++) {
      token.push(getTOTP((counter*NUMOFTOKENS)+j+offset));
    }
    return walletLib.getProofWithOTP(token, leavesSet);
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
    padNumber,
    getTOTP,
    createWallet,
    getTOTPAndProof,
    signCreateTx,
    increaseTime,
    getMessageHash2,
    signOffchain2,
    getNonceForRelay,
    createWalletFactory,
    walletWithAddress,
    createNewImplementation
}