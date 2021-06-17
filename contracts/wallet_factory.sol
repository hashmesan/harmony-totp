// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.7.6;
pragma experimental ABIEncoderV2;

import "./otp_wallet.sol";
import "./external/walletproxy.sol";
import "./external/create2.sol";
import "./external/signatureutil.sol";

contract WalletFactory
{
    using SignatureUtil for bytes32;

    event WalletCreated (address wallet, address owner);
    event Debug(bytes32 signHash, address addr);

    address             public immutable walletImplementation;

    string  public constant WALLET_CREATION = "WALLET_CREATION";

		//address owner_, bytes32[] memory rootHash_, uint8 merkelHeight_, address payable drainAddr_, uint dailyLimit_
    bytes32 public constant CREATE_WALLET_TYPEHASH = keccak256(
        "createWallet(address owner, bytes32[] rootHash, uint8 merkelHeight, address payable drainAddr, uint dailyLimit,uint256 salt)");

    struct WalletConfig
    {
				address owner;
				bytes32[] rootHash;
				uint8 		merkelHeight;
				address	drainAddr;
				uint 			dailyLimit;
        bytes     signature;
    }

    constructor(
        address        _walletImplementation
        )
    {
        walletImplementation = _walletImplementation;
    }

    function createWallet(
        WalletConfig calldata config,
        uint                  salt
        )
        external
        returns (address wallet)
    {
        _validateRequest(config, salt);
        wallet = _deploy(config.owner, salt);
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
            _getWalletCode()
        );
    }

    // --- Internal functions ---

    function _initializeWallet(
        address               wallet,
        WalletConfig calldata config
        )
        internal
    {
        TOTPWallet(payable(wallet)).initialize(
            config.owner,
            config.rootHash,
            config.merkelHeight,
            payable(config.drainAddr),
            config.dailyLimit
        );

        emit WalletCreated(wallet, config.owner);
    }

    function _validateRequest(
        WalletConfig memory config,
        uint                salt
        )
        public
    {
        require(config.owner != address(0), "INVALID_OWNER");

        bytes memory encodedRequest = abi.encode(
            CREATE_WALLET_TYPEHASH,
            config.owner,
            config.rootHash,
            config.merkelHeight,
            config.drainAddr,
            config.dailyLimit,
            salt
        );

        bytes32 signHash = keccak256(abi.encodePacked(
                "\x19Ethereum Signed Message:\n32",
                keccak256(encodedRequest)));

		address[] memory signers = new address[](1);
		signers[0] = config.owner;

        address addr = signHash.recoverSigner(config.signature, 0);
        //emit Debug(signHash, addr);

        require(signHash.verifySignatures(signers, config.signature), "INVALID_SIGNATURE");
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
            _getWalletCode()
        );
    }

    function _getWalletCode()
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