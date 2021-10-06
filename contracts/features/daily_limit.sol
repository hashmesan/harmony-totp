// SPDX-License-Identifier: GPL-3.0-only

pragma solidity >=0.7.6;
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
        if (block.timestamp > _wallet.dailyLimit.lastDay + 24 hours) {
            _wallet.dailyLimit.lastDay = block.timestamp;
            _wallet.dailyLimit.spentToday = 0;
        }
        if (_wallet.dailyLimit.spentToday + amount > _wallet.dailyLimit.limit || _wallet.dailyLimit.spentToday + amount < _wallet.dailyLimit.spentToday)
            return false;
        return true;
    }

    /*
     * Web3 call functions
     */
    /// @dev Returns maximum withdraw amount.
    /// @return Returns amount.
    function calcMaxWithdraw(Core.Wallet storage _wallet)
        public view
        returns (uint)
    {
        if (block.timestamp > _wallet.dailyLimit.lastDay + 24 hours)
            return _wallet.dailyLimit.limit;
        if (_wallet.dailyLimit.limit < _wallet.dailyLimit.spentToday)
            return 0;
        return _wallet.dailyLimit.limit - _wallet.dailyLimit.spentToday;
    }    
}