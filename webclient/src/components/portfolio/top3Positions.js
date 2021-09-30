import React, { useState, useEffect, useContext } from "react";
import { connect } from "redux-zero/react";
import actions from "../../redux/actions";
import { useHistory, useRouteMatch } from "react-router-dom";

import TokenRecordSmall from "./tokenRecordSmall";
import TokenCategory from "./tokenCategory";

import AccountProvider, {
  SmartVaultContext,
} from "../../context/SmartvaultContext";

import { useQuery, useLazyQuery } from "@apollo/client";
import { get2DaysPrice } from "../../subgraph_query";
import { calcPriceBySushi, getPriceForUser } from "../../helper/priceCalc";

const web3utils = require("web3-utils");

const Top3Positions = (props) => {
  const { smartvault, saveWallet } = useContext(SmartVaultContext);

  const history = useHistory();
  const { url } = useRouteMatch();

  const WONEAddress = "0xcf664087a5bb0237a0bad6742852ec6c8d69a27a";

  const [balance, setbalance] = useState(0);
  const [holdingTokensInfo, setholdingTokensInfo] = useState();
  const [ONEPrice, setONEPrice] = useState("");

  let price;
  let priceChange;
  let priceChangePercent;

  const handleRowClick = (address) => {
    history.push(`/token/${address}`);
  };

  useEffect(() => {
    async function fetchData() {
      const ONEbalance = await smartvault.getDeposits();
      const balanceForUser = Number(web3utils.fromWei(ONEbalance)).toFixed(4);
      setbalance(balanceForUser);

      const ONEPrice = await smartvault.harmonyClient.getONEPriceByChainlink();
      setONEPrice(ONEPrice);

      let holdingTokens = await smartvault.getHoldingTokens();

      smartvault.walletData.erc20 = smartvault.walletData.erc20 || [];

      // const temp = smartvault.walletData.erc20.pop();
      // saveWallet();

      await Promise.all(
        holdingTokens.map(async (tokenAddress) => {
          if (
            smartvault.walletData.erc20.findIndex(
              (e) => e.contractAddress == tokenAddress
            ) == -1
          ) {
            const tokenInfo = await smartvault.getTokenInfo(tokenAddress);

            smartvault.walletData.erc20.push({
              name: tokenInfo.name,
              symbol: tokenInfo.name,
              decimals: tokenInfo.symbol,
              contractAddress: tokenAddress,
            });
            saveWallet();
          }
        })
      );

      let erc20 = smartvault.walletData.erc20;

      if (erc20.length > 2) {
        erc20 = erc20.slice(0, 2);
      }

      setholdingTokensInfo(erc20);
    }

    fetchData();
  }, []);

  const { loading, error, data } = useQuery(get2DaysPrice, {
    variables: {
      tokenAddress: WONEAddress,
    },
  });

  //if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  if (data && data.token != null) {
    [price, priceChange, priceChangePercent] = calcPriceBySushi(
      data.token,
      ONEPrice
    );
  }

  return (
    <>
      <div className="d-flex align-items-center justify-content-between">
        <div className="fs-4 text-no-bank-grayscale-iron">
          Top 3 portofolio Positions
        </div>

        <i className="bi bi-arrow-up-right fs-5"></i>
      </div>

      <div style={{ height: 172 }}>
        <table className="table">
          <thead>
            <tr className="fw-normal font-sm text-no-bank-grayscale-iron">
              <th scope="col"></th>
              <th scope="col" className="fw-normal">
                Last
              </th>
              <th scope="col" className="fw-normal">
                24h Change
              </th>
              <th scope="col" className="fw-normal">
                Total volume
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="pointer" onClick={() => handleRowClick(WONEAddress)}>
              <td>
                <div className="d-flex  align-items-center">
                  <span className="me-3">ONE</span>
                  <TokenCategory category={"coin"} />
                  <i className="bi bi-star-fill ms-3"></i>
                </div>
              </td>
              <td>
                <span className="text-no-bank-primary">{price}</span>
                <span className="ms-1 text-no-bank-grayscale-iron">CHF</span>
              </td>
              <td>
                <span
                  className={
                    priceChangePercent > 0 ? "text-success" : "text-danger"
                  }
                >
                  {priceChangePercent} %
                </span>
              </td>
              <td>
                <span className="text-no-bank-primary">4.3</span>
                <span className="ms-1 text-no-bank-grayscale-iron">bn</span>
                <span className="ms-1 text-no-bank-grayscale-iron">CHF</span>
              </td>
            </tr>

            {holdingTokensInfo &&
              holdingTokensInfo.map((token) => (
                <tr
                  key={token.contractAddress}
                  className="pointer"
                  onClick={() =>
                    handleRowClick(token.contractAddress.toLowerCase())
                  }
                >
                  <TokenRecordSmall
                    address={token.contractAddress.toLowerCase()}
                  />
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

function Top3PositionsWithProvider() {
  return (
    <AccountProvider loadAccount={true}>
      <Top3Positions />
    </AccountProvider>
  );
}

const mapToProps = ({ environment }) => ({ environment });
export default connect(mapToProps, actions)(Top3PositionsWithProvider);
