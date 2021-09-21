'use strict';

/**
 * Sample request generator usage.
 * Contributed by jjohnsonvng:
 * https://github.com/alexfernandez/loadtest/issues/86#issuecomment-211579639
 */

const loadtest = require('loadtest');
const SmartVault = require("../../lib/smartvault_lib");
const config = require("../../webclient/src/config");
const Transactions = require("./transaction");

const wallets = [
	"../.smartvault/development/.smartvault-one1qa6teqk0lvg7glwg7dd7wh630lnh9nqh0eseym-testsupercrazylong5227.crazy.one"
]

var txmanager = new Transactions("development", 1000);
var wallet = new SmartVault(config.CONFIG["development"]);
wallet.loadFromLocal(wallets[0]);

function generateOptions(tx) {
	return {
		url: 'http://localhost:8080',
		concurrency: 5,
		method: 'POST',
		body:'',
		requestsPerSecond:5,
		maxSeconds:10,
		requestGenerator: (params, options, client, callback) => {
			const raw = JSON.stringify(tx);
			options.headers['Content-Length'] = raw.length;
			options.headers['Content-Type'] = 'application/json';
			options.path = '/';
			options.method = 'POST';
			const request = client(options, callback);
			request.write(raw);
			return request;
		}
	};
}


txmanager.setHashStorageId(wallet.walletData.walletAddress, "dummyid", 0, 200000, wallet.ownerAccount).then(tx=>{
	console.log("TX", tx);

	loadtest.loadTest(generateOptions(tx), (error, results) => {
		if (error) {
			return console.error('Got an error: %s', error);
		}
		console.log(results);
		console.log('Tests run successfully');
	});
	
})

