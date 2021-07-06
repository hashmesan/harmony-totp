const TOTPWallet = artifacts.require("TOTPWallet");
const Guardians = artifacts.require("Guardians");
const DailyLimit = artifacts.require("DailyLimit");
const Recovery = artifacts.require("Recovery");
const MetaTx = artifacts.require("MetaTx");
const WalletFactory = artifacts.require("WalletFactory");
const Relayer = artifacts.require("Relayer");
const NameRegistry = artifacts.require("NameRegistry");
const NameService = artifacts.require("NameService");

module.exports = async function(deployer) {
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
};