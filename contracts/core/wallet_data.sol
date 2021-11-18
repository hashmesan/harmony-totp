// SPDX-License-Identifier: GPL-3.0-only

pragma solidity >=0.7.6;

library Core {
    struct GuardianInfo {
        bool exists;
        uint128 index;
    }   

    struct RecoveryInfo {
        bytes32 secretHash;
        bytes32 dataHash;
        address[] guardiansApproved;
    }

    struct CommitInfo {
        bytes32 dataHash;
        address newOwner;
        uint blockNumber;
        bool revealed;
    }

    struct DailyLimit {
        uint limit;
        uint lastDay;
        uint spentToday;
    }

    enum OwnerSignature {
        Anyone,             // Anyone
        Required,           // Owner required
        Optional,           // Owner and/or guardians
        Disallowed,         // Guardians only
        Session             // Session only
    }

    struct SignatureRequirement {
        uint8 requiredSignatures;
        OwnerSignature ownerSignatureRequirement;
    }

    struct Session {
        address key;
        uint expires;
        bool active;
        address[] guardiansApproved;
    }

    struct Wallet { 
        address owner;
        bool locked;

        bytes32[] rootHash;
        uint8 merkelHeight;
        uint counter;
        address payable drainAddr;

        // the list of guardians
        address[] guardians;
        // the info about guardians
        mapping (address => GuardianInfo) info;
        
        // Maps wallet to session
        Session session;

        // daily limit
        DailyLimit dailyLimit;

        
        // recovery
        string hashStorageID;
        RecoveryInfo pendingRecovery;
        mapping(bytes32 => CommitInfo) commitHash;

        //
        address resolver;
        uint nonce;
    }
}
