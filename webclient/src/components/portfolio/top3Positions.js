import React, { useState, useEffect, useContext } from "react";
import { connect } from "redux-zero/react";
import actions from "../../redux/actions";
import { useHistory, useRouteMatch } from "react-router-dom";

import TokenCategory from "./tokenCategory";
import TokenRecordSmall from "./TokenRecordSmall";

import AccountProvider, { SmartVaultContext } from "../../context/SmartvaultContext";

const Top3Positions = (props) => {
  const { smartvault } = useContext(SmartVaultContext);

  const history = useHistory();
  const { url } = useRouteMatch();

  const ONEAddress = "0x7466d7d0c21fa05f32f5a0fa27e12bdc06348ce2";
  const WONEAddress = "0xcf664087a5bb0237a0bad6742852ec6c8d69a27a";

  const [balance, setbalance] = useState(0);
  const [holdingTokensInfo, setholdingTokensInfo] = useState();
  const [ONEPrice, setONEPrice] = useState("");

  const handleRowClick = (address) => {
    history.push(`/token/${address}`);
  };

  useEffect(() => {
    async function fetchData() {
      //const ONEbalance = await smartvault.getDeposits();
      //const balanceForUser = Number(web3utils.fromWei(ONEbalance)).toFixed(4);
      //setbalance(balanceForUser);

      const ONEPrice = await smartvault.harmonyClient.getTokenPriceByChainlink(ONEAddress);
      setONEPrice(ONEPrice);

      let holdingTokens = await smartvault.getHoldingTokens();

      if (holdingTokens.length > 3) {
        holdingTokens = holdingTokens.slice(0, 3);
      }
      setholdingTokensInfo(holdingTokens);

      console.log(holdingTokens);
    }

    fetchData();
  }, []);

  return (
    <>
      <div className="d-flex align-items-center justify-content-between">
        <div className="fs-4 text-no-bank-grayscale-iron">Top 3 portofolio Positions</div>

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
            {/* <tr className="pointer" onClick={() => handleRowClick("0x6983d1e6def3690c4d616b13597a09e6193ea013")}>
              <td>
                <div className="d-flex  align-items-center">
                  <span className="me-3">ONE</span>
                  <TokenCategory category={"coin"} />
                  <i className="bi bi-star-fill ms-3"></i>
                </div>
              </td>
              <td>
                <span className="text-no-bank-primary">2.19</span>
                <span className="ms-1 text-no-bank-grayscale-iron">CHF</span>
              </td>
              <td>
                <span className="text-success">+2.3%</span>
              </td>
              <td>
                <span className="text-no-bank-primary">4.3</span>
                <span className="ms-1 text-no-bank-grayscale-iron">bn</span>
                <span className="ms-1 text-no-bank-grayscale-iron">CHF</span>
              </td>
            </tr> */}

            {holdingTokensInfo &&
              holdingTokensInfo.map((tokenAddress) => (
                <tr className="pointer" onClick={() => handleRowClick(tokenAddress)}>
                  <TokenRecordSmall address={tokenAddress} />
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

const mapToProps = ({}) => ({});
export default connect(mapToProps, actions)(Top3PositionsWithProvider);
