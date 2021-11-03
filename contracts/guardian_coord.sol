// contracts/GLDToken.sol
// SPDX-License-Identifier: MIT

pragma solidity >=0.7.6;

import "./external/signatureutil.sol";
import "./otp_wallet.sol";

contract GuardianCoordinator {
   struct StartRecoverCommit{
       bytes32 secretHash;
       bytes32 dataHash;
       bytes[] sigs;
       uint expires;
   }
    event Debug(bytes32 signHash, address addr);

    using SignatureUtil for bytes32;
    bytes4 public constant START_RECOVERY_TYPEHASH = bytes4(keccak256(
        "startRecoverCommit(bytes32,bytes32)"
    ));
    bytes32 public constant CANCEL_RECOVERY_TYPEHASH = keccak256(
        "cancelRecovery(address wallet)"
    );

    // guardian address to operation
    mapping (address => StartRecoverCommit) recoveries;

    // comes from relayer - so check sig on chain
    function startRecovery(address wallet, bytes32 secretHash, bytes32 dataHash, bytes calldata sig) external {
        require(recoveries[wallet].expires < block.timestamp, "another recovery in progress");
        bytes32 signHash = getSignRecoveryHash(secretHash, dataHash);
        emit Debug(START_RECOVERY_TYPEHASH, address(0));
        require(TOTPWallet(payable(wallet)).isValidSignature(signHash, sig) == 0x1626ba7e, "Only owner can start recovery");

        recoveries[wallet].secretHash = secretHash;
        recoveries[wallet].dataHash = dataHash;
        recoveries[wallet].expires = block.timestamp + (24 hours);
    }

    function getSignRecoveryHash(bytes32 secretHash, bytes32 dataHash) internal pure returns (bytes32) {
        bytes32 signHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", keccak256(abi.encodeWithSelector(START_RECOVERY_TYPEHASH, secretHash, dataHash))));
        return signHash;
    }
    function submitRecoverySig(address wallet, bytes calldata sig) external {
        require(recoveries[wallet].expires > block.timestamp, "no recovery found");
        bytes32 signHash = getSignRecoveryHash(recoveries[wallet].secretHash, recoveries[wallet].dataHash);
        address signer = signHash.recoverSigner(sig, 0);

        address[] memory guardians = TOTPWallet(payable(wallet)).getGuardians();
        
        for(uint i=0; i < guardians.length; i++) {
            if(guardians[i] == signer) {
                recoveries[wallet].sigs.push(sig);
                return;
            }
        }
        require(false, "guardian not found");
    }

    function cancelRecovery(address wallet, bytes calldata sig) external {
        // if it's the owner, cancel it
        bytes32 signHash = keccak256(abi.encodePacked(CANCEL_RECOVERY_TYPEHASH, wallet));
        require(TOTPWallet(payable(wallet)).isValidSignature(signHash, sig) == 0x1626ba7e, "Only owner can start recovery");
        recoveries[wallet].expires = 0;
    }

    function getRecoverySigs(address wallet) public view returns (bytes[] memory) {
        return recoveries[wallet].sigs;
    }

    function hasEnoughRecoverySigs(address wallet) public view returns (bool) {
        uint guardians = TOTPWallet(payable(wallet)).getGuardians().length;
        uint requiredSignatures = MetaTx.ceil(guardians, 2);
        return requiredSignatures == recoveries[wallet].sigs.length;
    }

    function bytesToBytes32(uint _offst, bytes memory  _input, bytes32 _output) internal pure {
        assembly {
            mstore(_output , add(_input, _offst))
            mstore(add(_output,32) , add(add(_input, _offst),32))
        }
    }
    
}