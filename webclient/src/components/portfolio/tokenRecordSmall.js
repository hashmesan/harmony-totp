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
import { calcPriceBySushi, getPriceForUser } from "../../helper/priceCalc";

const TokenRecordSmall = (props) => {
  const { smartvault } = useContext(SmartVaultContext);

  const [symbol, setSymbol] = useState("");
  const [ONEPrice, setONEPrice] = useState("");

  let price;
  let priceChange;
  let priceChangePercent;

  useEffect(() => {
    async function fetchTokenData() {
      let tokenInfo = JSON.parse(localStorage.getItem(props.address));
      let addressForSushi;

      if (!tokenInfo) {
        tokenInfo = await smartvault.getTokenInfo(props.address);
        localStorage.setItem(tokenInfo.address, JSON.stringify(tokenInfo));
      }

      setSymbol(tokenInfo.symbol);

      const ONEPrice = await smartvault.harmonyClient.getONEPriceByChainlink();
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
    [price, priceChange, priceChangePercent] = calcPriceBySushi(data.token, ONEPrice);
  }

  return (
    <>
      <td>
        <div className="d-flex  align-items-center">
          <span className="me-3">{symbol}</span>
          {/* temporary */}
          {props.address == "0x04d6e90e42d0543b45b3d5a0aded6be3022286bd" ? <TokenCategory category={"stablecoin"} /> : <TokenCategory category={"token"} />}
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

const mapToProps = ({ environment }) => ({ environment });
export default connect(mapToProps, actions)(TokenRecordSmall);
