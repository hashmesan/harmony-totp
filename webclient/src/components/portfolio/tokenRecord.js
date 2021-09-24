import React, { useState, useEffect, useContext } from "react";
import { SmartVaultContext, SmartVaultConsumer } from "../smartvault_provider";
import { connect } from "redux-zero/react";
import actions from "../../redux/actions";
const web3utils = require("web3-utils");
import { useQuery, useLazyQuery } from "@apollo/client";
import { get2DaysPrice } from "../../subgraph_query";
import { Link } from "react-router-dom";

const TokenRecord = (props) => {
  const { smartvault } = useContext(SmartVaultContext);

  let price;
  let priceChange;
  let address;

  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [balance, setBalance] = useState("");
  const [chainlinkPrice, setChainlinkPrice] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");

  //temporary: mapping testnet tokenAddress to mainnet one
  const tokenAddressMap = new Map([
    ["0x268d6ff391b41b36a13b1693bd25f87fb4e4b392", "0x6983d1e6def3690c4d616b13597a09e6193ea013"],
    ["0x0e80905676226159cc3ff62b1876c907c91f7395", "0xe176ebe47d621b984a73036b9da5d834411ef734"],
    ["0x7466d7d0c21fa05f32f5a0fa27e12bdc06348ce2", "0xcf664087a5bb0237a0bad6742852ec6c8d69a27a"],
  ]);

  useEffect(() => {
    async function fetchTokenData() {
      let tokenInfo = JSON.parse(localStorage.getItem(props.address));
      console.log(tokenInfo);

      if (!tokenInfo) {
        tokenInfo = await smartvault.getTokenInfo(props.address);
        localStorage.setItem(tokenInfo.address, JSON.stringify(tokenInfo));
      }
      setName(tokenInfo.name);
      setSymbol(tokenInfo.symbol);
      setBalance(tokenInfo.balance);
      setChainlinkPrice(tokenInfo.price);

      if (tokenAddressMap.has(props.address) && props.environment != "mainnet") {
        address = tokenAddressMap.get(props.address);
      } else {
        address = props.address;
      }
      setTokenAddress(address);

      getPrice({
        variables: {
          tokenAddress: address,
        },
      });
    }

    fetchTokenData();
  }, []);

  const [getPrice, { loading, error, data }] = useLazyQuery(get2DaysPrice);

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  if (data && data.token != null) {
    const sushiPrice = data.token.derivedETH * props.ONElatestPrice;
    const sushiPriceForUser = Math.round(sushiPrice * 1000) / 1000;

    const yesterdayPrice = data.token.dayData[1].priceUSD;
    const priceChange24 = ((sushiPrice - yesterdayPrice) / yesterdayPrice) * 100;

    price = sushiPriceForUser;
    priceChange = Math.round(priceChange24 * 100) / 100;

    props.setHoldingTokens({ address: tokenAddress, name: name, latestPrice: price, priceChange: priceChange });
  }

  return (
    <tr>
      <td>
        <Link to={"/token/" + tokenAddress}>{name}</Link>
      </td>
      <td>{symbol}</td>
      <td>{balance}</td>
      <td>{price && balance * price}</td>
      <td>{chainlinkPrice}</td>
      <td>{price}</td>
      <td>
        {priceChange} {priceChange && "%"}
      </td>
    </tr>
  );
};

const mapToProps = ({ environment, ONElatestPrice, setHoldingTokens }) => ({ environment, ONElatestPrice, setHoldingTokens });
export default connect(mapToProps, actions)(TokenRecord);
