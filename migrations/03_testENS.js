const EnsResolver = artifacts.require("EnsResolver");
const namehash = require('eth-ens-namehash');
const walletutils = require("../lib/wallet");
const RegistrarInterface = artifacts.require("RegistrarInterface");
const WalletFactory = artifacts.require("WalletFactory");
const TOTPWallet = artifacts.require("TOTPWallet");
const sha3 = require('web3-utils').sha3;
const utils = require('web3-utils');
const sleep = (sec) => new Promise(resolve => setTimeout(resolve, 1000 * sec))
// const ENS = require('@ensdomains/ens/build/contracts/ENS.json');
// const ENS = artifacts.require("@ensdomains/ens/ENSRegistry");

module.exports = async function(deployer, network, accounts) {
    // const ens = await ENS.at("0x23ca23b6f2C40BF71fe4Da7C5d6396EE2C018e6A")
    // console.log(await ens.resolver(namehash.hash("crazy.one")));


    // const blockNumber = await web3.eth.getBlockNumber();
    // console.log("Deploying on ", network, "block=", blockNumber);
    // var addresses = {
    //     development: {
    //         resolver: "0xd09fD54DD8A3A7d02676a1813CDf0d720E6Dbe89",
    //     },
    //     harmonytestnet: {
    //         resolver: "0x335b5b3b0Acdf3aFabA00F71a3c7090e73990818"
    //     },
    //     harmonymainnet: {
    //         resolver: "0x48D421c223E32B68a8973ef05e1314C97BBbc4bE"
    //     }
    // }
    // const resolver = await EnsResolver.at(addresses[network].resolver);
    // const subdomainAddr = await resolver.addr(namehash.hash('crazy.one'))
    // console.log("name hash: ", namehash.hash('crazy.one'));
    // console.log('Resolver crazy.one: ', subdomainAddr);

    // /*


    // const subdomainRegistrar = await RegistrarInterface.at(addresses[network].subdomainRegistrar);
    // const domainInfo = await subdomainRegistrar.query(sha3(domain), '');
    // console.log(domainInfo[0]);
    // console.log(utils.toBN(domainInfo[1]).toString());
    // console.log(domainInfo[2].toNumber());
    // console.log(domainInfo[3]);

    // const subdomain = "mamamia" + blockNumber;
    // const rentPriceSub = await subdomainRegistrar.rentPrice(subdomain, duration);
    // console.log('rentPrice: ', Number(rentPriceSub) / 1e18);    

    // const tx = await subdomainRegistrar.register(sha3(domain), subdomain, accounts[1], duration, '', resolver.address, {
    //     from: accounts[1],
    //     value: utils.toBN(rentPriceSub)
    // });    

    // console.log(await resolver.addr(namehash.hash(subdomain + '.crazy.one')), accounts[1]);
    // */

    // const domain = 'crazy';
    // const duration = 60 * 60 * 24 * 365; // 1 year
    // const subdomain = "sueprcrazylongcheap" + blockNumber;
    // var factory = await WalletFactory.at(WalletFactory.address);
    // var smartWallet = await factory.computeWalletAddress(accounts[0], blockNumber);
    // await web3.eth.sendTransaction({from: accounts[0], to: smartWallet, value: web3.utils.toWei("1.5", "ether")});
    // console.log("Computed wallet=", smartWallet, await web3.eth.getBalance(smartWallet));
    // console.log("Duration=", duration);

    // var mywallet = walletutils.createHOTP("BIGSECRET", 4);

    // // namehash should be = 0x8ada342410322a1cc38cc04ac516581740996bacbf88d2a55e0064133ecca850
    // var wallet = await factory.createWallet({
    //     resolver: addresses[network].resolver,
    //     domain: [subdomain, "crazy"],
    //     owner: accounts[0],
    //     rootHash: mywallet.root_arr,
    //     merkelHeight: 0,
    //     drainAddr: accounts[0],
    //     dailyLimit: utils.toWei("1.0"),
    //     salt: blockNumber,
    //     feeReceipient: accounts[0],
    //     feeAmount: utils.toWei("0")
    // }, {from: accounts[0], gas: 712388});

    // //console.log(wallet);
    // var w = await TOTPWallet.at(smartWallet);
    // //console.log(await w.wallet())

    // // CALLING MANUALLY FOR TESTING
    // // console.log(await w.registerENS(subdomain, "crazy", duration))
    // // const subdomainRegistrar = await RegistrarInterface.at(subdomainAddr);
    // // const rentPriceSub = await subdomainRegistrar.rentPrice(subdomain, duration);
    // // console.log("Call it");
    // // const tx = await subdomainRegistrar.register(sha3(domain), subdomain, smartWallet, duration, '', resolver.address, {
    // //     from: accounts[0],
    // //     value: utils.toBN(rentPriceSub)
    // // });    
    // //await sleep(5);

    // console.log("RESOLVED?", await resolver.addr(namehash.hash(subdomain + '.crazy.one')), smartWallet);
    // console.log("BALANCE (AFTER)=", smartWallet, await web3.eth.getBalance(smartWallet));

};