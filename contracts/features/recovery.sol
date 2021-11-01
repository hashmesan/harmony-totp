// SPDX-License-Identifier: GPL-3.0-only

pragma solidity >=0.7.6;
import "../core/wallet_data.sol";
import "./metatx.sol";

library Recovery {

    event WalletRecovered(address newOner, uint counter);

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
    
    function startRecoveryReveal(Core.Wallet storage wallet, address newOwner, bytes32[] calldata confirmMaterial) public {
        bytes32 secretHash = keccak256(abi.encodePacked(confirmMaterial[0]));
        require(wallet.commitHash[secretHash].blockNumber != 0, "NO COMMIT");
        require(wallet.commitHash[secretHash].revealed == false, "COMMIT ALREADY REVEALED");
        require(block.number - wallet.commitHash[secretHash].blockNumber < 15, "Commit is too old");

        bytes32 hash = keccak256(abi.encodePacked(newOwner, confirmMaterial[0]));
        require(hash == wallet.commitHash[secretHash].dataHash, "Datahash does not match");

        wallet.commitHash[secretHash].revealed = true;
        wallet.owner = newOwner;
        wallet.counter = wallet.counter + 1;
        emit WalletRecovered(newOwner, wallet.counter);
    }

    //
    // HOTP Verification functions
    //

    function isValidHOTP(Core.Wallet storage wallet, bytes32[] memory confirmMaterial) public view {
        bytes32 reduced = _reduceConfirmMaterial(confirmMaterial);
        uint32 counterProvided = _deriveChildTreeIdx(wallet.merkelHeight, confirmMaterial[confirmMaterial.length-1]);
        require(counterProvided >= wallet.counter, "Bad otp counter");

        // Google Authenticator doesn't allow custom counter or change counter back; so we must allow room to fudge
        // allow some room if the counters were skipped at some point
        require(counterProvided - wallet.counter  < 50, "Counter more than 50 steps");

        bool foundMatch = false;
        for (uint32 i = 0; i < wallet.rootHash.length; i++) {
            if(reduced==wallet.rootHash[i]) {
                foundMatch = true;
            }
        }
        require(foundMatch, "UNEXPECTED PROOF");        
    }

    function _deriveChildTreeIdx(uint merkelHeight, bytes32 sides) internal pure returns (uint32) {
        uint32 derivedIdx = 0;
        for(uint8 i = 0 ; i < merkelHeight ; i++){
            if(bytes1(0x01) == sides[i]){
                derivedIdx |=  uint32(0x01) << i;
            }
        }
        return derivedIdx;
    }
    
    function _reduceConfirmMaterial(bytes32[] memory confirmMaterial) internal pure returns (bytes32) {
        //  and then compute h(OTP) to get the leaf of the tree
        confirmMaterial[0] = keccak256(abi.encodePacked(confirmMaterial[0]));
        bytes32 sides = confirmMaterial[confirmMaterial.length - 1];
        return _reduceAuthPath(confirmMaterial, sides);
    }

    function _reduceAuthPath(bytes32[] memory authPath, bytes32 sides) internal pure returns (bytes32){
        for (uint8 i = 1; i < authPath.length - 1; i++) {
            if(bytes1(0x00) == sides[i - 1]){
                authPath[0] = keccak256(abi.encodePacked(authPath[0], authPath[i]));
            } else{
                authPath[0] = keccak256(abi.encodePacked(authPath[i], authPath[0]));
            }
        }
        //emit DebugEvent(authPath[0]);
        return authPath[0];
    }
    
}