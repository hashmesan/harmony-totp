var Indexer = require("./src/indexer");

var env = process.argv[2] || "mainnet0";
if(!["testnet0", "testnet3", "mainnet0"].includes(env)) {
	console.log("Invalid environment")
	exit(1);
}

console.log("Run Indexer for", env);

var indexer = new Indexer(null, "./db/index_" + env + ".db", env);
indexer.run().then();