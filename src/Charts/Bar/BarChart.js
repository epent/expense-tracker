import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";

import Box from "@mui/material/Box";

const BarChart = (props) => {
  const [barState, setBarState] = useState({
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: props.months,
      },
      colors: props.colors,
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
    if (
      props.updatedExpensesData ||
      props.updatedIncomeData ||
      props.updatedMonths
    ) {
      setBarState((barState) => {
        return {
          ...barState,
          options: {
            ...barState.options,
            xaxis: {
              categories: props.updatedMonths,
            },
          },
          series:
            props.updatedExpensesData && props.updatedIncomeData
              ? [
                  {
                    name: "Expenses",
                    data: props.updatedExpensesData,
                  },
                  {
                    name: "Income",
                    data: props.updatedIncomeData,
                  },
                ]
              : props.updatedExpensesData
              ? [
                  {
                    name: "Income",
                    data: props.updatedExpensesData,
                  },
                ]
              : [
                  {
                    name: "Income",
                    data: props.updatedIncomeData,
                  },
                ],
        };
      });
    }
  }, [props.updatedMonths, props.updatedExpensesData, props.updatedIncomeData]);

  return (
    <Box py={3}>
      <Chart
        options={barState.options}
        series={barState.series}
        type="bar"
        height="300"
      />
    </Box>
  );
};

export default BarChart;
