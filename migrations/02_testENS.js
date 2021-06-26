const EnsResolver = artifacts.require("EnsResolver");
const namehash = require('eth-ens-namehash');

const RegistrarInterface = artifacts.require("RegistrarInterface");
const WalletFactory = artifacts.require("WalletFactory");
const sha3 = require('web3-utils').sha3;
const utils = require('web3-utils');

module.exports = async function(deployer, network, accounts) {
    const blockNumber = await web3.eth.getBlockNumber();
    console.log("Deploying on ", network, "block=", blockNumber);
    var addresses = {
        development: {
            resolver: "0xd09fD54DD8A3A7d02676a1813CDf0d720E6Dbe89",
        },
        testnet: {
            subdomainRegistrar: "0x3ea76B43f86f8E8Fa910120966a699A2dC45e854"
        }
    }
    const resolver = await EnsResolver.at(addresses[network].resolver);
    console.log("name hash: ", namehash.hash('crazy.one'));
    console.log('Resolver crazy.one: ', await resolver.addr(namehash.hash('crazy.one')));

    /*


    const domain = 'crazy';
    const subdomainRegistrar = await RegistrarInterface.at(addresses[network].subdomainRegistrar);
    const domainInfo = await subdomainRegistrar.query(sha3(domain), '');
    console.log(domainInfo[0]);
    console.log(utils.toBN(domainInfo[1]).toString());
    console.log(domainInfo[2].toNumber());
    console.log(domainInfo[3]);

    const subdomain = "mamamia" + blockNumber;
    const rentPriceSub = await subdomainRegistrar.rentPrice(subdomain, duration);
    console.log('rentPrice: ', Number(rentPriceSub) / 1e18);    

    const tx = await subdomainRegistrar.register(sha3(domain), subdomain, accounts[1], duration, '', resolver.address, {
        from: accounts[1],
        value: utils.toBN(rentPriceSub)
    });    

    console.log(await resolver.addr(namehash.hash(subdomain + '.crazy.one')), accounts[1]);
    */

    const duration = 60 * 60 * 24 * 365; // 1 year
    const subdomain = "sueprcrazylongcheapname00001" + blockNumber;
    var factory = await WalletFactory.at(WalletFactory.address);
    var smartWallet = await factory.computeWalletAddress(accounts[0], blockNumber);
    await web3.eth.sendTransaction({from: accounts[0], to: smartWallet, value: web3.utils.toWei("1.5", "ether")});
    console.log("Computed wallet=", smartWallet, await web3.eth.getBalance(smartWallet));


    // namehash should be = 0x8ada342410322a1cc38cc04ac516581740996bacbf88d2a55e0064133ecca850
    var wallet = await factory.createWallet({
        resolver: addresses[network].resolver,
        domain: [subdomain, "crazy"],
        owner: accounts[0],
        rootHash: [],
        merkelHeight: 0,
        drainAddr: accounts[0],
        dailyLimit: utils.toWei("1.0"),
        salt: blockNumber,
        feeReceipient: accounts[0],
        feeAmount: utils.toWei("0")
    });

    console.log(wallet.tx);
    console.log("RESOLVED?", await resolver.addr(namehash.hash(subdomain + '.crazy.one')), accounts[0]);
    console.log("BALANCE (AFTER)=", smartWallet, await web3.eth.getBalance(smartWallet));
};