import React, { useState, useEffect, useContext } from "react";
import { SmartVaultContext, SmartVaultConsumer } from "../../context/SmartvaultContext";
import { connect } from "redux-zero/react";
import actions from "../../redux/actions";
const web3utils = require("web3-utils");
import { useQuery, useLazyQuery } from "@apollo/client";
import { get2DaysPrice } from "../../subgraph_query";
import { Link } from "react-router-dom";
import TokenCategory from "./tokenCategory";
import { tokenAddressMap } from "./tokenAddressMap";

const TokenRecordSmall = (props) => {
  const { smartvault } = useContext(SmartVaultContext);

  const [symbol, setSymbol] = useState("");
  const [balance, setBalance] = useState("");
  const [ONEPrice, setONEPrice] = useState("");

  let price;
  let priceChangePercent;

  const ONEAddress = "0x7466d7d0c21fa05f32f5a0fa27e12bdc06348ce2";

  const CHFUSD = 1.08;

  const getPriceForUser = (orig_price) => {
    const priceByCurrency = Number(orig_price) / CHFUSD;
    const price = Math.round(priceByCurrency * 1000) / 1000;

    return price;
  };

  useEffect(() => {
    async function fetchTokenData() {
      let tokenInfo = JSON.parse(localStorage.getItem(props.address));
      let addressForSushi;

      if (!tokenInfo) {
        tokenInfo = await smartvault.getTokenInfo(props.address);
        localStorage.setItem(tokenInfo.address, JSON.stringify(tokenInfo));
      }

      setSymbol(tokenInfo.symbol);
      setBalance(tokenInfo.balance);

      const ONEPrice = await smartvault.harmonyClient.getTokenPriceByChainlink(ONEAddress, props.environment);
      setONEPrice(ONEPrice);

      if (tokenAddressMap.has(props.address) && props.environment != "mainnet") {
        addressForSushi = tokenAddressMap.get(props.address);
      } else {
        addressForSushi = props.address;
      }

      getPrice({
        variables: {
          tokenAddress: addressForSushi,
        },
      });
    }

    fetchTokenData();
  }, []);

  const [getPrice, { loading, error, data }] = useLazyQuery(get2DaysPrice);

  //if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  if (data && data.token != null) {
    const latestPrice = data.token.derivedETH * ONEPrice;
    const latestPriceForUser = getPriceForUser(latestPrice);

    const yesterdayPrice = data.token.dayData[1].priceUSD;
    const priceChange24 = ((latestPrice - yesterdayPrice) / yesterdayPrice) * 100;

    price = latestPriceForUser;

    priceChangePercent = Math.round(priceChange24 * 1000) / 1000;
  }

  return (
    <>
      <td>
        <div className="d-flex  align-items-center">
          <span className="me-3">{symbol}</span>
          <TokenCategory category={"token"} />
          <i className="bi bi-star-fill ms-3"></i>
        </div>
      </td>
      <td>
        <span className="text-no-bank-primary">{price}</span>
        <span className="ms-1 text-no-bank-grayscale-iron">CHF</span>
      </td>
      <td>
        <span className={priceChangePercent > 0 ? "text-success" : "text-danger"}>
          {priceChangePercent} {priceChangePercent && "%"}
        </span>
      </td>
      <td>
        <span className="text-no-bank-primary">2.9</span>
        <span className="ms-1 text-no-bank-grayscale-iron">bn</span>
        <span className="ms-1 text-no-bank-grayscale-iron">CHF</span>
      </td>
    </>
  );
};

const mapToProps = ({ environment, ONElatestPrice, setHoldingTokens }) => ({
  environment,
  ONElatestPrice,
  setHoldingTokens,
});
export default connect(mapToProps, actions)(TokenRecordSmall);
