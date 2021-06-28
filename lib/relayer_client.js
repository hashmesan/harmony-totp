const wallet = require("./wallet");
const ethers = require("ethers");
const {
    toBech32,
    fromBech32,
  } = require('@harmony-js/crypto');
  
  const TOTPWalletArtifact = require('../build/contracts/TOTPWallet.json');
  const NUMOFTOKENS = 5;
  var Contract = require('web3-eth-contract');
  var contract = new Contract(TOTPWalletArtifact.abi)
  
function Relayer(url) {
    this.url = url;
}

Relayer.prototype.getRefundInfo = async function() {
    return fetch(this.url,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({
            operation: "getRefundInfo"
        })
    }).then(res=>res.json())
}

Relayer.prototype.transferTX = async function(from, destination, amount, gasPrice, gasLimit, ownerAccount) {
    var refundInfo = await this.getRefundInfo();
    const methodData = contract.methods.makeTransfer(destination,amount).encodeABI();
    var nonce = await wallet.getNonceForRelay();
    console.log("transferTX", from, destination, amount,methodData);

    var sigs = await wallet.signOffchain2(
        [ownerAccount],
        from,
        0,
        methodData,
        0,
        nonce,
        0,
        gasLimit,
        ethers.constants.AddressZero,
        from
    );    

    /*
        function executeMetaTx(
            bytes   calldata data,
            bytes   calldata signatures,
            uint256 nonce,
            uint256 gasPrice,
            uint256 gasLimit,
            address refundToken,
            address refundAddress            
        ) external 
    */
    var response = await fetch(this.url,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({
            operation: "submitMetaTx",
            data: {
                from: from,
                data: methodData,
                signatures: sigs,
                nonce,
                gasPrice,
                gasLimit,
                refundToken: ethers.constants.AddressZero,
                refundAddress: from
            }
        })
    })
    return await response.json();
}

Relayer.prototype.setHashStorageId = async function(from, id, gasPrice, gasLimit, ownerAccount) {
    var refundInfo = await this.getRefundInfo();
    const methodData = contract.methods.setHashStorageId(id).encodeABI();
    var nonce = await wallet.getNonceForRelay();
    console.log("setHashStorageId", from, id,methodData);

    var sigs = await wallet.signOffchain2(
        [ownerAccount],
        from,
        0,
        methodData,
        0,
        nonce,
        0,
        gasLimit,
        ethers.constants.AddressZero,
        from
    );    

    var response = await fetch(this.url,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({
            operation: "submitMetaTx",
            data: {
                from: from,
                data: methodData,
                signatures: sigs,
                nonce,
                gasPrice,
                gasLimit,
                refundToken: ethers.constants.AddressZero,
                refundAddress: from
            }
        })
    })
    return await response.json();
}

module.exports = Relayer;
