import React, { useState } from "react";

import Box from "@material-ui/core/Box";

import Form from "../Forms/Form";

const CategoryForm = () => {
  const [categoryForm, setCategoryForm] = useState({
    Name: "",
    Balance: 0,
  });

  const updateFormHandler = (event, formKey) => {
    setCategoryForm({
      ...categoryForm,
      [formKey]: event.target.value,
    });
  };

  // add new category
  const categoryFormSubmitHandler = (event) => {
    event.preventDefault();
    console.log("Category form submitted: ");
    console.log(categoryForm);

    //  post new categoryForm to server
    fetch(
      "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/categories.json",
      {
        method: "POST",
        body: JSON.stringify(categoryForm),
      }
    ).then((response) => {
      setCategoryForm({
        Name: "",
        Balance: 0,
      });
    });
  };

  return (
    <Box>
      <Form
        form={categoryForm}
        updateForm={updateFormHandler}
        formSubmitHandler={categoryFormSubmitHandler}
        btnName="add category"
        btnColor="secondary"
      />
    </Box>
  );
};

export default CategoryForm;
