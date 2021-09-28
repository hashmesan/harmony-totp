const CHFUSD = 1.08;

export const getPriceForUser = (orig_price) => {
  const priceByCurrency = Number(orig_price) / CHFUSD;
  const price = Math.round(priceByCurrency * 1000) / 1000;

  return price;
};

export const calcPriceBySushi = (tokenData, ONEPrice) => {
  const latestPrice = tokenData.derivedETH * ONEPrice;
  const latestPriceForUser = getPriceForUser(latestPrice);

  const yesterdayPrice = tokenData.dayData[1].priceUSD;
  const priceChange24 = ((latestPrice - yesterdayPrice) / yesterdayPrice) * 100;

  const price = latestPriceForUser;

  const priceChange = getPriceForUser(latestPrice - yesterdayPrice);
  const priceChangePercent = Math.round(priceChange24 * 1000) / 1000;

  return [price, priceChange, priceChangePercent];
};
