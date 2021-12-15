import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";

import Donut from "./Donut";
import { getDataFromDBasList as getCategoriesFromDB } from "../../modules/fetch";

const CategoriesDonut = (props) => {
  const [categoryBalances, setCategoryBalances] = useState([]);

  const [categoryLabels, setCategoryLabels] = useState([]);

  const [updateDonut, setUpdateDonut] = useState(false);

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
      const fetchCategories = async () => {
        const categoryList = await getCategoriesFromDB("categories");

        const updateState = async () => {
          const fetchedCategoryBalances = categoryList.map((category) => {
            return Number(category.Balance);
          });

          const fetchedCategoryLabels = categoryList.map((category) => {
            return category.Name;
          });

          setCategoryBalances(fetchedCategoryBalances);

          setCategoryLabels(fetchedCategoryLabels);

          setUpdateDonut((prevState) => !prevState);
        };
        await updateState();
      };
      await fetchCategories();
    };
    updateCategories();
  }, [props.updateCategories, props.updateHome]);

  return (
    <Box mt={2}>
      <Donut
        labels={[]}
        data={[]}
        updatedLabels={categoryLabels}
        updatedData={categoryBalances}
        updateDonut={updateDonut}
        colors={colors}
      />
    </Box>
  );
};

export default CategoriesDonut;
