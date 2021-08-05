import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";

import CategoryList from "./CategoryList";

const CategoryLog = () => {
  const [categoryLog, setCategoryLog] = useState({
    categoryList: [],
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
        });

        console.log(fetchedCategoryList);
      });
  }, []);

  const deleteCategoryHandler = (categoryId) => {
    const updatedCategoryLog = categoryLog.categoryList.filter(
      (category) => category.id !== categoryId
    );

    setCategoryLog({
      ...categoryLog,
      categoryList: updatedCategoryLog,
    });

    // delete category from db
    fetch(
      "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/categories/" +
        categoryId +
        ".json",
      {
        method: "DELETE",
      }
    );
  };

  return (
    <Box>
      <CategoryList
        categoryList={categoryLog.categoryList}
        deleteCategory={deleteCategoryHandler}
      />
    </Box>
  );
};

export default CategoryLog;
