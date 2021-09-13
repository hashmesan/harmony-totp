// SPDX-License-Identifier: GPL-3.0-only

pragma solidity >=0.7.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../wallet_factory.sol";
import "./forwarder.sol";

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
contract Relayer is Ownable
{
    struct WalletState {
        WalletFactory.WalletConfig config;
        uint256 deposits;
        bool created;
        uint networkFee;
        bool exists;
    }

    event WalletCreated(address wallet, address forwarder);
    event EnqueuedNewWallet(address forwarder);
    event DepositReceived(address forwarder, uint deposit);

    address forwardImpl;
    bytes forwardInitCode;
    uint public totalForwarderCount;
    uint256 collectedFees;

    // forward address -> Config
    mapping (address => WalletState) walletQueue;
    mapping (bytes32 => bool) dedupMap;
    address[] availableForwarders;

    WalletFactory factory;

    constructor(address factory_, uint initialForwarder) {
        factory = WalletFactory(factory_);
        forwardImpl = address(new Forwarder());
        forwardInitCode = getInitCode(forwardImpl);    

        for(uint i=0;i<initialForwarder;i++){
            Forwarder f = deployForwarder(totalForwarderCount);
            availableForwarders.push(address(f));
            totalForwarderCount++;
        }    
    }

    function submitNewWalletQueue(
        WalletFactory.WalletConfig calldata config, 
        uint networkFee,
        bool createForwarderIfNeeded
    ) external onlyOwner() {
        bytes32 hash = getConfigHash(config);
        require(dedupMap[hash] == false, "DUPLICATE ITEM");

        if (!createForwarderIfNeeded) {
            require(availableForwarders.length > 0,"NOT ENOUGH FORWARDER");
        } else {
            if(availableForwarders.length == 0) {
                Forwarder f = deployForwarder(totalForwarderCount);
                availableForwarders.push(address(f));
                totalForwarderCount++;                
            }
        }        

        // hash the owner info
        address lastForwarder = availableForwarders[availableForwarders.length-1];
        walletQueue[lastForwarder] = WalletState(config, 0, false, networkFee, true);
        availableForwarders.pop();   
        dedupMap[hash]=true;
        
        emit EnqueuedNewWallet(lastForwarder);
    }

    function getConfigHash(WalletFactory.WalletConfig calldata config) internal pure returns(bytes32) {
        return keccak256(abi.encodePacked(config.owner, config.rootHash, config.merkelHeight, config.drainAddr, config.dailyLimit, config.salt));
    }

    // returns deposits, and ready status
    function getStatus(address forwarder) external view returns(uint256, bool) {
        return (walletQueue[forwarder].deposits, walletQueue[forwarder].deposits > walletQueue[forwarder].networkFee);
    }

    function processWallet(address forwarder) external onlyOwner() {
        uint256 deposits;
        bool isReady;
        (deposits, isReady) = this.getStatus(forwarder);
        require(isReady, "Address not ready");

        WalletState storage state = walletQueue[forwarder];
        factory.createWallet(state.config);

        // send excess network fees to the new wallet
        address wallet = factory.computeWalletAddress(state.config.owner, state.config.salt);
        if (state.deposits > state.networkFee) {
            (bool success,) = wallet.call{value: (state.deposits - state.networkFee), gas: 100000}("");
            require(success, "processWallet: External call failed");

        }

        delete walletQueue[forwarder];
        availableForwarders.push(forwarder);
        emit WalletCreated(wallet, forwarder);
    }

    function processDeposit() external payable{
        require(walletQueue[msg.sender].exists, "NO QUEUED ACCOUNT FOUND");
        walletQueue[msg.sender].deposits += msg.value;
        collectedFees += walletQueue[msg.sender].networkFee;
        emit DepositReceived(msg.sender, msg.value);
    }

    function collectFees() external onlyOwner() {
        payable(owner()).transfer(collectedFees);
        collectedFees = 0;
    }

    receive() external payable {
        emit DepositReceived(msg.sender, msg.value);
    }

    //
    // Forwarding Factory
    //

    function getForwarder(uint salt_) public view returns (address) {
        bytes32 salt = keccak256(abi.encodePacked(address(this), salt_));
        bytes32 hash = keccak256(abi.encodePacked(bytes1(0xff), address(this), salt, keccak256(abi.encodePacked(forwardInitCode))));
        address forwarder = address(uint160(uint256(hash)));
        return forwarder;
    }

    function deployForwarder(uint salt_) internal returns (Forwarder) {
        Forwarder forwarder = _deployForwarder(salt_);
        forwarder.init(payable(address(this)));
        return forwarder;
    }

    function _deployForwarder(uint salt_) internal returns (Forwarder forwarder) {
        
        // load the init code to memory
        bytes memory mInitCode = forwardInitCode;

        // compute the salt from the destination
        bytes32 salt = keccak256(abi.encodePacked(address(this), salt_));

        assembly {
            forwarder := create2(0, add(mInitCode, 0x20), mload(mInitCode), salt)
            if iszero(extcodesize(forwarder)) { revert(0, 0) }
        }
    }

    function getInitCode(address _implementation) internal pure returns (bytes memory code) {
        bytes20 targetBytes = bytes20(_implementation);
        code = new bytes(55);
        assembly {
            mstore(add(code, 0x20), 0x3d602d80600a3d3981f3363d3d373d3d3d363d73000000000000000000000000)
            mstore(add(code, add(0x20,0x14)), targetBytes)
            mstore(add(code, add(0x20,0x28)), 0x5af43d82803e903d91602b57fd5bf30000000000000000000000000000000000)
        }
    }
}