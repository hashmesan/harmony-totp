const TOTPWallet = artifacts.require("TOTPWallet");
const Guardians = artifacts.require("Guardians");
const DailyLimit = artifacts.require("DailyLimit");
const Recovery = artifacts.require("Recovery");
const MetaTx = artifacts.require("MetaTx");
const WalletFactory = artifacts.require("WalletFactory");
const Relayer = artifacts.require("Relayer");
const NameRegistry = artifacts.require("NameRegistry");
const NameService = artifacts.require("NameService");

const fs = require('fs');

function appendJSON(filename, key, value) {
    let rawdata = fs.readFileSync(filename);
    let jsonData = JSON.parse(rawdata); 
    
    if(jsonData[key] == null) {
        jsonData[key] = [value]
    } else {
        jsonData[key].push(value)
    }

    let data = JSON.stringify(jsonData, null, 2);
    fs.writeFileSync(filename, data);
}

module.exports = async function(deployer, network) {
  await Promise.all([deployer.deploy(Guardians), 
                     deployer.deploy(DailyLimit),
                     deployer.deploy(Recovery),
                     deployer.deploy(MetaTx),
                     deployer.deploy(NameService)]);

  await deployer.link(Guardians, TOTPWallet);
  await deployer.link(DailyLimit, TOTPWallet);
  await deployer.link(Recovery, TOTPWallet);
  await deployer.link(MetaTx, TOTPWallet);
  await deployer.link(NameService, TOTPWallet);

  var instance = await deployer.deploy(TOTPWallet);
  console.log("Implementation=", instance.address);
  //var registry = await deployer.deploy(NameRegistry);

  var factory = await deployer.deploy(WalletFactory, instance.address);
  console.log("Factory=", factory.address);
  appendJSON("contracts/deployed.json", network, factory.address)
};