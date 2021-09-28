import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";

import Box from "@material-ui/core/Box";

const BarChart = (props) => {
  const [barState, setBarState] = useState({
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: props.months,
      },
    },
    series: [
      {
        name: "Expenses",
        data: props.expensesData,
      },
      {
        name: "Income",
        data: props.incomeData,
      },
    ],
  });

  return (
    <Box py={3}>
      <Chart
        options={barState.options}
        series={barState.series}
        type="bar"
        width="830"
      />
    </Box>
  );
};

export default BarChart;
