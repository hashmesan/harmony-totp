const { Command } = require('commander');
const commander = require('commander');
const SmartVault = require("../lib/smartvault_lib");
const config = require("../webclient/src/config");
const ethers = require("ethers");
const program = new Command();
const qrcode = require('qrcode-terminal');
const prompt = require('prompt-sync')({sigint: true});
const web3utils = require("web3-utils");
const sleep = (sec) => new Promise(resolve => setTimeout(resolve, 1000 * sec))

program
.version('0.1.0')
.option('-e --env <env>', "environment mainnet0, testnet0, testnet3", "mainnet0")

async function main() {
    program
        .command("new <name>")
        .description( "creates a new wallet")
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

            var validate = true;
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
            console.log("Your wallet address is:", depositInfo.walletAddress);
            console.log("Registration Fee:", depositInfo.rentPrice);
            console.log("Network Fee:", depositInfo.createFee);
            console.log("Total Fee:", depositInfo.totalFee)

            var deposit = new web3utils.BN(0);
            
            while(deposit.lt(new web3utils.BN(depositInfo.totalFee))) {
                deposit = new web3utils.BN(await client.getDeposits());
                await sleep(1);
            }

            console.log("Got deposit ", deposit.toString());
            await client.submitWallet(null, status=>{
                console.log("STATUS: ", status)
            });
            console.log("Wallet created!");
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

    await program.parse(process.argv);
}

main().then(e=>{

});