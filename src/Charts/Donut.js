import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";

import Box from "@material-ui/core/Box";

const Donut = (props) => {
  const [donutState, setDonutState] = useState({
    series: props.data,
    chartOptions: {
      chart: {
        id: props.chartId,
      },
      legend: {
        show: false,
      },
      labels: props.labels,
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        pie: {
          size: 100,
          donut: {
            size: "55%",
          },
        },
      },
    },
  });

  useEffect(() => {
    if (props.updatedData) {
      setDonutState({
        ...donutState,
        series: props.updatedData,
      });
      console.log("updatedData")
    }

    console.log(props.updatedData);
  }, [props.updateDonut]);

  return (
    <Box py={3}>
      <Chart
        options={donutState.chartOptions}
        series={donutState.series}
        type="donut"
        width="380"
      />
    </Box>
  );
};

export default Donut;
