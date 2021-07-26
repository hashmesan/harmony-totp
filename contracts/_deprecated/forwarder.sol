// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity >=0.7.0;

// import "../IERC20.sol";
import "./relayer.sol";

contract Forwarder {

    address payable wallet;

    function init(address payable _wallet) external {
        wallet = _wallet;
    }

    /// @dev Fallback function allows to deposit ether.
    receive() external payable {
        //wallet.transfer(msg.value);
        Relayer(wallet).processDeposit{value:msg.value}();

    }
}