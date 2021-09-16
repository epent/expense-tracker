import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";

import CategoryList from "./CategoryList";
import {
  fetchCategoriesFromDB,
  deleteTransactionFromDB as deleteCategoryFromDB,
} from "../modules/fetch";

const CategoryLog = (props) => {
  const [categoryLog, setCategoryLog] = useState([]);

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
    const fetchCategories = async () => {
      const categoryList = await fetchCategoriesFromDB();

      setCategoryLog(categoryList);
    };
    fetchCategories();
  }, [props.updatedCategoryLog, props.updateHome]);

  const deleteCategoryHandler = (categoryId) => {
    deleteCategoryFromDB("categories", categoryId);

    const updateCategoryLog = () => {
      const updatedCategoryLog = categoryLog.filter(
        (category) => category.id !== categoryId
      );
      setCategoryLog(updatedCategoryLog);
    };
    updateCategoryLog();
  };

  const editCategoryHandler = (category) => {
    setCategoryForm({
      Name: category.Name,
      Balance: category.Balance,
    });

    setEditedCategoryId(category.id);

    if (editedCategoryId === category.id) {
      setShowCategoryForm((prevState) => !prevState);
    }
  };

  let categoryList = categoryLog;
  if (props.sliceLog) categoryList = categoryLog.slice(0, 8);

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
        updateCategoryLog={props.updateCategoryLog}
      />
    </Box>
  );
};

export default CategoryLog;
