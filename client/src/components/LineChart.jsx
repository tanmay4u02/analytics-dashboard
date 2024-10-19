import React, { useRef } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import { Button, useMediaQuery } from "@mui/material";
import shortMonthsConstants from "../constants/shortMonths.constants";

Chart.register(zoomPlugin);
Chart.register(...registerables);

const LineChart = ({ lineData }) => {
  const chartRef = useRef(null);

  const isLargeScreen = useMediaQuery("(min-width:600px)");

  const handleResetZoom = () => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  if (!lineData || lineData.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "4rem", fontSize: "15px" }}>
        No Data. Please select a feature from Bar Chart
      </div>
    );
  }

  let dataValues = [];
  const labels = lineData?.map((record) => {
    const date = new Date(record.date);
    dataValues.push(record.timeSpent);

    return `${date.getDate()}-${shortMonthsConstants[date.getMonth()]}`;
  });

  const data = {
    labels,
    datasets: [
      {
        label: "time spent",
        data: dataValues,
      },
    ],
    fill: false,
    borderColor: "rgb(75, 192, 192)",
    tension: 0.1,
  };

  return (
    <>
      <div style={{ textAlign: "right" }}>
        <Button onClick={handleResetZoom}>Reset Zoom</Button>
      </div>
      <Line
        ref={chartRef}
        data={data}
        {...(!isLargeScreen && { height: 300 })}
        options={{
          scales: {
            x: {
              title: {
                display: true,
                text: "Date",
              },
              grid: {
                display: false,
              },
            },
            y: {},
          },
          responsive: true,
          plugins: {
            zoom: {
              zoom: {
                wheel: {
                  enabled: true,
                },
                pinch: {
                  enabled: true,
                },
                mode: "xy",
              },
              pan: {
                enabled: true,
                mode: "xy",
              },
            },
          },
        }}
      />
    </>
  );
};

export default LineChart;
