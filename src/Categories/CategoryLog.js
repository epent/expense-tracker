import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";

import CategoryList from "./CategoryList";

const CategoryLog = (props) => {
  const [categoryLog, setCategoryLog] = useState({
    categoryList: [],
  });

  const [categoryForm, setCategoryForm] = useState({
    Name: "",
    Balance: 0,
  });

  //  id of the expense we want to edit
  const [editedCategoryId, setEditedCategoryId] = useState("");

  // if want to edit transaction, need to show the form again
  const [showCategoryForm, setShowCategoryForm] = useState(false);

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

  const editCategoryHandler = (categoryId, categoryName, categoryBalance) => {
    setCategoryForm({
      Name: categoryName,
      Balance: categoryBalance,
    });

    setEditedCategoryId(categoryId);

    if (editedCategoryId === categoryId) {
      setShowCategoryForm((prevState) => !prevState);
    }
  };

  let categoryList = categoryLog.categoryList;
  if (props.sliceLog) categoryList = categoryLog.categoryList.slice(0, 8);

  return (
    <Box>
      <CategoryList
        categoryList={categoryList}
        deleteCategory={deleteCategoryHandler}
        editCategory={editCategoryHandler}
        categoryForm={categoryForm}
        showCategoryForm={showCategoryForm}
        editedCategoryId={editedCategoryId}
        setShowCategoryForm={setShowCategoryForm}
        showEditBtn={props.showEditBtn}
        showDeleteBtn={props.showDeleteBtn}
      />
    </Box>
  );
};

export default CategoryLog;
