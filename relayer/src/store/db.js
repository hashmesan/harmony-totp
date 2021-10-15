var sqlite3 = require('sqlite3').verbose();
const util = require('util');

class DBStore {
	constructor(location) {
		this.db = new sqlite3.Database(location);
	}

	createSchema() {
		// create KV table
		this.db.serialize(()=>{
			this.db.run("CREATE TABLE keyvalues (key TEXT, value TEXT)");
			// create  TX  table
			this.db.run("CREATE TABLE txs (id INTEGER, hash TEXT, blocktime INTEGER, [from] TEXT, [to] TEXT, value TEXT, data TEXT,  fname TEXT, decoded TEXT, gasUsed INTEGER, gasPrice TEXT, refundAddress TEXT, relayerPaid TEXT)");
		})
	}

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
		var stmt = this.db.prepare("INSERT INTO keyvalues(key, value)  VALUES(?, ?)");
		return  new Promise((resolve, reject) =>  {
			stmt.run(key, value, (err, row) =>{
				if(err) { reject(err) }
				resolve(row);
			});
		});
	}

	async upsertTx(data) {
		var stmt = this.db.prepare("INSERT INTO txs  VALUES(?, ?, ?, ?, ?, ? , ? , ?, ? , ? , ?, ?,?)");
		return new Promise((resolve, reject) => {
			stmt.run(...data, (err, row) => {
				if (err) { reject(err) }
				resolve(row);
			});
		});
	}

	async getAllTxFromBlock(blockId) {
		var stmt = this.db.prepare("SELECT * from txs where id>=?");
		return new Promise((resolve, reject) => {
			stmt.all(blockId, (err, rows) => {
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