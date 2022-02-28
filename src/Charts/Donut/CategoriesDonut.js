import React, { useState, useEffect } from "react";

import Box from "@mui/material/Box";

import Donut from "./Donut";

const CategoriesDonut = (props) => {
  const [categoryBalances, setCategoryBalances] = useState([]);

  const [categoryLabels, setCategoryLabels] = useState([]);

  const colors = [
    "#9575cd",
    "#ede7f6",
    "#d1c4e9",
    "#7e57c2",
    "#512da8",
    "#b39ddb",
  ];

  useEffect(() => {
    const updateCategories = async () => {
      const categoryList = props.categorieList;

      const balances = categoryList.map((category) => {
        return Number(category.balance);
      });

      const labels = categoryList.map((category) => {
        return category.name;
      });

      setCategoryBalances(balances);

      setCategoryLabels(labels);
    };
    updateCategories();
  }, [props.categorieList]);

  return (
    <Box mt={2}>
      <Donut
        labels={[]}
        data={[]}
        updatedLabels={categoryLabels}
        updatedData={categoryBalances}
        colors={colors}
      />
    </Box>
  );
};

export default CategoriesDonut;
