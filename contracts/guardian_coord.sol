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
       uint nonce;
       uint expires;
   }
    struct StartSession{
       uint duration;
       bytes[] sigs;
       uint nonce;
       uint expires;
   }

    event Debug(bytes32 signHash, address addr);

    using SignatureUtil for bytes32;
    bytes4 public constant START_RECOVERY_TYPEHASH = bytes4(keccak256(
        "startRecoverCommit(bytes32,bytes32)"
    ));
    bytes4 public constant START_SESSION_TYPEHASH = bytes4(keccak256(
        "startSession(uint256)"
    ));

    bytes4 public constant CANCEL_RECOVERY_TYPEHASH = bytes4(keccak256(
        "cancelRecovery(address)"
    ));

    // wallet address to operation
    mapping (address => StartRecoverCommit) recoveries;

    // wallet address to start session request
    mapping (address => StartSession) sessions;

    // comes from relayer - so check sig on chain
    function startRecovery(address wallet, bytes32 secretHash, bytes32 dataHash, uint nonce, bytes calldata sig) external {
        require(recoveries[wallet].expires < block.timestamp, "another recovery in progress");
        bytes32 signHash = getSignRecoveryHash(secretHash, dataHash, nonce);
        require(TOTPWallet(payable(wallet)).isValidSignature(signHash, sig) == 0x1626ba7e, "Only owner can start recovery");

        recoveries[wallet].nonce = nonce;
        recoveries[wallet].secretHash = secretHash;
        recoveries[wallet].dataHash = dataHash;
        recoveries[wallet].expires = block.timestamp + (24 hours);
    }

    function getSignRecoveryHash(bytes32 secretHash, bytes32 dataHash, uint nonce) internal pure returns (bytes32) {
        bytes32 signHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", keccak256(abi.encodePacked(nonce, abi.encodeWithSelector(START_RECOVERY_TYPEHASH, secretHash, dataHash)))));
        return signHash;
    }

    function validGuardian(address wallet, bytes32 signHash, bytes calldata sig) public view returns (bool) {
        address signer = signHash.recoverSigner(sig, 0);

        address[] memory guardians = TOTPWallet(payable(wallet)).getGuardians();
        
        for(uint i=0; i < guardians.length; i++) {
            if(guardians[i] == signer) {
                return true;
            }
        }
        return false;     
    }

    function submitRecoverySig(address wallet, bytes calldata sig) external {
        require(recoveries[wallet].expires > block.timestamp, "no recovery found");
        bytes32 signHash = getSignRecoveryHash(recoveries[wallet].secretHash, recoveries[wallet].dataHash, recoveries[wallet].nonce);
        require(validGuardian(wallet, signHash, sig), "Require valid guardian sig");
        recoveries[wallet].sigs.push(sig);        
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

    //
    // SESSIONS REQUESTS
    // 

    function getSignSessionHash(uint duration, uint nonce) internal pure returns (bytes32) {
        bytes32 signHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", keccak256(abi.encodePacked(nonce, abi.encodeWithSelector(START_SESSION_TYPEHASH, duration)))));
        return signHash;
    }

    function startSession(address wallet, uint duration, uint nonce, bytes calldata sig) external {
        require(sessions[wallet].expires < block.timestamp, "another session in progress");
        require(sessions[wallet].nonce < nonce, "nonce must be larger");
        bytes32 signHash = getSignSessionHash(duration,nonce);

        require(TOTPWallet(payable(wallet)).isValidSignature(signHash, sig) == 0x1626ba7e, "Only owner can start recovery");

        sessions[wallet].nonce = nonce;
        sessions[wallet].duration = duration;
        sessions[wallet].expires = block.timestamp + (24 hours);
    }    

    function submitSessionSig(address wallet, bytes calldata sig) external {
        require(sessions[wallet].expires > block.timestamp, "no session found");
        bytes32 signHash = getSignSessionHash(sessions[wallet].duration, sessions[wallet].nonce);
        require(validGuardian(wallet, signHash, sig), "Require valid guardian sig");
        sessions[wallet].sigs.push(sig);  
    }


    function getSessionSigs(address wallet) public view returns (bytes[] memory) {
        return sessions[wallet].sigs;
    }

    function hasEnoughSessionSigs(address wallet) public view returns (bool) {
        uint guardians = TOTPWallet(payable(wallet)).getGuardians().length;
        uint requiredSignatures = MetaTx.ceil(guardians, 2);
        return requiredSignatures == sessions[wallet].sigs.length;
    }    
}