//var W3 = require('web3');
const web3utils = require("web3-utils");
function h(a) { return web3utils.soliditySha3({v: a, t: "bytes", encoding: 'hex' }); }
const { Keccak } = require('sha3');

function h32(a) { return new Keccak(256).update(a).digest(); }
function toHex(a) { return web3utils.toHex(Buffer.from(a)) }

function reduceMT (layer) {
    const n = layer.length / 32;
    //console.log("reduceLayer n=", n);
    if (1 == n) return layer;

    //console.log(`Tree Dump  ${n}`);
    const reducedLayer = new Uint8Array(new ArrayBuffer((n/2)* 32))
    for (var i = 0; i < (n / 2); i++) {
        //console.log(toHex(h32(Buffer.from(layer.slice(2*i*32, ((2*i)+2)*32)))))
        reducedLayer.set(h32(Buffer.from(layer.slice(2*i*32, ((2*i)+2)*32))), i*32);
    }
    //console.log("layer", n, reducedLayer)
    return reduceMT(reducedLayer);
}

function reduceMTByOneStep(layer) {
    const n = layer.length / 32;
    const reducedLayer = new Uint8Array(new ArrayBuffer(layer.length/2))
    for (var i = 0; i < (n / 2); i++) {
        var next64Bytes = Buffer.from(layer.slice(2*i*32, (2*i*32) + 64));
        //console.log("reduceOne", i, next64Bytes.length, toHex(h32(next64Bytes)))
        reducedLayer.set(h32(next64Bytes), i*32);
    }
    return reducedLayer;
}

MT_LEFT_SIDE = "00";
MT_RIGHT_SIDE = "01";
MT_STUB_SIDE = "FF";

function printLeaves(leaves) {
    for(var i=0; i<leaves.length/32; i++) {
        console.log(toHex(leaves.slice(i*32, (i+1)*32)))
    }
}
function getProof(leaves, idx, idx_data) {
    //printLeaves(leaves);
    var leavesLen = leaves.length / 32;
    var height = Math.log2(leavesLen);
    //console.log("leavesLen=", leavesLen, "height=", height);
    var ret = [toHex(idx_data)];
    var retSides = "0x";
    var hashesOfCurLayer = leaves;
    var idxInCurLayer = idx;

    // proceed from bottom to top
    for (let layer = 0; layer < height ; layer++){
        var siblingIdx = (0 == idxInCurLayer % 2) ?  idxInCurLayer + 1 : idxInCurLayer - 1;
        ret.push(toHex(hashesOfCurLayer.slice(siblingIdx*32, (siblingIdx+1) * 32)));
        retSides += (0 == idxInCurLayer % 2) ?  MT_LEFT_SIDE : MT_RIGHT_SIDE;
        hashesOfCurLayer = reduceMTByOneStep(hashesOfCurLayer);
        idxInCurLayer = Math.floor(idxInCurLayer / 2);
        // console.log("getProof layer=", hashesOfCurLayer.length, layer, idxInCurLayer, "sibling=", siblingIdx);
    }
    ret.push(retSides)
    return ret;
}

module.exports = {
    reduceMT,
    getProof,
    h32,
    toHex
}

// var res = reduceMT(["0x00000000000000000000000000000000","0x00000000000000000000000000000000"])
// console.log(res);
// console.log(concatB32("0x00000000000000000000000000000000","0x00000000000000000000000000000000"))