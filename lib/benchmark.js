var merkle = require("./merkle_hex.js");
const totp = require("./totp.js");
const ethers = require("ethers");
const ethAbi = require("web3-eth-abi");
const web3utils = require("web3-utils");
var NanoTimer = require('nanotimer');
const createKeccakHash = require('keccak')

function h32(a) { return web3utils.soliditySha3(a); }
function h16(a) { return web3utils.soliditySha3({ v: a, t: "bytes", encoding: 'hex' }).substring(0, 34); }
function h16a(a) { return web3utils.soliditySha3(a).substring(0, 34); }
function padNumber(x) { return web3utils.padRight(x, 64); }
function getTOTP(secret, counter, duration) { return totp(secret, { period: duration, counter: counter }); }
const NUMOFTOKENS = 5;
function toHex(a) { return web3utils.toHex(Buffer.from(a)) }

var maxGen = 200000

var timerObject = new NanoTimer();
var microsecs = timerObject.time(function(){
	for (var i = 100000; i < maxGen; i++) {
		const b = new web3utils.BN("123123").toBuffer("le", 32)
		web3utils.soliditySha3(b)
	}	
}, '', 'm');
console.log("Orig: Time took: ", microsecs + " ms");


var microsecs = timerObject.time(function () {
	for (var i = 100000; i < maxGen; i++) {
		web3utils.soliditySha3({ t: 'bytes32', v: web3utils.toHex("" + i) })
	}
}, '', 'm');
console.log("soliditySha3_bytes32: Time took: ", microsecs + " ms");

var microsecs = timerObject.time(function () {
	for (var i = 100000; i < maxGen; i++) {
		const b = new web3utils.BN(i).toBuffer("le", 32)
		createKeccakHash('keccak256').update(b)
	}
}, '', 'm');
console.log("Keccak: Time took: ", microsecs + " ms");


const fastSHA256 = require('fast-sha256')
var microsecs = timerObject.time(function () {
	for (var i = 100000; i < maxGen; i++) {
		const b = new web3utils.BN(i).toBuffer("le", 32)
		fastSHA256(b)
	}
}, '', 'm');
console.log("fastSHA256: Time took: ", microsecs + " ms");

const { Keccak } = require('sha3');
var microsecs = timerObject.time(function () {
	for (var i = 100000; i < maxGen; i++) {
		const b = new web3utils.BN(i).toBuffer("le", 32)
		new Keccak(256).update(b)
	}
}, '', 'm');
console.log("SHA3-keccak: Time took: ", microsecs + " ms");


const b = new web3utils.BN("123123").toBuffer("le",32)
console.log(b)
console.log("ORIG    ", padNumber(web3utils.toHex('123123')))
console.log("ENCODE: ", ethAbi.encodeParameter('bytes32', web3utils.toHex('123123')))
console.log("NEW     ", web3utils.toHex(b))

console.log(web3utils.soliditySha3(b))
console.log(createKeccakHash('keccak256').update(b).digest('hex'))
console.log(fastSHA256(b))
console.log(web3utils.soliditySha3(padNumber(web3utils.toHex("123123"))));
// console.log(web3utils.soliditySha3({ t: 'bytes32', v: web3utils.toHex("123123") }))



console.log("keccak A", new Keccak(256).update(b).digest("hex"))
console.log("keccak B", toHex(new Keccak(256).update(b).digest()))
console.log("keccak RAW", toHex(b))
console.log("Solidity ",  web3utils.soliditySha3({ t: 'bytes', v: toHex(b)}))