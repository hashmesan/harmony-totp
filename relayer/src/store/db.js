var sqlite3 = require('sqlite3').verbose();
const util = require('util');

class DBStore {
	constructor(location) {
		this.db = new sqlite3.Database(location);
	}

	createSchema() {
		// create KV table
		this.db.serialize(()=>{
			this.db.run("CREATE TABLE IF NOT EXISTS keyvalues (key TEXT PRIMARY KEY, value TEXT)");
			// create  TX  table
			this.db.run("CREATE TABLE IF NOT EXISTS txs (id INTEGER PRIMARY KEY, hash TEXT, blocktime INTEGER, [from] TEXT, [to] TEXT, value TEXT, data TEXT,  fname TEXT, decoded TEXT, gasUsed INTEGER, gasPrice TEXT, refundAddress TEXT, relayerPaid TEXT)");

			this.db.run("CREATE TABLE IF NOT EXISTS balance (account TEXT PRIMARY KEY, domain TEXT, balance TEXT)");
		})
	}

	// KEY-VALUE TABLE
	async getByKey(key) {
		var stmt = this.db.prepare("SELECT value from keyvalues where key=?");
		return new Promise((resolve, reject) => {
			stmt.get(key, (err, row) => {
				if (err) { reject(err) }
				resolve(row && row.value || row);
			});
		});
	}

	async upsertKeyValue(key, value) {
		var stmt = this.db.prepare("INSERT INTO keyvalues(key, value)  VALUES(?, ?) ON CONFLICT(key) DO UPDATE SET value=?");
		return  new Promise((resolve, reject) =>  {
			stmt.run(key, value, value, (err, row) =>{
				if(err) { reject(err) }
				resolve(row);
			});
		});
	}

	// BALANCE TABLE
	async getBalanceByAccount(account) {
		var stmt = this.db.prepare("SELECT * from balance where account=?");
		return new Promise((resolve, reject) => {
			stmt.get(account, (err, row) => {
				if (err) { reject(err) }
				resolve(row);
			});
		});
	}

	async upsertBalance(account, domain, balance) {
		var stmt = this.db.prepare("INSERT INTO balance VALUES(?, ?, ?) ON CONFLICT(account) DO UPDATE SET balance=?");
		return new Promise((resolve, reject) => {
			stmt.run(account, domain, balance, balance, (err, row) => {
				if (err) { reject(err) }
				resolve(row);
			});
		});
	}

	async getTotalBalance() {
		var stmt = this.db.prepare("SELECT sum(balance/1e18) as totalBalance from balance");
		return new Promise((resolve, reject) => {
			stmt.get((err, row) => {
				if (err) { reject(err) }
				resolve(row.totalBalance);
			});
		});
	}

	// Transactions
	async upsertTx(data) {
		var stmt = this.db.prepare("INSERT INTO txs  VALUES(?, ?, ?, ?, ?, ? , ? , ?, ? , ? , ?, ?,?)");
		return new Promise((resolve, reject) => {
			stmt.run(...data, (err, row) => {
				if (err) { reject(err) }
				resolve(row);
			});
		});
	}

	async getAllTxFromBlock(blockId, limit, offset) {
		limit = limit || 10
		offset = offset || 0

		var stmt = this.db.prepare("SELECT * from txs where id>=? LIMIT ? OFFSET ?");
		return new Promise((resolve, reject) => {
			stmt.all(blockId, limit, offset, (err, rows) => {
				if (err) { reject(err) }
				resolve(rows);
			});
		});
	}

	async getTotalTxs(blockId) {
		var stmt = this.db.prepare("SELECT COUNT(*) count from txs where id>=?");
		return new Promise((resolve, reject) => {
			stmt.get(blockId, (err, rows) => {
				if (err) { reject(err) }
				resolve(rows.count);
			});
		});
	}

	async getTotalGasFromBlock(blockId) {
		var stmt = this.db.prepare("SELECT SUM(gasUsed*(gasPrice/1e18)) as  totalGas from txs where id>=?");
		return new Promise((resolve, reject) => {
			stmt.get(blockId, (err, row) => {
				if (err) { reject(err) }
				resolve(row.totalGas);
			});
		});
	}

	async getRelayerGasReceivedFromBlock(blockId) {
		var stmt = this.db.prepare("SELECT SUM(relayerPaid/1e18) as  relayerPaid from txs where id>=?");
		return new Promise((resolve, reject) => {
			stmt.get(blockId, (err, row) => {
				if (err) { reject(err) }
				resolve(row.relayerPaid);
			});
		});
	}

}

module.exports = DBStore