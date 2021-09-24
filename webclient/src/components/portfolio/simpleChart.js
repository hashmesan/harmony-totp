import React, { useRef, useEffect } from "react";
import { createChart, CrosshairMode, LineStyle } from "lightweight-charts";

const SimpleChart = (props) => {
  const chartContainerRef = useRef();
  const chart = useRef();
  const resizeObserver = useRef();

  useEffect(() => {
    console.log(props);

    chart.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 300, //"300px", //chartContainerRef.current.clientHeight,
      layout: {
        textColor: "#92918f",
      },
      grid: {
        vertLines: {
          color: "#334158",
          visible: false,
        },
        horzLines: {
          color: "#92918F",
          style: LineStyle.SparseDotted,
          visible: true,
        },
      },

      priceScale: {
        borderVisible: false,
      },
      timeScale: {
        borderColor: "#485c7b",
        visible: false,
        fixLeftEdge: true,
        fixRightEdge: true,
      },

      // localization: {
      //   priceFormatter: (price) => "$" + price,
      // },
    });

    const areaSeries = chart.current.addAreaSeries({
      topColor: "rgba(239,239,238, 1)",
      bottomColor: "rgba(239,239,238, 0.2)",
      lineColor: "rgba(0,36,46, 1)",
      lineWidth: 2,
    });

    areaSeries.setData(props.priceData);
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
