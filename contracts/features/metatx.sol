// SPDX-License-Identifier: GPL-3.0-only

pragma solidity >=0.7.6;
pragma experimental ABIEncoderV2;

import "../core/wallet_data.sol";

library MetaTx {
    struct StackExtension {
        bytes32 signHash;
        bool success;
        bytes returnData;
    }
    event Invoked(address indexed target, uint indexed value, bytes data, bool success, bytes returnData);
    event SessionStarted(address indexed target, uint expires);

    function validateTx(
                        Core.Wallet storage _wallet,
                        bytes   calldata _data,
                        bytes   calldata signatures,
                        uint256 nonce,
                        uint256 gasPrice,
                        uint256 gasLimit,
                        address refundAddress,
                        Core.SignatureRequirement memory sigRequirement
                        ) public view {
        
        require(sigRequirement.requiredSignatures * 65 == signatures.length, "Wrong number of signatures");
        require(nonce > _wallet.nonce, "Expect nonce to be greater than last");


        StackExtension memory ex;

        ex.signHash = getSignHash(
            address(this),
            0,
            _data,
            nonce,
            gasPrice,
            gasLimit,
            address(0),
            refundAddress);

        if(sigRequirement.ownerSignatureRequirement == Core.OwnerSignature.Session) {
            require(_wallet.session.expires >= block.timestamp && _wallet.session.key == _wallet.owner, "No session");
            require(_wallet.session.active, "No active session");
            
            address signer = recoverSigner(ex.signHash, signatures, 0);
            require(signer == _wallet.owner, "Wrong key");
        } else {
            require(validateSignatures(_wallet, ex.signHash, signatures, sigRequirement.ownerSignatureRequirement), "RM: Invalid signatures");
        }
    }

    function startSession(Core.Wallet storage _wallet, uint duration) public {
        _wallet.session.key = _wallet.owner;
        _wallet.session.expires = uint(block.timestamp + duration);
        delete _wallet.session.guardiansApproved;
        if(_wallet.guardians.length == 0) {
            _wallet.session.active = true;
            emit SessionStarted(address(this), _wallet.session.expires);
        } else {
            // will turn on by guardian
            _wallet.session.active = false;
        }
    }
    
    function guardianApproveSession(Core.Wallet storage _wallet, bytes calldata, address guardian) public {
        require(_wallet.session.expires > block.timestamp, "no active session");

        for (uint256 i = 0; i < _wallet.session.guardiansApproved.length; i++) {
            if (_wallet.session.guardiansApproved[i] == guardian) {
                revert("duplicate guardian");                
            }
        }       
        _wallet.session.guardiansApproved.push(guardian);

        // count & finalize
        uint requiredSignatures = MetaTx.ceil(_wallet.guardians.length, 2);
        if(_wallet.session.guardiansApproved.length == requiredSignatures) {
            _wallet.session.active = true;
            emit SessionStarted(address(this), _wallet.session.expires);
        }
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
                    uint(block.chainid),
                    _nonce,
                    _gasPrice,
                    _gasLimit,
                    _refundToken,
                    _refundAddress))
        ));
    }


    /**
     * @notice Performs a generic transaction.
     * @param _target The address for the transaction.
     * @param _value The value of the transaction.
     * @param _data The data of the transaction.
     */
    function invoke(address _target, uint _value, bytes calldata _data) internal returns (bytes memory _result) {
        bool success;
        (success, _result) = _target.call{value: _value}(_data);

        emit Invoked(_target, _value, _data, success, _result);

        if (!success) {
            // solhint-disable-next-line no-inline-assembly
            assembly {
                returndatacopy(0, 0, returndatasize())
                revert(0, returndatasize())
            }
        }
    }
    
    /**
    * @notice Helper method to parse data and extract the method signature.
    */
    function functionPrefix(bytes memory _data) internal pure returns (bytes4 prefix) {
        require(_data.length >= 4, "Utils: Invalid functionPrefix");
        // solhint-disable-next-line no-inline-assembly
        assembly {
            prefix := mload(add(_data, 0x20))
        }
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