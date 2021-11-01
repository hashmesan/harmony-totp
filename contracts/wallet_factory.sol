// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity >=0.7.6;
pragma experimental ABIEncoderV2;

import "./otp_wallet.sol";
import "./external/walletproxy.sol";
import "./external/create2.sol";
import "./external/signatureutil.sol";

contract WalletFactory
{
    event WalletCreated (address wallet, address owner, string[3] domain);
    event Debug(bytes32 signHash, address addr);

    address public immutable walletImplementation;
    string  public constant WALLET_CREATION = "WALLET_CREATION";

    struct CreateRecord {
        address wallet;
        string[2] domain;
    }

    CreateRecord[] public created;

    struct WalletConfig
    {
        address resolver;
        string[3]    domain;
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
        // require(NameRegistry(this).registerName(config.name, addr, 1));

        wallet = _deploy(config.owner, config.salt);
        _initializeWallet(wallet, config);

        created.push(CreateRecord(address(wallet), [config.domain[0], config.domain[1]]));
        emit WalletCreated(address(wallet), config.owner, config.domain);
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

    function getCreated() public view returns (CreateRecord[] memory ) {
        return created;
    }
    // --- Internal functions ---

    function _initializeWallet(
        address                 wallet,
        WalletConfig calldata   config
        )
        internal
    {
        TOTPWallet(payable(wallet)).initialize(
            config.resolver,
            config.domain,
            config.owner,
            config.rootHash,
            config.merkelHeight,
            payable(config.drainAddr),
            config.dailyLimit,
            config.feeReceipient,
            config.feeAmount
        );

        //TOTPWallet(payable(wallet)).registerENS(config.subdomain, config.domain, config.duration);
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