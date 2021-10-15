var fs  = require("fs");
var HarmonyClient = require("../../lib/harmony_client");
var config = require("../../webclient/src/config");
var DB  =  require("./store/db");
var web3utils = require("web3-utils");
const walletFactoryArtifacts = require('../../build/contracts/WalletFactory.json');

/**
 * Indexes data for info page
 */

const LAST_BLOCK_ID = "LAST_BLOCK_ID";
const RELAYER_GAS_USED = "RELAYER_GAS_USED";
const RELAYER_GAS_RECEIVED = "RELAYER_GAS_RECEIVED";
const WALLET_COUNT = "WALLET_COUNT";

class Indexer {
	
	constructor(factoryPath, dbpath, env) {
		// get factories
		factoryPath = factoryPath || __dirname + "/../../contracts/deployed.json"
		env = env || "mainnet0"

		let rawdata = fs.readFileSync(factoryPath);
		let jsonData = JSON.parse(rawdata);
		const factories = jsonData[env];
		this.factories = [factories[factories.length-1]];
		console.log("Loaded factories", this.factories);

		// db 
		this.env = env;
		this.db = new DB(dbpath);
		try {
			this.db.createSchema();
		}catch(e) {}

		// harmony api
		this.harmonyClient = new HarmonyClient(config.CONFIG[env].RPC_URL, config.CONFIG[env].ENS_ADDRESS);
	}

	async updateAccounts(blockId, currentBlock) {
		console.log("UpdateAccounts start")
		// lookup all the factories
		var allTxs = {}
		for(var factory of this.factories) {
			var txs = await this.harmonyClient.getTransactionsByAccount(factory);
			//console.log(factory, txs);
			allTxs[factory] = txs.filter(e => e.blockNumber >= blockId && e.blockNumber <= currentBlock);
		}

		// sync up transactions since lastBlock
		// filter out createWallet & WalletCreated events

		//  (id INTEGER, hash TEXT, blocktime INTEGER, [from] TEXT, [to] TEXT, value TEXT, data TEXT,  
		//  fname TEXT, decoded TEXT, gasUsed INTEGER, gasPrice TEXT, relayerPaid TEXT)");

		for (const key of Object.keys(allTxs)) {
			await this.updateDBWithTx(allTxs[key]);
		}
	}

	async updateDBWithTx(txs) {
		for (const tx of txs) {
			const events = tx.events.filter(e=> ["TransactionExecuted", "Initialized"].includes(e.name));
			var refundAddress = "";
			var refundFee = "";
			if (events.length > 0 && events[0].args.refundAddress && events[0].args.refundFee) {
				refundAddress = events[0].args.refundAddress;
				refundFee = events[0].args.refundFee.toString();
				console.log(tx.hash, "RefundAddress=", refundAddress, "refundFee", refundFee);
			}
			//events.length  > 0 && console.log(events);
			await this.db.upsertTx([tx.blockNumber, tx.blockHash, web3utils.hexToNumber(tx.timestamp),
			tx.from, tx.to, tx.value, "", tx.function ? tx.function.name : "", JSON.stringify(tx.function),
				tx.gas, tx.gasPrice, refundAddress, refundFee])
		}
	}

	// will use paging to get all txs
	async getTransactionsSinceBlock(blockId, limit, offset) {
		console.log("getTransactionsSinceBlock",this.env,  blockId, limit, offset);
		return await this.db.getAllTxFromBlock(blockId, limit, offset) 
	}

	async getAggregatedInfo() {
		return {
			"txCount": await this.db.getTotalTxs(0),
			"gasUsed": await this.db.getByKey(RELAYER_GAS_USED),
			"relayerReceived": await this.db.getByKey(RELAYER_GAS_RECEIVED),
			"walletCount": await this.db.getByKey(WALLET_COUNT),
			"balanceOne": await this.db.getTotalBalance(),
			"currentBlock": await this.db.getByKey(LAST_BLOCK_ID)
		}
	}

	async updateTransactions(blockId, currentBlock) {
		// get all wallet addresses
		var walletCount = 0;
		for (var factory of this.factories) {
			const factoryContract = new this.harmonyClient.web3.eth.Contract(
				walletFactoryArtifacts.abi,
				factory
			);

			const created = await factoryContract.methods.getCreated().call();
			walletCount += created.length;

			console.log("wallets found", created.map(e=>e.wallet), "in", factory);
			
			// loop through each accounts
			// sync up all the tx blocks since lastBlock
			for (var item of created) {
				var wallet = item.wallet;
				var txs = await this.harmonyClient.getTransactionsByAccount(wallet);
				txs = txs.filter(e => e.blockNumber >= blockId && e.blockNumber <= currentBlock);
				await this.updateDBWithTx(txs);
				
				var balance = await this.harmonyClient.getBalance(wallet);
				console.log("updated wallet=", wallet, "# of txs", txs.length, "balance=", balance);

				await this.db.upsertBalance(wallet, item.domain.join("."), balance);
			}
		}
		await this.db.upsertKeyValue(WALLET_COUNT, walletCount);
	}

	async updateFees() {
		// loop through all the tx, and filter out events to acccount for fees

		// sum up all the gasUsed, and gasPrice -- 
		const totalGas = await this.db.getTotalGasFromBlock(0);
		await this.db.upsertKeyValue(RELAYER_GAS_USED, (totalGas));

		const relayerPaid = await this.db.getRelayerGasReceivedFromBlock(0);
		await this.db.upsertKeyValue(RELAYER_GAS_RECEIVED, (relayerPaid));
	}

	async run() {
		var lastBlockId =  await this.db.getByKey(LAST_BLOCK_ID);
		lastBlockId = lastBlockId || 0;

		var currentBlock = await this.harmonyClient.web3.eth.getBlockNumber();
		console.log("LastBlockId=", lastBlockId, "CurrentBlockId=", currentBlock);

		await this.updateAccounts(lastBlockId, currentBlock);
		await this.updateTransactions(lastBlockId, currentBlock);
		await this.updateFees();

		console.log("Total tx", await this.db.getTotalTxs(0));
		console.log("Gas used=", await this.db.getByKey(RELAYER_GAS_USED));
		console.log("Relayer received=", await this.db.getByKey(RELAYER_GAS_RECEIVED));
		console.log("Total balance=", await this.db.getTotalBalance(), "ONE");
		await this.db.upsertKeyValue(LAST_BLOCK_ID, currentBlock+1);
	}
}

module.exports = Indexer