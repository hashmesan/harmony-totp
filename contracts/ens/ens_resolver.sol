// SPDX-License-Identifier: MIT
pragma solidity >=0.7.6;

/**
 * @title EnsResolver
 * @dev Extract of the interface for ENS Resolver
 */
abstract contract Resolver {
    function supportsInterface(bytes4 interfaceID) virtual public pure returns (bool);
    function addr(bytes32 node) virtual public view returns (address);
    function setAddr(bytes32 node, address addr_) virtual public;
}
