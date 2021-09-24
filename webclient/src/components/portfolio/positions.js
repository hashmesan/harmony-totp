import React, { useState, useEffect, useContext } from "react";
import { SmartVaultContext, SmartVaultConsumer } from "../smartvault_provider";
import { connect } from "redux-zero/react";
import actions from "../../redux/actions";
const web3utils = require("web3-utils");
import { useQuery } from "@apollo/client";
import { get2DaysPrice } from "../../subgraph_query";
import TokenRecord from "./tokenRecord";

const Positions = (props) => {
  const { smartvault } = useContext(SmartVaultContext);
  const ONEAddress = "0x7466d7d0c21fa05f32f5a0fa27e12bdc06348ce2";
  const WONEAddress = "0xcf664087a5bb0237a0bad6742852ec6c8d69a27a";

  const [balance, setbalance] = useState(0);
  const [holdingTokensInfo, setholdingTokensInfo] = useState();

  let priceONEChangeO24ForUser = 0;

  useEffect(() => {
    async function fetchData() {
      const ONEbalance = await smartvault.getDeposits();
      const balanceForUser = Number(web3utils.fromWei(ONEbalance)).toFixed(4);
      setbalance(balanceForUser);

      if (props.ONElatestPrice == null) {
        const ONEPrice = await smartvault.getTokenPriceByChainlink(ONEAddress);
        props.setONE(ONEPrice);
      }

      let holdingTokens = JSON.parse(localStorage.getItem("holdingTokens"));

      if (!holdingTokens) {
        holdingTokens = await smartvault.getHoldingTokens();
        localStorage.setItem("holdingTokens", JSON.stringify(holdingTokens));
      }
      setholdingTokensInfo(holdingTokens);
    }

    fetchData();
  }, []);

  const { loading, error, data } = useQuery(get2DaysPrice, {
    variables: {
      tokenAddress: WONEAddress,
    },
  });

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  if (data) {
    const yesterdayONEPrice = data.token.dayData[1].priceUSD;

    const priceONEChange24 = ((props.ONElatestPrice - yesterdayONEPrice) / yesterdayONEPrice) * 100;
    priceONEChangeO24ForUser = Math.round(priceONEChange24 * 100) / 100;
  }

  return (
    <div className="card p-3">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Token</th>
            <th scope="col">Symbol</th>
            <th scope="col">Amount</th>
            <th scope="col">Total Value</th>
            <th scope="col">Latest Price(chainlink)</th>
            <th scope="col">Latest Price(sushiswap)</th>
            <th scope="col">Change 24H</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>ONE</td>
            <td></td>
            <td>{balance}</td>
            <td>{balance * props.ONElatestPrice}</td>
            <td>{props.ONElatestPrice}</td>
            <td></td>
            <td>{priceONEChangeO24ForUser} %</td>
          </tr>
          {holdingTokensInfo && holdingTokensInfo.map((token) => <TokenRecord address={token} />)}
        </tbody>
      </table>
    </div>
  );
};

const mapToProps = ({ ONElatestPrice, setONE }) => ({ ONElatestPrice, setONE });
export default connect(mapToProps, actions)(Positions);
