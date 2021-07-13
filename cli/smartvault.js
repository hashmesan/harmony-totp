#!/usr/bin/env node

const { Command } = require('commander');
const commander = require('commander');
const RelayerClient = require("../lib/relayer_client");
const SmartVault = require("../lib/smartvault_lib");
const config = require("../webclient/src/config");
const ethers = require("ethers");
const program = new Command();
const qrcode = require('qrcode-terminal');
const prompt = require('prompt-sync')({sigint: true});
const web3utils = require("web3-utils");
const { toBech32, fromBech32 } = require('@harmony-js/crypto');
const sleep = (sec) => new Promise(resolve => setTimeout(resolve, 1000 * sec))

program
.version('0.1.0')
.option('-e --env <env>', "environment mainnet0, testnet0, testnet3", "mainnet0")

async function main() {
    program
        .command("new <name>")
        .description( "creates a new wallet")
        .option('-d, --daily_limit <amount>', 'Send from address', 10000)
        .action(async (name, options) =>{ 
            if(!name.endsWith(".crazy.one")) {
                console.error("Only support name.crazy.one");
                return;
            }
            var client = new SmartVault(config.CONFIG[program._optionValues.env]);
            var walletData = await client.create(name);
            if(walletData == null) {
                console.error(`${name} is not available (${available.address})`);
                return;
            }

            const depth = 8;
            var generateHash = () => new Promise((resolve, reject) => {
                client.generateHashes(depth, (p)=>{
                    console.log(`Generated leaves depth=${depth} ${p*100}%`);
                });
    
                resolve();
            })
            await generateHash();
            console.log(client.getOTPScanUrl())
            qrcode.generate(client.getOTPScanUrl(),{small: true});

            var validate = false;
            while(!validate) 
            {
               const input = prompt("Enter the 6-digit OTP: ")
               validate = client.validateOTP(input);
               if(!validate) {
                console.error("OTP code do not match.")
               }
            }            

            const depositInfo = client.getDepositInfo();
            console.log("Make your first deposit. Fees will be deducted from your deposits");
            console.log("Your wallet address is:", toBech32(depositInfo.walletAddress));
            console.log("Registration Fee:", web3utils.fromWei(depositInfo.rentPrice));
            console.log("Network Fee:", web3utils.fromWei(depositInfo.createFee));
            console.log("Total Fee:", web3utils.fromWei(depositInfo.totalFee))

            var deposit = new web3utils.BN(0);
            
            while(deposit.lt(new web3utils.BN(depositInfo.totalFee))) {
                deposit = new web3utils.BN(await client.getDeposits());
                await sleep(1);
            }

            console.log("Got deposit ", deposit.toString());
            var success = await client.submitWallet(status=>{
                console.log("STATUS: ", status)
            });
            console.log("Wallet created!");
            success && client.saveWalletLocal();
        });


    program
        .command("recover <name> <code1> <code2> <code3> <code4> <code5>")
        .description("recover wallet")
        .action(async (name, code1, code2, code3, code4, code5)=>{        
            var client = new SmartVault(config.CONFIG[program._optionValues.env]);
            var codes = [code1, code2, code3, code4, code5];
            var success = await client.recoverWallet(name, codes, status=>{
                console.log("STATUS: ", status)})
            
            success && client.saveWalletLocal();
        });

    program
        .command("list")
        .description("list all wallets")
        .action((options)=>{
            var client = new SmartVault(config.CONFIG[program._optionValues.env]);
            var {matches, addresses, names} = client.listWallets();

            console.log("List Wallets");
            console.log("------------");
            matches.forEach((e, index)=>{
                console.log(names[index] + "  " + addresses[index])
            })
        });


    function loadWalletByNameOrAddress(client, nameOrAddress) {
        var {dir, matches, addresses, names} = client.listWallets();

        var index1 = addresses.indexOf(nameOrAddress)
        var index2 = names.indexOf(nameOrAddress)
        var index = index1 == -1 ? index2 : index1;

        if(index == -1) {
            throw Error("Error: Cannot find wallet")
        }
        client.loadFromLocal(dir + matches[index])        
    }

    program
    .command("balance <address>")
    .description("get balance")
    .action( async (address)=>{
        var client = new SmartVault(config.CONFIG[program._optionValues.env]);
        var balance = await client.harmonyClient.getBalance(fromBech32(address))
        console.log(`Balance: ${web3utils.fromWei(balance)} ONE`)
    });        
    program
        .command("transfer [to] [amount]")
        .description("Transfer funds")
        .requiredOption('-f, --from <from>', 'Send from address')
        .action(async (to, amount, {from}) => {
            var envConfig = config.CONFIG[program._optionValues.env];
            var client = new SmartVault(envConfig);
            try {
                loadWalletByNameOrAddress(client, from);
                //console.log(envConfig.gasPrice, envConfig.gasLimit);
                const res = await client.relayClient.transferTX(client.walletData.walletAddress, fromBech32(to), web3utils.toWei(amount), envConfig.gasPrice, envConfig.gasLimit, client.ownerAccount);    

                if(res.success) {
                    console.log("Success! TX=" + res.data.tx)
                } else {
                    console.log("Error", res)
                }

            } catch(e) {
                console.error(e);
            }
        })

    program
    .command("info <address>")
    .description("Display wallet info")
    .action( async (address)=>{
        var client = new SmartVault(config.CONFIG[program._optionValues.env]);

        try {
            var balance = await client.harmonyClient.getBalance(fromBech32(address))
            var info = await client.harmonyClient.getSmartVaultInfo(fromBech32(address))

            console.log(`Version: ${info.masterCopy}`)
            console.log(`Spending Limit: ${web3utils.fromWei(info.spentToday)} / ${web3utils.fromWei(info.dailyLimit)} ONE`)
            console.log(`OTP Tokens: counter=${info.counter} max=${Math.pow(2, info.merkelHeight)}`)
            console.log(`# of Guardians: ${info.guardians.length}`);
            console.log(`IPFS Merkle Backup: ${info.hashStorageID}`);
            console.log(`Drain Address: ${info.drainAddr}`);
            console.log(`Balance: ${web3utils.fromWei(balance)} ONE`);    
        } catch(e) {
            console.error("Error: ", e.message)
        }
    });  
                 
    program
    .command("set_daily_limit <amount>")
    .description("set daily limit")
    .requiredOption('-f, --from <from>', 'Send from address')
    .action( async (amount, {from})=>{
        var client = new SmartVault(config.CONFIG[program._optionValues.env]);
        try {
            loadWalletByNameOrAddress(client, from)        
            var methodData = RelayerClient.getContract().methods.setDailyLimit(web3utils.toWei(amount)).encodeABI();    
            const res = await client.submitTransaction(methodData)
            if(res.success) {
                console.log("Success! TX=" + res.data.tx)
            } else {
                console.log("Error", res)
            }
        } catch(e) {
            console.error("Error: ", e.message)
        }
    });  
        
    program
    .command("set_drain_address <address>")
    .description("set drain address")
    .requiredOption('-f, --from <from>', 'Send from address')
    .action( async (address,  {from})=>{
        var client = new SmartVault(config.CONFIG[program._optionValues.env]);
        try {
            loadWalletByNameOrAddress(client, from)        
            var methodData = RelayerClient.getContract().methods.setDrainAddress(fromBech32(address)).encodeABI();    
            const res = await client.submitTransaction(methodData)
            if(res.success) {
                console.log("Success! TX=" + res.data.tx)
            } else {
                console.log("Error", res)
            }
        } catch(e) {
            console.error("Error: ", e.message)
        }
    });  
            
    program
    .command("upgrade")
    .description("upgrades contract to latest")
    .requiredOption('-f, --from <from>', 'Send from address')
    .action( async ({from})=>{
        var client = new SmartVault(config.CONFIG[program._optionValues.env]);
        
        try {
            loadWalletByNameOrAddress(client, from)        
            const factoryInfo = await client.relayClient.getFactoryInfo();

            var info = await client.harmonyClient.getSmartVaultInfo(fromBech32(from))
            console.log("Current version: ", info.masterCopy);
            console.log("Latest version: ", factoryInfo.implementation);
            if(info.masterCopy == factoryInfo.implementation) {
                console.log("No available update.");
                return;
            }
            var n = prompt('Do you want to upgrade? (Y/N): ');
            if (n == 'Y' || n == 'y') {
                var methodData = RelayerClient.getContract().methods.upgradeMasterCopy(factoryInfo.implementation).encodeABI();    
                const res = await client.submitTransaction(methodData)
                if(res.success) {
                    console.log("Success! TX=" + res.data.tx)
                } else {
                    console.log("Error", res)
                }
            }
        } catch(e) {
            console.error("Error: ", e.message)
        }
    });  
                
    await program.parse(process.argv);
}

main().then(e=>{

});