import React, { useState, useEffect, useContext } from "react";
import { connect } from "redux-zero/react";
const web3utils = require("web3-utils");
import AccountProvider, { SmartVaultContext } from "../../context/SmartvaultContext";
import actions from "../../redux/actions";
import SimpleChart from "./simpleChart";
import ChartHeaderToken from "./chartHeaderToken";
import ChartBottom from "./chartBottom";
import Transactions from "./transactions";
import TokenCategory from "./tokenCategory";

import { useLazyQuery } from "@apollo/client";
import { get30DaysPrice } from "../../subgraph_query";
import moment from "moment";
import { useParams } from "react-router-dom";

import NewsSample1 from "../../../public/news_sample1.png";
import NewsSample2 from "../../../public/news_sample2.png";
import NewsSample3 from "../../../public/news_sample3.png";

import { tokenAddressMap } from "./tokenAddressMap";
import { calcPriceBySushi, getPriceForUser } from "../../helper/priceCalc";

const Token = (props) => {
  const { smartvault } = useContext(SmartVaultContext);
  const { address } = useParams();

  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [chainlinkPrice, setChainlinkPrice] = useState("");
  const [ONEPrice, setONEPrice] = useState("");

  let dayPriceData = [];
  let price;
  let priceChangePercent;
  let priceChange;
  let totalValue;

  const WONEAddress = "0xcf664087a5bb0237a0bad6742852ec6c8d69a27a";

  useEffect(() => {
    async function fetchTokenData() {
      let addressForSushi;

      const ONEPrice = await smartvault.harmonyClient.getONEPriceByChainlink();
      setONEPrice(ONEPrice);

      if (address == WONEAddress) {
        setName("ONE");

        const ONEbalance = await smartvault.getDeposits();
        const balanceForUser = Number(web3utils.fromWei(ONEbalance)).toFixed(4);
        setBalance(balanceForUser);
        setChainlinkPrice(ONEPrice);
      } else {
        let tokenInfo = JSON.parse(localStorage.getItem(address));

        if (!tokenInfo) {
          tokenInfo = await smartvault.getTokenInfo(address);
          localStorage.setItem(tokenInfo.address, JSON.stringify(tokenInfo));
        }
        setName(tokenInfo.name);
        setBalance(tokenInfo.balance);

        const chainP = await smartvault.harmonyClient.getTokenPriceByChainlink(address, props.environment);
        const chainPForUser = getPriceForUser(chainP);
        setChainlinkPrice(chainPForUser);
      }

      if (tokenAddressMap.has(address) && props.environment != "mainnet") {
        addressForSushi = tokenAddressMap.get(address);
      } else {
        addressForSushi = address;
      }
      //setTokenAddress(address);

      getPrice({
        variables: {
          tokenAddress: addressForSushi,
        },
      });
    }

    fetchTokenData();
  }, []);

  const [getPrice, { loading, error, data }] = useLazyQuery(get30DaysPrice);

  //if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  if (data && data.token != null) {
    [price, priceChange, priceChangePercent] = calcPriceBySushi(data.token, ONEPrice);

    totalValue = Math.round(price * balance * 1000) / 1000;

    data.token.dayData.forEach((day) => {
      const priceForUser = getPriceForUser(day.priceUSD);

      const daydata = {
        time: moment.unix(day.date).format("YYYY-MM-DD"),
        value: priceForUser,
      };
      dayPriceData.unshift(daydata);
    });

    //props.setHoldingTokens({ address: tokenAddress, name: name, latestPrice: price, priceChange: priceChange });
  }

  // useEffect(() => {
  //   if (!props.holdingTokens.length) {
  //     setName("ETH");
  //     setLatestPrice("2943");
  //     setPriceChange("2.61");
  //   } else {
  //     const tokenInfo = props.holdingTokens.filter((token) => {
  //       return token.address == address;
  //     });

  //     console.log(tokenInfo);
  //     setName(tokenInfo[0].name);
  //     setLatestPrice(tokenInfo[0].latestPrice);
  //     setPriceChange(tokenInfo[0].priceChange);
  //   }
  // }, []);

  // const { loading, error, data } = useQuery(get30DaysPrice, {
  //   variables: {
  //     tokenAddress: address,
  //   },
  // });

  // if (loading) return "Loading...";
  // if (error) return `Error! ${error.message}`;

  // if (data) {
  //   data.token.dayData.forEach((day) => {
  //     const priceCHF = Number(day.priceUSD) * CHFUSD;
  //     const priceForUser = Math.round(priceCHF * 1000) / 1000;
  //     const daydata = { time: moment.unix(day.date).format("YYYY-MM-DD"), value: priceForUser };
  //     dayPriceData.unshift(daydata);
  //   });
  // }

  return (
    <div className="container-fluid">
      <section>
        <div className="row min-h-25">
          <div className="col-lg-4 border border-no-bank-grayscale-silver ">
            <Transactions />
          </div>

          <div className="col-lg-8 border border-no-bank-grayscale-silver justify-content-center">
            <div className="row p-4 pb-0">{price && <ChartHeaderToken tokenName={name} currentPrice={price} priceChange={priceChangePercent} />}</div>

            <div className="row p-3">{dayPriceData.length == 30 && <SimpleChart priceData={dayPriceData} />}</div>

            <ChartBottom />
          </div>
        </div>
      </section>

      {/* token name header */}
      <section>
        <div className="d-flex align-items-center justify-content-between my-3 mx-2">
          <div className="d-flex align-items-center">
            <div className="fs-4 me-2 text-no-bank-grayscale-iron fw-bold">{name}</div>
            {/* temporary */}
            {address == "0x04d6e90e42d0543b45b3d5a0aded6be3022286bd" ? <TokenCategory category={"stablecoin"} /> : <TokenCategory category={"token"} />}
          </div>
          <button type="button" className="btn rounded-pill btn-no-bank-highlight text-rb-bank-primary px-5 py-2">
            Trade
          </button>
        </div>
      </section>

      {/* My position */}
      <section>
        <div className="row bg-no-bank-grayscale-platin mx-2">
          <div className="col-md-4 border border-no-bank-grayscale-silver p-4">
            <div>
              <div className="fs-4 text-no-bank-grayscale-iron">Current Price</div>
              <div className="d-flex flex-wrap align-items-baseline my-2 text-no-bank-primary">
                <span className="fs-1">{price && price.toLocaleString()}</span>
                <span className="fs-5 ms-1">CHF</span>
                <span className="font-sm text-no-bank-grayscale-iron ms-2">(SushSwap)</span>
              </div>
              <div className="text-no-bank-grayscale-iron mb-2">
                <span className="">{chainlinkPrice && chainlinkPrice.toLocaleString()}</span>
                <span className="ms-1">CHF</span>
                <span className="font-sm text-no-bank-grayscale-iron ms-2">(Chainlink)</span>
              </div>
              <div className={priceChangePercent > 0 ? "text-success" : "text-danger"}>
                <span className="fs-5">{priceChange && priceChange.toLocaleString()} CHF</span>
                <i className={"p-1 bi " + (priceChangePercent > 0 ? "bi-caret-up-fill" : "bi-caret-down-fill")} />
                <span className="text-no-bank-grayscale-iron ms-2">daily</span>
              </div>
              <div className={priceChangePercent > 0 ? "text-success" : "text-danger"}>
                <span className="fs-5">{priceChangePercent} %</span>
                <i className={"p-1 bi " + (priceChangePercent > 0 ? "bi-caret-up-fill" : "bi-caret-down-fill")} />
                <span className="text-no-bank-grayscale-iron ms-2">daily</span>
              </div>
            </div>
          </div>
          <div className="col-md-4 border border-no-bank-grayscale-silver p-4">
            <div>
              <div className="fs-5 text-no-bank-grayscale-iron">My Position</div>
              <div className="my-2 text-no-bank-primary">
                <span className="fs-1">{totalValue && totalValue.toLocaleString()}</span>
                <span className="fs-5 ms-1">CHF</span>
              </div>
              <div>
                <span className="fs-5 text-no-bank-grayscale-iron">Amount</span>

                <span className="ms-2 text-no-bank-primary">{balance.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className="col-md-4 border border-no-bank-grayscale-silver p-4">
            <div>
              <div className="fs-5 text-no-bank-grayscale-iron">P&L</div>
              <div className="my-2">
                <span className="fs-1 text-danger">-369.70</span>
                <span className="fs-5 text-danger ms-1">CHF</span>
                <span className="text-no-bank-grayscale-iron ms-2">daily</span>
              </div>
              <div>
                <span className="fs-5 text-no-bank-grayscale-iron">Unrealised</span>
                <span className="fs-5 text-success ms-2">7'260 CHF</span>
                <span className="text-no-bank-grayscale-iron ms-3">total</span>
              </div>
              <div>
                <span className="fs-5 text-success ms-1">+ 12.6%</span>
                <i className="bi bi-caret-up-fill text-success p-1" />
                <span className="text-no-bank-grayscale-iron ms-3">total</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Description, Position Detail */}
      <section>
        <div className="row mx-2">
          <div className="col-md-6 border border-no-bank-grayscale-silver p-4">
            <div className="fs-4 text-no-bank-grayscale-iron mb-3">Description</div>
            <p className="text-no-bank-primary">
              World-renowned precious metals storage and custody service provider Swiss Vault have launched noGold (ticker: NGLD), a gold-backed stablecoin fully backed by physical gold held securely
              in SwissVault's save mountain storage. It combines the safe-haven benefits of owning physical gold with the flexibility, transparency, affordability, and security of a digital asset.
            </p>
          </div>
          <div className="col-md-6 border border-no-bank-grayscale-silver p-4">
            <div className="fs-4 text-no-bank-grayscale-iron">Position Detail</div>
            <div className="my-3">
              <div>
                <span className="text-no-bank-grayscale-iron">Market Cap</span>
                <span className="text-no-bank-primary ms-2">3.2 bn CHF</span>
              </div>
              <div className="mt-1">
                <span className="text-no-bank-grayscale-iron">Trading Volume (24h)</span>
                <span className="text-no-bank-primary ms-2">68 mn CHF</span>
              </div>
              <div className="mt-1">
                <span className="text-no-bank-grayscale-iron">Circuling Supply</span>
                <span className="text-no-bank-primary ms-2">1.8 mn</span>
              </div>
              <div className="mt-1">
                <span className="text-no-bank-grayscale-iron">Available since</span>
                <span className="text-no-bank-primary ms-2">July 2020</span>
              </div>
              <div className="mt-1">
                <span className="text-no-bank-grayscale-iron">Issuer</span>
                <span className="text-no-bank-primary ms-2">Swiss Vault Inc.</span>
              </div>
            </div>
            <div className="d-flex mt-4">
              <button type="button" className="btn border border-no-bank-primary rounded-pill text-rb-bank-primary p-2 px-3">
                <i className="bi bi-arrow-up-right"></i>
                <span className="ms-1">Website</span>
              </button>
              <button type="button" className="btn border border-no-bank-primary rounded-pill text-rb-bank-primary p-2 px-3 ms-3">
                <i className="bi bi-arrow-up-right"></i>
                <span className="ms-1">Whitepaper</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* News */}
      <section>
        <div className="border border-no-bank-grayscale-silver p-4  mx-2 mb-5">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div className="fs-4 text-no-bank-grayscale-iron">News</div>
            <i className="bi bi-arrow-up-right fs-5"></i>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div>
                <img src={NewsSample1} className="img-fluid h-100" alt="" />
              </div>
              <div className="mt-2 text-no-bank-primary">August 16, 2021</div>
              <div className="mt-1 fs-3 text-no-bank-primary lh-sm">noGold just launched by nobank</div>
              <div className="mt-1 text-no-bank-grayscale-iron">r-bank.news</div>
            </div>
            <div className="col-md-4">
              <div>
                <img src={NewsSample2} className="img-fluid h-100" alt="" />
              </div>
              <div className="mt-2 text-no-bank-primary">August 16, 2021</div>
              <div className="mt-1 fs-3 text-no-bank-primary lh-sm">noGold – Is it the Next Big Thing?</div>
              <div className="mt-1 text-no-bank-grayscale-iron">barrons.com</div>
            </div>
            <div className="col-md-4">
              <div>
                <img src={NewsSample3} className="img-fluid h-100" alt="" />
              </div>
              <div className="mt-2 text-no-bank-primary">August 16, 2021</div>
              <div className="mt-1 fs-3 text-no-bank-primary lh-sm">How Investing in stablecoins like noGold helps you optimize your portfolio.</div>
              <div className="mt-1 text-no-bank-grayscale-iron">washingtonpost.com</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

function TokenWithProvider() {
  return (
    <AccountProvider loadAccount={true}>
      <Token />
    </AccountProvider>
  );
}

const mapToProps = ({ setLocation, environment }) => ({
  setLocation,
  environment,
});
export default connect(mapToProps, actions)(TokenWithProvider);
