
const truffleAssert = require("truffle-assertions");
const ethers = require("ethers");
const commons = require("./commons.js");
const walletLib = require("../lib/wallet.js");
const web3utils = require("web3-utils");
const chai = require("chai");
const BN = require("bn.js");
const bnChai = require("bn-chai");
const { assert, expect } = chai;
chai.use(bnChai(BN));

const ERC20SampleToken = artifacts.require("ERC20SampleToken");
const FungibleToken = artifacts.require("FungibleToken");

contract("TokenTest", async (accounts) => {
    var tmpWallet;
    var smartWallet;

    async function multiCall(smartWallet, calls) {
        const methodData = smartWallet.contract.methods.multiCall(calls).encodeABI()
        const gasLimit = 100000;
        const nonce = await commons.getNonceForRelay();

        var sigs = await commons.signOffchain2(
            [tmpWallet],
            smartWallet.address,
            0,
            methodData,
            0,
            nonce,
            0,
            gasLimit,
            ethers.constants.AddressZero,
            ethers.constants.AddressZero
        );

        await smartWallet.executeMetaTx(methodData, 
                                        sigs, 
                                        nonce, 
                                        0, 
                                        gasLimit, 
                                        ethers.constants.AddressZero,
                                        ethers.constants.AddressZero)
    }

    before(async () => {
        const blockNumber = await web3.eth.getBlockNumber();
        tmpWallet = web3.eth.accounts.create();
        var {root, leaves, wallet} = await commons.createWallet(
            ethers.constants.AddressZero,
            ["",""],
            tmpWallet.address, //owner
            8, 
            web3.utils.toWei("100", "ether"),
            tmpWallet.address, 
            tmpWallet.address, 
            0);
        await web3.eth.sendTransaction({from: accounts[0], to: wallet.address, value: web3.utils.toWei("2", "ether")});
        smartWallet = wallet;
    })

    it("should accept ERC20 and send ERC20", async () => {
        console.log("wallet="+ smartWallet.address);
        var erc20 = await ERC20SampleToken.new(web3utils.toWei("1000000"));
        let before = await erc20.balanceOf(smartWallet.address);
        await erc20.transfer(smartWallet.address, 10000, { from: accounts[0] });
        let after = await erc20.balanceOf(smartWallet.address);
        expect(after.sub(before)).to.eq.BN(10000);

        before = after;
        var recipient = web3.eth.accounts.create();
        const data = await erc20.contract.methods.transfer(recipient.address, 10000).encodeABI();
        await multiCall(smartWallet, [{to: erc20.address, value: 0, data: data}])

        after = await erc20.balanceOf(smartWallet.address);        
        expect(before.sub(after)).to.eq.BN(10000);         
    })

    it("should accept HRC721 and send HRC721", async () => {
        var erc721 = await FungibleToken.new()
        const blockNumber = await web3.eth.getBlockNumber();
        const res = await erc721.awardItem(accounts[0], blockNumber);
        const tokenId = res.logs[0].args.tokenId;

        let before = await erc721.balanceOf(smartWallet.address);
        await erc721.safeTransferFrom(accounts[0], smartWallet.address, tokenId);
        let after = await erc721.balanceOf(smartWallet.address);
        expect(after.sub(before)).to.eq.BN(1);

        before = after;
        var recipient = web3.eth.accounts.create();
        const data = erc721.contract.methods.safeTransferFrom(smartWallet.address, recipient.address, tokenId).encodeABI();
        await multiCall(smartWallet, [{to: erc721.address, value: 0, data: data}])
        after = await erc721.balanceOf(smartWallet.address);
        expect(before.sub(after)).to.eq.BN(1);

        // console.log(await erc721.balanceOf(recipient.address))
    });

    it("should accept HRC1155 and send HRC1155", async () => {
        
    });
})