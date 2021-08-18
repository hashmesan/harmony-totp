const web3utils = require("web3-utils");

/**
 * roundWei takes a wei unit value and round up to the 'unit' value.
 * Useful for rounding up very small wei value up to desired precision
 * 
 * @param {string} wei 
 * @param {*} unit 
 * @returns 
 */
function roundWei(wei, unit) {
    unit = unit || 'milli';
    len = web3utils.unitMap[unit].length - 1;
    var threshold = new web3utils.BN(web3utils.toWei('1', unit));
    var smallfinny = web3utils.fromWei(wei, unit).split(".")[1];  
    if(web3utils.toBN(smallfinny).gt(0)) {
        var zeroOut = wei.substr(0,wei.length-len) + web3utils.padRight('0', len);
        var roundedUp = web3utils.toBN(zeroOut).add(threshold);
        return roundedUp.toString()
    }
    return wei        
}

module.exports = {
    roundWei
}