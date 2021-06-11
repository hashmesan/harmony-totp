// SPDX-License-Identifier: GPL-3.0-only

pragma solidity ^0.7.6;
pragma experimental ABIEncoderV2;

import "../core/wallet_data.sol";
import "./recovery.sol";

library MetaTx {
    struct StackExtension {
        bytes32 signHash;
        bool success;
        bytes returnData;
    }

    function executeMetaTx(
            Core.Wallet storage _wallet,
            address sw,
            bytes   calldata _data,
            bytes   calldata signatures,
            uint256 nonce,
            uint256 gasPrice,
            uint256 gasLimit,
            address refundAddress,
            Core.SignatureRequirement memory sigRequirement
        ) public
    {
        StackExtension memory ex;

        require(sigRequirement.requiredSignatures > 0 || sigRequirement.ownerSignatureRequirement == Core.OwnerSignature.Anyone, "RM: Wrong signature requirement");
        require(sigRequirement.requiredSignatures * 65 == signatures.length, "Wrong number of signatures");

        ex.signHash = getSignHash(
            address(this),
            0,
            _data,
            nonce,
            gasPrice,
            gasLimit,
            address(0),
            refundAddress);

        require(Recovery.validateSignatures(_wallet, ex.signHash, signatures, sigRequirement.ownerSignatureRequirement), "RM: Invalid signatures");

        (ex.success, ex.returnData) = address(this).call(_data);

        // refund
    }

    function getSignHash(
        address _from,
        uint256 _value,
        bytes memory _data,
        uint256 _nonce,
        uint256 _gasPrice,
        uint256 _gasLimit,
        address _refundToken,
        address _refundAddress
    )
        internal
        view
        returns (bytes32)
    {
        return keccak256(
            abi.encodePacked(
                "\x19Ethereum Signed Message:\n32",
                keccak256(abi.encodePacked(
                    bytes1(0x19),
                    bytes1(0),
                    _from,
                    _value,
                    _data,
                    uint(0), //block.chainid,
                    _nonce,
                    _gasPrice,
                    _gasLimit,
                    _refundToken,
                    _refundAddress))
        ));
    }
}