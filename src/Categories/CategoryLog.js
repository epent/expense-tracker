import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";

import CategoryList from "./CategoryList";

const CategoryLog = () => {
  const [categoryLog, setCategoryLog] = useState({
    categoryList: [],
    loading: true,
  });

  useEffect(() => {
    // fetch categoryList from server
    fetch(
      "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/categories.json"
    )
      .then((response) => response.json())
      .then((data) => {
        const fetchedCategoryList = [];
        for (let key in data) {
          fetchedCategoryList.push({
            ...data[key],
            id: key,
          });
        }

        setCategoryLog({
          ...categoryLog,
          categoryList: fetchedCategoryList,
          loading: false,
        });

        console.log(fetchedCategoryList);
      });
  }, []);

  return (
    <Box>
      <CategoryList categoryList={categoryLog.categoryList} />
    </Box>
  );
};

export default CategoryLog;
