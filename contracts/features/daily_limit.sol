pragma solidity ^0.7.6;
import "../core/wallet_data.sol";

library DailyLimit {
    /*
     * Internal functions
     */
    /// @dev Returns if amount is within daily limit and resets spentToday after one day.
    /// @param amount Amount to withdraw.
    /// @return Returns if amount is under daily limit.
    function isUnderLimit(Core.Wallet storage _wallet, uint amount)
        internal
        returns (bool)
    {
        if (block.timestamp > _wallet.lastDay + 24 hours) {
            _wallet.lastDay = block.timestamp;
            _wallet.spentToday = 0;
        }
        if (_wallet.spentToday + amount > _wallet.dailyLimit || _wallet.spentToday + amount < _wallet.spentToday) // IH: 2nd condition can be removed if you will use solc 0.8.0 that had embedded overflow/underflow protection
            return false;
        return true;
    }

    /*
     * Web3 call functions
     */
    /// @dev Returns maximum withdraw amount.
    /// @return Returns amount.
    function calcMaxWithdraw(Core.Wallet storage _wallet)
        public // IH: should be also view
        returns (uint)
    {
        if (block.timestamp > _wallet.lastDay + 24 hours)
            return _wallet.dailyLimit;
        if (_wallet.dailyLimit < _wallet.spentToday)
            return 0; // IH: I guess this is for cases when the user decreases the daily limit after spending more than the target value
        return _wallet.dailyLimit - _wallet.spentToday;
    }    
}