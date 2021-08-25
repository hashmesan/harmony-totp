// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PriceConsumerV3 {
    AggregatorV3Interface internal priceFeed;

    constructor(address pair) {
        priceFeed = AggregatorV3Interface(pair);
    }

    /**
     * Returns the latest price
     */
    function getLatestPrice()
        public
        view
        returns (int256 price, uint256 timeStamp)
    {
        (
            uint80 roundID,
            int256 price,
            uint256 startedAt,
            uint256 timeStamp,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        return (price, timeStamp);
    }
}
