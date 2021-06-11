// SPDX-License-Identifier: GPL-3.0-only

pragma solidity ^0.7.6;
import "../core/wallet_data.sol";

library Recovery {

    bytes32 public constant START_RECOVERY_TYPEHASH = keccak256(
        "startRecovery(bytes16, uint8, uint, uint)"
    );

    /* 1 of 1 (HOTP)
     * 2 of 2 (HOTP + Guardian)
     * 2 of 3 (2 guardians or HOTP + Guardian)
     */
    function startRecovery(Core.Wallet storage wallet_, address newOwner, bytes32[] calldata confirmMaterial) public {
        if (confirmMaterial.length != 0) {
            require(_reduceConfirmMaterial(confirmMaterial) == wallet_.rootHash, "INCORRECT PROOF");
            wallet_.pendingRecovery = Core.RecoveryInfo(newOwner, block.timestamp + 86400);
            wallet_.counter = wallet_.counter + 1;
        }

        // uint requiredSignatures = ceil(wallet_.guardians.length, 2);
        // require(requiredSignatures * 65 == signatures_.length, "Wrong number of signatures");

        // bytes32 signHash = getSignHash(rootHash_, merkelHeight_, timePeriod_, timeOffset_);
        // require(validateSignatures(wallet_, signHash, signatures_), "Invalid signatures");

        // queue it for next 24hrs
        //wallet_.recovery = Core.RecoveryInfo(rootHash_, merkelHeight_, timePeriod_, timeOffset_, block.timestamp + 86400);
    }

    function startRecovery(Core.Wallet storage wallet_, address newOwner) public {
        require(wallet_.guardians.length >= 3, "ONLY_3_GUARDIANS_OR_MORE_CAN_START");
    }

    function finalizeRecovery(Core.Wallet storage wallet_) public {
        require(wallet_.pendingRecovery.expiration > 0, "no pending recovery");
        require(uint64(block.timestamp) > wallet_.pendingRecovery.expiration, "ongoing recovery period");
        wallet_.owner = wallet_.pendingRecovery.newOwner;
        wallet_.pendingRecovery = Core.RecoveryInfo(address(0),0);
    }

    function approveRecovery(Core.Wallet storage wallet_, address newOwner) public {
        
    }

    //
    // Private functions
    //

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
    
    function isGuardianAddress(address[] memory _guardians, address _guardian) internal view returns (bool) {
        for (uint256 i = 0; i < _guardians.length; i++) {
            if (_guardian == _guardians[i]) {
                return true;
            }
        }
        return false;
    }

    function getSignHash(bytes16 rootHash_, uint8 merkelHeight_, uint timePeriod_, uint timeOffset_)
        internal
        view
        returns (bytes32)
    {

        bytes memory encodedData = abi.encode(
            START_RECOVERY_TYPEHASH,
            rootHash_,
            merkelHeight_,
            timePeriod_,
            timeOffset_
        );

        return keccak256(
            abi.encodePacked(
                "\x19Ethereum Signed Message:\n32",
                keccak256(encodedData)
        ));
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

    //
    // HOTP Verification functions
    //
    function _deriveChildTreeIdx(uint merkelHeight, bytes32 sides) private view returns (uint32) {
        uint32 derivedIdx = 0;
        for(uint8 i = 0 ; i < merkelHeight ; i++){
            if(byte(0x01) == sides[i]){
                derivedIdx |=  uint32(0x01) << i;
            }
        }
        return derivedIdx;
    }
    
    function _reduceConfirmMaterial(bytes32[] memory confirmMaterial) public returns (bytes32) {
        //  and then compute h(OTP) to get the leaf of the tree
        confirmMaterial[0] = keccak256(abi.encodePacked(confirmMaterial[0]));
        bytes32 sides = confirmMaterial[confirmMaterial.length - 1];
        return _reduceAuthPath(confirmMaterial, sides);
    }

    function _reduceAuthPath(bytes32[] memory authPath, bytes32 sides) internal returns (bytes32){
        for (uint8 i = 1; i < authPath.length - 1; i++) {
            if(byte(0x00) == sides[i - 1]){
                authPath[0] = keccak256(abi.encodePacked(authPath[0], authPath[i]));
            } else{
                authPath[0] = keccak256(abi.encodePacked(authPath[i], authPath[0]));
            }
        }
        //emit DebugEvent(authPath[0]);
        return authPath[0];
    }
    
}