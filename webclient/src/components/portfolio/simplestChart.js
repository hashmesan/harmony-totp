import React, { useEffect } from "react";
import { createChart } from "lightweight-charts";

import { priceData } from "./dataMock/priceData";

const SimplestChart = () => {
  const ref = React.useRef();

  useEffect(() => {
    const priceDataFiltered = priceData.map(({ time, close }) => ({
      time: time,
      value: close,
    }));

    console.log("Data: ", priceDataFiltered);
    const chart = createChart(ref.current, { width: 400, height: 500 });
    const areaSeries = chart.addAreaSeries();

    areaSeries.setData(priceDataFiltered);
  }, []);

  return (
    <>
      <div ref={ref} />
    </>
  );
};

export default SimplestChart;
