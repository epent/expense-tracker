import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";

import Box from "@mui/material/Box";

const Donut = (props) => {
  const [donutState, setDonutState] = useState({
    series: props.data,
    chartOptions: {
      colors: props.colors,
      chart: {
        id: "donut-chart",
      },
      legend: {
        show: false,
      },
      labels: props.labels,
      dataLabels: {
        enabled: false,
      },
    },
  });

  useEffect(() => {
    if (props.updatedData) {
      setDonutState((donutState) => {
        return {
          ...donutState,
          series: props.updatedData,
          chartOptions: {
            ...donutState.chartOptions,
            labels: props.updatedLabels,
          },
        };
      });
    }
  }, [props.updatedData, props.updatedLabels]);

  return (
    <Box>
      <Chart
        options={donutState.chartOptions}
        series={donutState.series}
        type="donut"
      />
    </Box>
  );
};

export default Donut;
