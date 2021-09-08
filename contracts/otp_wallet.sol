// SPDX-License-Identifier: GPL-3.0-only

pragma solidity >=0.7.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
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
    Core.UserData public userData;
    bool internal isImplementationContract;


    // END OF DATA LAYOUT
    struct Call {
        address to;
        uint256 value;
        bytes data;
    }

    event DebugEvent(bytes16 data);
    event DebugEvent32(bytes32 data);
    event DebugEventN(uint32 data);
    event DebugEventA(address data);    
    event DebugEvent256(uint256 data);
    event WalletTransfer(address to, uint amount);
    event Deposit(address indexed sender, uint value);
    event WalletUpgraded(address newImpl);
    event TransactionExecuted(bool indexed success, bytes returnData, bytes32 signedHash);
    event Invoked(address indexed target, uint indexed value, bytes data, bool success, bytes returnData);

    constructor() {
        isImplementationContract = true;
    }

    modifier disableInImplementationContract
    {
        require(!isImplementationContract, "DISALLOWED_ON_IMPLEMENTATION_CONTRACT");
        _;
    }

    // keep methods <= 8 parameters of get stack to deep
    function initialize(
        address              resolver_,
        string[2]   calldata domain_, // empty means no registration
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
        require(wallet.owner == address(0), "INITIALIZED_ALREADY");
        require(address(this).balance >= feeAmount, "NOT ENOUGH TO PAY FEE");

        wallet.owner = owner_;
        for (uint32 i = 0; i < rootHash_.length; i++) {
             wallet.rootHash.push(rootHash_[i]);
        }        
        wallet.merkelHeight = merkelHeight_;
        wallet.drainAddr = drainAddr_;
        wallet.dailyLimit = dailyLimit_;

        // STACK TOO DEEP
        if(bytes(domain_[0]).length > 0) {
            this.registerENS(domain_[0], domain_[1], 60 * 60 * 24 * 365);
        }

        if (feeRecipient != address(0)) {
            payable(feeRecipient).sendValue(feeAmount);
        }        
    }   

    function initializeUserData(
        string  calldata   password_,
        string  calldata   email_,
        string  calldata   countryOfResidence_
    ) external {
        userData.password = password_;
        userData.email = email_;
        userData.countryOfResidence = countryOfResidence_;
    }
    

    function registerENS(string calldata subdomain, string calldata domain, uint duration) external onlyFromWalletOrOwnerWhenUnlocked() {
        wallet.registerENS(subdomain, domain, duration);
    }

    modifier onlyModule() {
        require(msg.sender == address(this));
        _;        
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

    // confirmMaterial contains OTP + intermediatory hashes + sides
    modifier onlyValidTOTP(bytes32[] memory confirmMaterial) 
    {
        bytes32 reduced = Recovery._reduceConfirmMaterial(confirmMaterial);
        uint32 counterProvided = Recovery._deriveChildTreeIdx(wallet.merkelHeight, confirmMaterial[confirmMaterial.length-1]);
        require(counterProvided >= wallet.counter, "Provided counter must be greater or same");

        // Google Authenticator doesn't allow custom counter or change counter back; so we must allow room to fudge
        // allow some room if the counters were skipped at some point
        require(counterProvided - wallet.counter  < 50, "Provided counter must not be more than 20 steps");

        bool foundMatch = false;
        for (uint32 i = 0; i < wallet.rootHash.length; i++) {
            if(reduced==wallet.rootHash[i]) {
                foundMatch = true;
            }
        }
        require(foundMatch, "UNEXPECTED PROOF");
        _;
    }

    function getRequiredSignatures(bytes calldata _data) public view returns (uint8, Core.OwnerSignature) {
        bytes4 methodId = functionPrefix(_data);

        if(methodId == TOTPWallet.makeTransfer.selector ||
            methodId == TOTPWallet.multiCall.selector ||
            methodId == TOTPWallet.addGuardian.selector ||
            methodId == TOTPWallet.revokeGuardian.selector||
            methodId == TOTPWallet.upgradeMasterCopy.selector ||
            methodId == TOTPWallet.setDailyLimit.selector ||
            methodId == TOTPWallet.setDrainAddress.selector ||
            methodId == TOTPWallet.setHashStorageId.selector) {
            return (1, Core.OwnerSignature.Required);
        }

        if(methodId == TOTPWallet.startRecoverGuardianOnly.selector) {
            require(wallet.guardians.length >= 2, "NOT_MEET_MINIMUM_GUARDIANS");
            uint requiredSignatures = MetaTx.ceil(wallet.guardians.length, 2);
            return (uint8(requiredSignatures), Core.OwnerSignature.Disallowed);            
        }

        // 1 of 1 = 0 sig
        // 2 of 2 = 1 sig + HOTP
        // 2 of 3 = 1 sig + HOTP
        if(methodId == TOTPWallet.startRecoverCommit.selector) {
            uint requiredSignatures = MetaTx.ceil(wallet.guardians.length, 2);
            return (uint8(requiredSignatures), Core.OwnerSignature.Disallowed);            
        }
        if(methodId == TOTPWallet.startRecoveryReveal.selector) {
            return (0, Core.OwnerSignature.Disallowed);            
        }
        
        revert("unknown method");
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
        }
        emit TransactionExecuted(success, returnData, 0x0);        
    }

    function multiCall(Call[] calldata _transactions) external onlyFromWalletOrOwnerWhenUnlocked() returns (bytes[] memory) {
        bytes[] memory results = new bytes[](_transactions.length);
        for(uint i = 0; i < _transactions.length; i++) {
            results[i] = invoke(_transactions[i].to, _transactions[i].value, _transactions[i].data);
        }
        return results;
    }

    function makeTransfer(address payable to, uint amount) external onlyFromWalletOrOwnerWhenUnlocked() 
    {
        require(wallet.isUnderLimit(amount), "over withdrawal limit");
        require(address(this).balance >= amount, "not enough balance");  

        wallet.spentToday += amount;
        //to.transfer(amount);
        (bool success,) = to.call{value: amount, gas: 100000}("");
        require(success, "MakeTransfer: External call failed");
        emit WalletTransfer(to, amount);             
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

    function setDrainAddress(address payable addr) external onlyFromWalletOrOwnerWhenUnlocked() {
        wallet.drainAddr = addr;
    }

    function setDailyLimit(uint amount) external onlyFromWalletOrOwnerWhenUnlocked() {
        wallet.dailyLimit = amount;
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
        onlyFromWalletOrOwnerWhenUnlocked()
    {
        wallet.revokeGuardian(guardian);
    }

    function isGuardian(address addr)
         public
         view
         returns (bool)
     {
         return wallet.isGuardian(addr);
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
    function startRecoverGuardianOnly(address newOwner_) onlySelf() external {
        // move into recovery state
        wallet.startRecovery(newOwner_);
    }

    // recover with combination of commithash and signatures
    function startRecoverCommit(bytes32 commitHash)  onlySelf() external {
        wallet.commitHash[commitHash] = true;
    }

    function startRecoveryReveal(address newOwner, bytes32[] calldata confirmMaterial)  onlySelf() onlyValidTOTP(confirmMaterial) external {
        bytes32 hash = keccak256(abi.encodePacked(newOwner, confirmMaterial[0]));
        require(wallet.commitHash[hash], "NO COMMIT");

        //wallet.startRecovery(newOwner);
        wallet.owner = newOwner;

        delete wallet.commitHash[hash];
        wallet.counter = wallet.counter + 1;
    }

    function isRecovering() external view returns (bool) {
        return wallet.pendingRecovery.expiration != 0;
    }

    function cancelRecovery() external onlyFromWalletOrOwnerWhenUnlocked() {
        wallet.pendingRecovery = Core.RecoveryInfo(address(0),0);
    }

    function getRecovery() external view returns (address,uint) {
        return (wallet.pendingRecovery.newOwner, wallet.pendingRecovery.expiration);
    }

    function finalizeRecovery() external {
        wallet.finalizeRecovery();
    }

    function upgradeMasterCopy(address newMasterCopy) external onlySelf() {
        masterCopy = newMasterCopy;
        emit WalletUpgraded(newMasterCopy);
    }

    function getMasterCopy()
        public
        view
        returns (address)
    {
        return masterCopy;
    }

    //
    // ERC1155 support
    //
    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4){
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(address operator, address from, uint256[] calldata ids, uint256[] calldata values, bytes calldata data) external view override returns (bytes4){
        for (uint32 i = 0; i < ids.length; i++) {
            this.onERC1155Received(operator, from, ids[i], values[i], data);
        }
        return this.onERC1155BatchReceived.selector;
    }

    function supportsInterface(bytes4 interfaceID) external override pure returns (bool) {
        return interfaceID == this.supportsInterface.selector ||
        interfaceID == this.onERC1155Received.selector ||
        interfaceID == this.onERC721Received.selector;
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4){
        return this.onERC721Received.selector;
    }

    //
    // Utility functions
    //

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
    /// @dev Fallback function allows to deposit ether.
    receive() external payable {
        if (msg.value > 0) {
            if(msg.sender == wallet.drainAddr && msg.value == 1 ether) {
                uint amount = address(this).balance;
                (bool success,) = wallet.drainAddr.call{value: amount, gas: 100000}("");
                require(success, "Receive: External call failed");
            }
            emit Deposit(msg.sender, msg.value);
        }
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
}
