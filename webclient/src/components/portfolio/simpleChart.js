import React, { useRef, useEffect } from "react";
import { createChart, CrosshairMode, LineStyle } from "lightweight-charts";

// TODO: Switch to real data
import { priceData } from "./dataMock/priceData";
import { volumeData } from "./dataMock/volumeData";

const SimpleChart = () => {
  const chartContainerRef = useRef();
  const chart = useRef();
  const resizeObserver = useRef();

  useEffect(() => {
    const priceDataFiltered = priceData.map(({ time, close }) => ({
      time: time,
      value: close,
    }));

    chart.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 500, //"300px", //chartContainerRef.current.clientHeight,
      layout: {
        backgroundColor: "#fff",
        textColor: "rgba(255, 255, 255, 0.9)",
      },
      grid: {
        vertLines: {
          color: "#334158",
          visible: false,
        },
        horzLines: {
          color: "#334158",
          style: LineStyle.SparseDotted,
          visible: true,
        },
      },

      priceScale: {
        borderColor: "#485c7b",
      },
      timeScale: {
        borderColor: "#485c7b",
        visible: false,
      },
      localization: {
        priceFormatter: (price) => "$" + price,
      },
    });

    /*
    const candleSeries = chart.current.addCandlestickSeries({
      upColor: "#4bffb5",
      downColor: "#ff4976",
      borderDownColor: "#ff4976",
      borderUpColor: "#4bffb5",
      wickDownColor: "#838ca1",
      wickUpColor: "#838ca1",
    });

    candleSeries.setData(priceData);
    */
    const areaSeries = chart.current.addAreaSeries({
      topColor: "rgba(239,239,238, 1)",
      bottomColor: "rgba(239,239,238, 0.2)",
      lineColor: "rgba(0,36,46, 1)",
      lineWidth: 2,
    });

    areaSeries.setData(priceDataFiltered);

    /*
    const volumeSeries = chart.current.addHistogramSeries({
      color: "#182233",
      lineWidth: 2,
      priceFormat: {
        type: "volume",
      },
      overlay: true,
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    volumeSeries.setData(volumeData);
    */
  }, []);

  // Resize chart on container resizes.
  useEffect(() => {
    resizeObserver.current = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      chart.current.applyOptions({ width, height });
      setTimeout(() => {
        chart.current.timeScale().fitContent();
      }, 0);
    });

    resizeObserver.current.observe(chartContainerRef.current);

    return () => resizeObserver.current.disconnect();
  }, []);

  return (
    <div
      ref={chartContainerRef}
      className="chart-container"
      // style={{ height: "100%" }}
    />
  );
};

export default SimpleChart;
