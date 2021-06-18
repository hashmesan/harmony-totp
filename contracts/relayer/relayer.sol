// SPDX-License-Identifier: GPL-3.0-only

pragma solidity ^0.7.6;
pragma experimental ABIEncoderV2;

import "../wallet_factory.sol";

/**
 * Relayer contract is responsible for accept queued up new wallet
 * until there are new deposits associated with it via forwarder addresses.
 * Once there is at least one associated address, the application relayer
 * can trigger a processNext() to request a new wallet from the wallet factory.
 *
 * Why on smart contract? We can avoid any security risk of holding onto private keys
 * generated on the application relayer.
 * 
 */
contract Relayer
{
    struct WalletState {
        WalletFactory.WalletConfig config;
        uint deposits;
        bool created;
        uint networkFee;
        bool exists;
    }

    event NewWallet(address wallet, address forwarder);

    // forward address -> Config
    mapping (address => WalletState) public walletQueue;
    address[] availableForwarders;
    address[] forwardersToProcess;

    WalletFactory factory;

    constructor(address factory_) {
        factory = WalletFactory(factory_);
    }

    function submitNewWalletQueue(
        WalletFactory.WalletConfig calldata config, 
        uint networkFee,
        bool createForwarderIfNeeded
    ) external {
        if (!createForwarderIfNeeded) {
            require(availableForwarders.length > 0,"NOT ENOUGH FORWARDER");
        } else {
            if(availableForwarders.length == 0) {
            }
        }

        address lastForwarder = availableForwarders[availableForwarders.length-1];
        walletQueue[lastForwarder] = WalletState(config, 0, false, networkFee, true);
        availableForwarders.pop();            
    }

    function isNext() external view returns(bool) {
        return forwardersToProcess.length > 0;
    }

    function processNext() external {
        address lastForwarder = forwardersToProcess[forwardersToProcess.length-1];
        WalletState storage state = walletQueue[lastForwarder];
        factory.createWallet(state.config);

        // send excess network fees to the new wallet
        address wallet = factory.computeWalletAddress(state.config.owner, state.config.salt);
        if (state.deposits > state.networkFee) {
            payable(wallet).transfer(state.deposits-state.networkFee);
        }

        delete walletQueue[lastForwarder];
        forwardersToProcess.pop();
        availableForwarders.push(lastForwarder);

        emit NewWallet(wallet, lastForwarder);
    }

    /// @dev Fallback function allows to deposit ether.
    receive() external payable {
        if (msg.value > 0) {
            if(walletQueue[msg.sender].exists) {
                walletQueue[msg.sender].deposits += msg.value;
                forwardersToProcess.push(msg.sender);
            } else {
                revert();
            }
        }
    }
}