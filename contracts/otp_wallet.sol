// SPDX-License-Identifier: GPL-3.0-only

pragma solidity ^0.7.6;
pragma experimental ABIEncoderV2;

import "./core/wallet_data.sol";
import "./features/guardians.sol";
import "./features/daily_limit.sol";
import "./features/recovery.sol";
import "./features/metatx.sol";

contract TOTPWallet {

    using Guardians for Core.Wallet;
    using DailyLimit for Core.Wallet;
    using Recovery for Core.Wallet;
    using MetaTx for Core.Wallet;

    Core.Wallet public wallet;

    event DebugEvent(bytes16 data);
    event DebugEventN(uint32 data);
    event WalletTransfer(address to, uint amount);
    event Deposit(address indexed sender, uint value);

    constructor(address owner_, bytes32 rootHash_, uint8 merkelHeight_, address payable drainAddr_, uint dailyLimit_)
    {
        wallet.owner = owner_;
        wallet.rootHash = rootHash_;
        wallet.merkelHeight = merkelHeight_;
        wallet.drainAddr = drainAddr_;
        wallet.dailyLimit = dailyLimit_;
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


    // confirmMaterial contains OTP + intermediatory hashes + sides
    modifier onlyValidTOTP(bytes32[] memory confirmMaterial) 
    {
        //require(_deriveChildTreeIdx(sides) == getCurrentCounter(), "unexpected counter value"); 
        bytes32 reduced = Recovery._reduceConfirmMaterial(confirmMaterial);
        require(reduced==wallet.rootHash, "UNEXPECTED PROOF");
        _;
    }

    function getRequiredSignatures(bytes calldata _data) public view returns (uint8, Core.OwnerSignature) {
        bytes4 methodId = functionPrefix(_data);

        if(methodId == TOTPWallet.makeTransfer.selector) {
            return (1, Core.OwnerSignature.Required);
        }

        revert("unknown method");
    }    

    function executeMetaTx(
            bytes   calldata data,
            bytes   calldata signatures,
            uint256 nonce,
            uint256 gasPrice,
            uint256 gasLimit,
            address refundToken,
            address refundAddress            
        ) external 
    {
        uint8 requiredSignatures;
        Core.SignatureRequirement memory sigRequirement;        
        (sigRequirement.requiredSignatures, sigRequirement.ownerSignatureRequirement) = getRequiredSignatures(data);        

        MetaTx.executeMetaTx(wallet, address(this), data, signatures, nonce, gasPrice, gasLimit, refundAddress, sigRequirement);
    }

    function makeTransfer(address payable to, uint amount) external onlyFromWalletOrOwnerWhenUnlocked() 
    {
        require(wallet.isUnderLimit(amount), "over withdrawal limit");
        require(address(this).balance >= amount, "not enough balance");  

        wallet.spentToday += amount;
        to.transfer(amount);
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

    //TODO: Drain ERC20 tokens too
    // function drain() external onlyFromWalletOrOwnerWhenUnlocked()  {
    //     wallet.drainAddr.transfer(address(this).balance);            
    // }

    // function drain() external {
    //     require(msg.sender == wallet.drainAddr, "sender != drain");        
    //     // require(remainingTokens() <= 0, "not depleted tokens");
    //     wallet.drainAddr.transfer(address(this).balance);            
    // }

    //
    // Guardians functions
    //
    function addGuardian(address guardian, bytes16[] calldata confirmMaterial, bytes20 sides)
        external
        onlyFromWalletOrOwnerWhenUnlocked()
    {
        wallet.addGuardian(guardian);
    }

    function revokeGuardian(address guardian, bytes16[] calldata confirmMaterial, bytes20 sides)
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
    // In default setup with only HTOP setup, wallet recovery is done on its own.
    // In a more secure setup with HTOP + guardians, HTOP is considered as 1 guardian.
    function startRecoverCommit(bytes32 commitHash) external {
        wallet.commitHash[commitHash] = true;
    }

    function startRecoveryReveal(address newOwner, bytes32[] calldata confirmMaterial) external {
        bytes32 hash = keccak256(abi.encodePacked(newOwner, confirmMaterial[0]));
        require(wallet.commitHash[hash], "NO COMMIT");

        wallet.startRecovery(newOwner, confirmMaterial);
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
        if (msg.value > 0)
            emit Deposit(msg.sender, msg.value);
    }

}
