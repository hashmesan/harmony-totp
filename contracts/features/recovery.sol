// SPDX-License-Identifier: GPL-3.0-only

pragma solidity ^0.7.6;
import "../core/wallet_data.sol";
import "./metatx.sol";

library Recovery {

    bytes32 public constant START_RECOVERY_TYPEHASH = keccak256(
        "startRecovery(bytes16, uint8, uint, uint)"
    );

    /* 1 of 1 (HOTP)
     * 2 of 2 (HOTP + Guardian)
     * 2 of 3 (2 guardians or HOTP + Guardian)
     */
    function startRecovery(Core.Wallet storage wallet_, address newOwner) public {
        // queue it for next 24hrs
        wallet_.pendingRecovery = Core.RecoveryInfo(newOwner, block.timestamp + 86400);
    }

    function finalizeRecovery(Core.Wallet storage wallet_) public {
        require(wallet_.pendingRecovery.expiration > 0, "no pending recovery");
        require(uint64(block.timestamp) > wallet_.pendingRecovery.expiration, "ongoing recovery period");
        wallet_.owner = wallet_.pendingRecovery.newOwner;
        wallet_.pendingRecovery = Core.RecoveryInfo(address(0),0);
    }

    //
    // Private functions
    //


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