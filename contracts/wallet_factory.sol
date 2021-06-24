// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.7.6;
pragma experimental ABIEncoderV2;

import "./name_registry.sol";
import "./otp_wallet.sol";
import "./external/walletproxy.sol";
import "./external/create2.sol";
import "./external/signatureutil.sol";

contract WalletFactory is NameRegistry
{
    event WalletCreated (address wallet, address owner);
    event Debug(bytes32 signHash, address addr);

    address public immutable walletImplementation;
    string  public constant WALLET_CREATION = "WALLET_CREATION";

    struct WalletConfig
    {
        string    name;
        address   owner;     
        bytes32[] rootHash;
        uint8 	  merkelHeight;
        address	  drainAddr;
        uint 	  dailyLimit;
        uint      salt;
        address   feeReceipient;
        uint256   feeAmount;
    }

    constructor(
        address        _walletImplementation
        )
    {
        walletImplementation = _walletImplementation;
    }

    function createWallet(WalletConfig calldata config)
        external
        returns (address wallet)
    {   
        // address found;
        // uint16 ver;
        // (found, ver) =  NameRegistry(this).getContractDetails(config.name);
        // require(found == address(0x0), "REGISTRY MUST BE AVAILABLE");
        address addr = computeWalletAddress(config.owner, config.salt);
        require(addr.balance >= config.feeAmount, "NOT ENOUGH FOR FEES");
        require(NameRegistry(this).registerName(config.name, addr, 1));

        wallet = _deploy(config.owner, config.salt);
        _initializeWallet(wallet, config);
    }

    function computeWalletAddress(
        address owner,
        uint    salt
        )
        public
        view
        returns (address)
    {
        return Create2.computeAddress(
            keccak256(abi.encodePacked(WALLET_CREATION, owner, salt)),
            getWalletCode()
        );
    }

    // --- Internal functions ---

    function _initializeWallet(
        address                 wallet,
        WalletConfig calldata   config
        )
        internal
    {
        TOTPWallet(payable(wallet)).initialize(
            config.owner,
            config.rootHash,
            config.merkelHeight,
            payable(config.drainAddr),
            config.dailyLimit,
            config.feeReceipient,
            config.feeAmount
        );

        emit WalletCreated(wallet, config.owner);
    }

    function _deploy(
        address owner,
        uint    salt
        )
        internal
        returns (address payable wallet)
    {
        // Deploy the wallet proxy
        wallet = Create2.deploy(
            keccak256(abi.encodePacked(WALLET_CREATION, owner, salt)),
            getWalletCode()
        );
    }

    function getWalletCode()
        internal
        view
        returns (bytes memory)
    {
        return abi.encodePacked(
            type(WalletProxy).creationCode,
            abi.encode(walletImplementation)
        );
    }
}