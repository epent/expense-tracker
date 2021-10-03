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

  useEffect(() => {
    if (props.updatedExpensesData || props.updatedIncomeData) {
      setBarState({
        ...barState,
        options: {
          ...barState.options,
          xaxis: {
            categories: props.updatedMonths,
          },
        },
        series: [
          {
            name: "Expenses",
            data: props.updatedExpensesData,
          },
          {
            name: "Income",
            data: props.updatedIncomeData,
          },
        ],
      });
    }
  }, [props.updateBar]);

  return (
    <Box py={3}>
      <Chart
        options={barState.options}
        series={barState.series}
        type="bar"
        width="1510"
        height="300"
      />
    </Box>
  );
};

export default BarChart;
