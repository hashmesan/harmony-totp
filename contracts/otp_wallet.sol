// SPDX-License-Identifier: GPL-3.0-only

pragma solidity >=0.7.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/utils/Address.sol";

import "./core/wallet_data.sol";
import "./features/guardians.sol";
import "./features/daily_limit.sol";
import "./features/recovery.sol";
import "./features/metatx.sol";
import "./features/name_service.sol";

contract TOTPWallet is IERC721Receiver, IERC1155Receiver {

    using Address for address payable;
    using Guardians for Core.Wallet;
    using DailyLimit for Core.Wallet;
    using Recovery for Core.Wallet;
    using MetaTx for Core.Wallet;
    using NameService for Core.Wallet;

    // DATA LAYOUT - ALWAYS ADD NEW VAR TO LAST

    address masterCopy;
    Core.Wallet public wallet;
    bool internal isImplementationContract;
    uint public constant version = 4;
    bytes4 private constant _INTERFACE_ID_ERC1271 = 0x1626ba7e;

    // END OF DATA LAYOUT
    struct Call {
        address to;
        uint256 value;
        bytes data;
    }

    event Deposit(address indexed sender, uint value);
    event WalletUpgraded(address newImpl);
    event Initialized(address wallet, address refundAddress, uint refundFee);
    event TransactionExecuted(bool indexed success, bytes returnData, bytes32 signedHash, address refundAddress, uint refundFee);

    constructor() {
        isImplementationContract = true;
    }

    modifier disableInImplementationContract
    {
        require(!isImplementationContract, "DISALLOWED");
        _;
    }

    // keep methods <= 8 parameters of get stack to deep
    function initialize(
        address              resolver_,
        string[3]   calldata domainAndHashId_, // empty means no registration
        address             owner_, 
        bytes32[] calldata    rootHash_, 
        uint8               merkelHeight_, 
        address payable     drainAddr_, 
        uint                dailyLimit_,
        address             feeRecipient,
        uint                feeAmount
        ) external 
        // disableInImplementationContract()
    {
        wallet.resolver = resolver_;

        //emit DebugEvent256(address(this).balance);
        require(wallet.owner == address(0), "NOT_ALLOWED");
        require(address(this).balance >= feeAmount, "NOT_ENOUGH_TO_PAY_FEE");

        wallet.owner = owner_;
        for (uint32 i = 0; i < rootHash_.length; i++) {
             wallet.rootHash.push(rootHash_[i]);
        }        
        wallet.merkelHeight = merkelHeight_;
        wallet.drainAddr = drainAddr_;
        wallet.dailyLimit.limit = dailyLimit_;

        // STACK TOO DEEP
        if(bytes(domainAndHashId_[0]).length > 0) {
            this.registerENS(domainAndHashId_[0], domainAndHashId_[1], 200000000);
        }

        if (feeRecipient != address(0)) {
            payable(feeRecipient).sendValue(feeAmount);
            emit Initialized(address(this), feeRecipient, feeAmount);
        }  
        
        wallet.hashStorageID = domainAndHashId_[2];        
    }   

    function registerENS(string calldata subdomain, string calldata domain, uint duration) external onlyFromWalletOrOwnerWhenUnlocked() {
        wallet.registerENS(subdomain, domain, duration);
    }

    modifier onlyFromWalletOrOwnerWhenUnlocked()
    {
        require(
            msg.sender == address(this) ||
            (msg.sender == wallet.owner && !wallet.locked),
             "NOT_FROM_WALLET_OR_OWNER_OR_WALLET_LOCKED"
        );
        _;
    }

    modifier onlySelf() {
        require(msg.sender == address(this), "must be metatx");
        _;
    }

    modifier onlyGuardian() {
        require(MetaTx.isGuardianAddress(wallet.guardians, msg.sender), "must be guardian");
        _;
    }

    // confirmMaterial contains OTP + intermediatory hashes + sides
    modifier onlyValidTOTP(bytes32[] memory confirmMaterial) 
    {
        // revert if false
        wallet.isValidHOTP(confirmMaterial);
        _;
    }

    function isRestrictedMethod(bytes4 methodId) internal pure returns (bool) {
        return (methodId == TOTPWallet.upgradeMasterCopy.selector ||
            methodId == TOTPWallet.setDailyLimit.selector ||
            methodId == TOTPWallet.revokeGuardian.selector||
            methodId == TOTPWallet.setDrainAddress.selector);
    }

    function getRequiredSignatures(bytes calldata _data) public view returns (uint8, Core.OwnerSignature) {
        bytes4 methodId = MetaTx.functionPrefix(_data);

        if(methodId == TOTPWallet.multiCall.selector ||
            methodId == TOTPWallet.addGuardian.selector ||
            methodId == TOTPWallet.clearSession.selector||
            methodId == TOTPWallet.setHashStorageId.selector) {
            return (1, Core.OwnerSignature.Required);
        }

        // these will be called on multiCallWithSession with guardians
        if(wallet.guardians.length == 0) {
            if(isRestrictedMethod(methodId)) {
                return (1, Core.OwnerSignature.Required); 
            }
        } else {
            if(methodId == TOTPWallet.startSession.selector) {          
                // owner + 1 guardian   => require 2
                // owner + 2 guardian   => require 2
                // owner + 3 guardian   => require 3            
                return (1, Core.OwnerSignature.Required);  
            }
            if(methodId == TOTPWallet.multiCallWithSession.selector) {
                return (1, Core.OwnerSignature.Session); 
            }
        }

        // 1 of 1 = 0 sig
        // 2 of 2 = 1 sig + HOTP
        // 2 of 3 = 1 sig + HOTP
        // we'll check for additional guardian later
        if(methodId == TOTPWallet.startRecoverCommit.selector) {            
            return (0, Core.OwnerSignature.Disallowed);            
        }
        if(methodId == TOTPWallet.startRecoveryReveal.selector) {
            return (0, Core.OwnerSignature.Disallowed);            
        }
        
        revert("unknown method/try session");
    }    

    function executeMetaTx(
            bytes   calldata data,
            bytes   calldata signatures, 
            uint256 nonce,
            uint256 gasPrice,
            uint256 gasLimit,
            address /*refundToken*/,
            address payable refundAddress            
        ) external 
    {
        uint gasLeft = gasleft();        
        Core.SignatureRequirement memory sigRequirement;        
        (sigRequirement.requiredSignatures, sigRequirement.ownerSignatureRequirement) = getRequiredSignatures(data);        

        MetaTx.validateTx(wallet, data, signatures, nonce, gasPrice, gasLimit, refundAddress, sigRequirement);

        bool success;
        bytes memory returnData;
        (success, returnData) = address(this).call(data);

        if(gasPrice > 0 && success && refundAddress != address(0x0)) {
            uint gasUsed = gasLeft - gasleft() + 70000; //35k overhead
            refundAddress.transfer(gasUsed);
            emit TransactionExecuted(success, returnData, 0x0, refundAddress, gasUsed);
        } else {
            emit TransactionExecuted(success, returnData, 0x0, refundAddress, 0);        
        }
    }

    function multiCall(Call[] calldata _transactions) external onlyFromWalletOrOwnerWhenUnlocked() returns (bytes[] memory) {
        bytes[] memory results = new bytes[](_transactions.length);
        for(uint i = 0; i < _transactions.length; i++) {
            bytes calldata data = _transactions[i].data;
            uint value = _transactions[i].value;
            
            if(wallet.guardians.length > 0) {
                require(data.length < 4 || !isRestrictedMethod(MetaTx.functionPrefix(data)),"restricted methods"); 
                require(wallet.isUnderLimit(value), "over limit");
                wallet.dailyLimit.spentToday += value;
            }
            results[i] = MetaTx.invoke(_transactions[i].to, value, data);
        }
        return results;
    }

    function multiCallWithSession(Call[] calldata _transactions) external onlySelf() returns (bytes[] memory) {
        bytes[] memory results = new bytes[](_transactions.length);
        for(uint i = 0; i < _transactions.length; i++) {
            results[i] = MetaTx.invoke(_transactions[i].to, _transactions[i].value, _transactions[i].data);
        }
        return results;
    }

    /**
     * startSession can only be started by majority of guardians
     */
    function startSession(uint duration) external onlySelf() {
        MetaTx.startSession(wallet, duration);
    }

    function clearSession()  external onlyFromWalletOrOwnerWhenUnlocked() {
        wallet.session.expires = 0;
    }

    function getOwner()  public
        view
        returns (address) 
    {
        return wallet.owner;  
    }

    function getCounter()  public
        view
        returns (uint) 
    {
        return wallet.counter;
    }    

    function setHashStorageId(string calldata id) external  onlyFromWalletOrOwnerWhenUnlocked()  {
        wallet.hashStorageID = id;
    }

    function getHashStorageId() public view  returns (string memory){
        return wallet.hashStorageID;
    }
    
    function getRootHashes()
         public
         view
         returns (bytes32[] memory )
     {
         return wallet.rootHash;
     }

    function setDrainAddress(address payable addr) external onlySelf() {
        wallet.drainAddr = addr;
    }

    function setDailyLimit(uint amount) external onlySelf() {
        wallet.dailyLimit.limit = amount;
    }
    //
    // Guardians functions
    //
    function addGuardian(address guardian)
        external
        onlyFromWalletOrOwnerWhenUnlocked()
    {
        wallet.addGuardian(guardian);
    }

    function revokeGuardian(address guardian)
        external
        onlySelf()
    {
        wallet.revokeGuardian(guardian);
    }

    function getGuardians()
         public
         view
         returns (address[] memory )
     {
         return wallet.guardians;
     }

    //
    // Recovery functions
    //
    // In default setup with only HOTP setup, wallet recovery is done on its own.
    // In a more secure setup with HOTP + guardians, HOTP is considered as 1 guardian.
    //
    // Relay/or other coordinating system will coordinate the signatures collections 
    // from guardian and submit along with the HOTP together. In rare case, HOTP may be ommitted
    // when greater than 2 guardians can recover without HOTP.
    function startRecoverGuardianOnly(address newOwner_) onlyGuardian() external {
        // move into recovery state
        wallet.startRecoverGuardianOnly(newOwner_);
    }

    // recover with combination of commithash and signatures
    function startRecoverCommit(bytes32 secretHash, bytes32 dataHash)  onlySelf() external {
        require(wallet.commitHash[secretHash].blockNumber == 0, "COMMIT ALREADY EXIST");
        wallet.commitHash[secretHash] = Core.CommitInfo(dataHash, address(0), block.number, false);
    }

    function startRecoveryReveal(address newOwner, bytes32[] calldata confirmMaterial)  onlySelf() onlyValidTOTP(confirmMaterial) external {
        wallet.startRecoveryReveal(newOwner, confirmMaterial);
    }

    function guardianApprove(bytes calldata data_) external onlyGuardian() {
        bytes4 methodId = MetaTx.functionPrefix(data_);
        if(methodId == this.startRecoverCommit.selector || methodId == this.startRecoverGuardianOnly.selector) {
            bytes32 secretHash = abi.decode(data_[4:36], (bytes32));
            Recovery.guardianApproveRecovery(wallet, secretHash, msg.sender);            
        } else if(methodId == this.startSession.selector) {
            MetaTx.guardianApproveSession(wallet, data_, msg.sender);
        } else {
            revert("no recognized function");
        }
    }

    function upgradeMasterCopy(address newMasterCopy) external onlySelf() {
        masterCopy = newMasterCopy;
        emit WalletUpgraded(newMasterCopy);
    }

    function getMasterCopy() public view returns (address) {
        return masterCopy;
    }

    //
    // ERC1155 support
    //
    function onERC1155Received(address,address,uint256,uint256,bytes calldata) external pure override returns (bytes4){
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(address, address, uint256[] calldata, uint256[] calldata, bytes calldata) external pure override returns (bytes4){
        return this.onERC1155BatchReceived.selector;
    }

    function supportsInterface(bytes4 interfaceID) external override pure returns (bool) {
        return interfaceID == this.supportsInterface.selector ||
        interfaceID == this.onERC1155Received.selector ||
        interfaceID == this.onERC721Received.selector ||
        interfaceID == _INTERFACE_ID_ERC1271;
    }

    function onERC721Received(address,address,uint256,bytes calldata) external pure override returns (bytes4){
        return this.onERC721Received.selector;
    }

    /**
    * @notice Implementation of EIP 1271.
    * Should return whether the signature provided is valid for the provided data.
    * @param _msgHash Hash of a message signed on the behalf of address(this)
    * @param _signature Signature byte array associated with _msgHash
    */
    function isValidSignature(bytes32 _msgHash, bytes memory _signature) external view returns (bytes4) {
        require(_signature.length == 65, "TM: invalid signature length");
        require(MetaTx.validateSignatures(wallet, _msgHash, _signature, Core.OwnerSignature.Required), "Invalid owner signature");
        return _INTERFACE_ID_ERC1271;
    }

    //
    // Utility functions
    //

    /// @dev Fallback function allows to deposit ether.
    receive() external payable {
        /*
        if (msg.value > 0) {
            if(msg.sender == wallet.drainAddr && msg.value == 1 ether) {
                uint amount = address(this).balance;
                (bool success,) = wallet.drainAddr.call{value: amount, gas: 100000}("");
                require(success, "Receive: External call failed");
            }
            emit Deposit(msg.sender, msg.value);
        }*/
    }

}
