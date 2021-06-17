// SPDX-License-Identifier: GPL-3.0-only

pragma solidity ^0.7.6;
pragma experimental ABIEncoderV2;

import "../core/wallet_data.sol";

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

        //require(sigRequirement.requiredSignatures > 0 || sigRequirement.ownerSignatureRequirement == Core.OwnerSignature.Anyone, "RM: Wrong signature requirement");
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

        require(validateSignatures(_wallet, ex.signHash, signatures, sigRequirement.ownerSignatureRequirement), "RM: Invalid signatures");

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
        pure
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

    /**
    * @notice Returns ceil(a / b).
    */
    function ceil(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a / b;
        if (a % b == 0) {
            return c;
        } else {
            return c + 1;
        }
    }
    function _isOwner(Core.Wallet storage wallet_, address signer) internal view returns (bool) {
        return wallet_.owner == signer;
    }

    function validateSignatures(Core.Wallet storage wallet_, bytes32 _signHash, bytes memory _signatures, Core.OwnerSignature ownerSignatureRequirement) internal view returns (bool)
    {
        if (_signatures.length == 0) {
            return true;
        }
        address lastSigner = address(0);
        address[] memory guardians = wallet_.guardians;
        bool isGuardian;

        for (uint256 i = 0; i < _signatures.length / 65; i++) {
            address signer = recoverSigner(_signHash, _signatures, i);

            if (i == 0) {
                if (ownerSignatureRequirement == Core.OwnerSignature.Required) {
                    // First signer must be owner
                    if (_isOwner(wallet_, signer)) {
                        continue;
                    }
                    return false;
                } else if (ownerSignatureRequirement == Core.OwnerSignature.Optional) {
                    // First signer can be owner
                    if (_isOwner(wallet_, signer)) {
                        continue;
                    }
                }
            }

            if (signer <= lastSigner) {
                return false; // Signers must be different
            }
            lastSigner = signer;
            isGuardian = isGuardianAddress(guardians, signer);
            if (!isGuardian) {
                return false;
            }
        }
        return true;
    }
    
    function isGuardianAddress(address[] memory _guardians, address _guardian) internal pure returns (bool) {
        for (uint256 i = 0; i < _guardians.length; i++) {
            if (_guardian == _guardians[i]) {
                return true;
            }
        }
        return false;
    }
 
    function recoverSigner(bytes32 _signedHash, bytes memory _signatures, uint _index) internal pure returns (address) {
        uint8 v;
        bytes32 r;
        bytes32 s;
        // we jump 32 (0x20) as the first slot of bytes contains the length
        // we jump 65 (0x41) per signature
        // for v we load 32 bytes ending with v (the first 31 come from s) then apply a mask
        // solhint-disable-next-line no-inline-assembly
        assembly {
            r := mload(add(_signatures, add(0x20,mul(0x41,_index))))
            s := mload(add(_signatures, add(0x40,mul(0x41,_index))))
            v := and(mload(add(_signatures, add(0x41,mul(0x41,_index)))), 0xff)
        }
        require(v == 27 || v == 28, "Utils: bad v value in signature");

        address recoveredAddress = ecrecover(_signedHash, v, r, s);
        require(recoveredAddress != address(0), "Utils: ecrecover returned 0");
        return recoveredAddress;
    }

}