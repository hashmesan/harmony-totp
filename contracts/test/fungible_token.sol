// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity >=0.7.6;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract FungibleToken is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    string baseURI;

    constructor() ERC721("GameItem", "ITM") {}

    function awardItem(address player, string memory tokenURI)
        public
        returns (uint256)
    {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(player, newItemId);
        baseURI = tokenURI;

        return newItemId;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }
}