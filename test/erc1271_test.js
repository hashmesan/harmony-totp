
const truffleAssert = require("truffle-assertions");
const ethers = require("ethers");
const commons = require("./commons.js");

const DURATION = 300;
const time = Math.floor((Date.now() / 1000));
const timeOffset = time - (time% 300);        

contract("ERC1271 tests", accounts => {

    it("Should validate owner", async () => {
        var tmpWallet = web3.eth.accounts.create();
        var falseWallet = web3.eth.accounts.create();

        var { root, leaves, wallet } = await commons.createWallet(
            ethers.constants.AddressZero,
            ["", "","hashId"],
            tmpWallet.address,
            8,
            web3.utils.toWei("0.1", "ether"),
            tmpWallet.address,
            tmpWallet.address,
            0);

        const method = ethers.utils.id("isValidSignature(bytes32,bytes)").substr(0,10)
        console.log(method)
        const supported = await wallet.supportsInterface(method)
        assert.equal(supported, true);

        var message = tmpWallet.sign("hello world");
        console.log(message);

        const result = await wallet.isValidSignature(message.messageHash, message.signature);
        console.log(result)
        assert(result == method, "Expect magic number to be same")
      
        var message = falseWallet.sign("hello world");
        const query = wallet.isValidSignature(message.messageHash, message.signature);
        await truffleAssert.reverts(query, "Invalid owner signature");

    })

})