const TOTPWallet = artifacts.require("TOTPWallet");
const Guardians = artifacts.require("Guardians");
const DailyLimit = artifacts.require("DailyLimit");
const Recovery = artifacts.require("Recovery");
const MetaTx = artifacts.require("MetaTx");
const WalletFactory = artifacts.require("WalletFactory");
const Relayer = artifacts.require("Relayer");

module.exports = async function(deployer) {
  await Promise.all([deployer.deploy(Guardians), 
                     deployer.deploy(DailyLimit),
                     deployer.deploy(Recovery),
                     deployer.deploy(MetaTx)]);

  await deployer.link(Guardians, TOTPWallet);
  await deployer.link(DailyLimit, TOTPWallet);
  await deployer.link(Recovery, TOTPWallet);
  await deployer.link(MetaTx, TOTPWallet);
  var instance = await deployer.deploy(TOTPWallet);
  console.log("Implementation=", instance.address);
  var factory = await deployer.deploy(WalletFactory, instance.address);
  console.log("Factory=", factory.address);
  // await deployer.deploy(Relayer, factory.address, 5);
};