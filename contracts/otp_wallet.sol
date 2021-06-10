pragma solidity ^0.7.6;
pragma experimental ABIEncoderV2;

import "./core/wallet_data.sol";
import "./features/guardians.sol";
import "./features/daily_limit.sol";
import "./features/recovery.sol";

contract TOTPWallet {

    using Guardians for Core.Wallet;
    using DailyLimit for Core.Wallet;
    using Recovery for Core.Wallet;
    Core.Wallet public wallet;

    event DebugEvent(bytes16 data);
    event DebugEventN(uint32 data);
    event WalletTransfer(address to, uint amount);
    event Deposit(address indexed sender, uint value);

    constructor(address owner_, bytes16 rootHash_, uint8 merkelHeight_, address payable drainAddr_, uint dailyLimit_)
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

    modifier onlyValidHOTP(bytes16[] memory confirmMaterial, bytes20 sides) 
    {
        require(_deriveChildTreeIdx(sides) == getCurrentCounter(), "unexpected counter value"); 
        bytes16 reduced = _reduceConfirmMaterial(confirmMaterial, sides);
        require(reduced==wallet.rootHash, "UNEXPECTED PROOF");
        _;
    }

    function makeTransfer(address payable to, uint amount) external onlyFromWalletOrOwnerWhenUnlocked() 
    {
        require(wallet.isUnderLimit(amount), "over withdrawal limit");
        require(address(this).balance >= amount, "not enough balance");  

        wallet.spentToday += amount;
        to.transfer(amount);
        emit WalletTransfer(to, amount);             
    }

    //TODO: Drain ERC20 tokens too
    function drain(bytes16[] calldata confirmMaterial, bytes20 sides) external onlyFromWalletOrOwnerWhenUnlocked()  {
        wallet.drainAddr.transfer(address(this).balance);            
    }

    function drain() external {
        require(msg.sender == wallet.drainAddr, "sender != drain");        
        require(remainingTokens() <= 0, "not depleted tokens");
        wallet.drainAddr.transfer(address(this).balance);            
    }

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
    function startRecovery(address newOwner, bytes16[] calldata confirmMaterial, bytes20 sides, bytes calldata signatures_) external {
        wallet.startRecovery(newOwner, confirmMaterial, sides, signatures_);
    }

    function isRecovering() external view returns (bool) {
        return wallet.recovery.rootHash != 0x0;
    }

    function cancelRecovery(bytes16[] calldata confirmMaterial, bytes20 sides) external onlyValidTOTP(confirmMaterial, sides) {
        wallet.recovery = Core.RecoveryInfo(0, 0, 0, 0, 0);
    }

    function getRecovery() external view returns (bytes16, uint8, uint, uint) {
        return (wallet.recovery.rootHash, wallet.recovery.merkelHeight, wallet.recovery.timePeriod, wallet.recovery.timeOffset);
    }

    function finalizeRecovery() external {
        wallet.finalizeRecovery();
    }

    //
    // Utility functions
    //
        


    /// @dev Fallback function allows to deposit ether.
    receive() external payable {
        if (msg.value > 0)
            emit Deposit(msg.sender, msg.value);
    }

}
