import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";

import Form from "../Forms/Form";

const CategoryForm = (props) => {
  const [categoryForm, setCategoryForm] = useState({
    Name: "",
    Balance: 0,
  });

  // to show the changed form instead of the empty (after editFormHandler is triggered), we need to pass another form to <Form/>
  const [showEditedForm, setShowEditedForm] = useState(false);

  useEffect(() => {
    if (props.editedCategoryForm) {
      setCategoryForm({
        ...props.editedCategoryForm,
      });
    }
  }, []);

  // update empty form
  const updateFormHandler = (event, formKey) => {
    formKey === "Balance"
      ? setCategoryForm({
          ...categoryForm,
          [formKey]: Number(event.target.value),
        })
      : setCategoryForm({
          ...categoryForm,
          [formKey]: event.target.value,
        });
  };

  // edit pre-filled form
  const editFormHandler = (event, formKey) => {
    formKey === "Balance"
      ? setCategoryForm({
          ...categoryForm,
          [formKey]: Number(event.target.value),
        })
      : setCategoryForm({
          ...categoryForm,
          [formKey]: event.target.value,
        });

    setShowEditedForm(true);
  };

  // add new category
  const categoryFormSubmitHandler = (event) => {
    event.preventDefault();

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

  const categoryFormUpdateHandler = (event) => {
    event.preventDefault();

    //  post edited categoryForm to server
    fetch(
      "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/categories/" +
        props.editedCategoryId +
        ".json",
      {
        method: "PATCH",
        body: JSON.stringify(categoryForm),
      }
    ).then((response) => {
      setCategoryForm({
        Name: "",
        Balance: 0,
      });
    });

    // close the editable form
    props.setShowCategoryForm();
  };

  let form = (
    <Form
      form={categoryForm}
      updateForm={updateFormHandler}
      formSubmitHandler={categoryFormSubmitHandler}
      btnName="add category"
      btnColor="secondary"
    />
  );

  if (props.showEditedForm)
    form = (
      <Form
        form={props.editedCategoryForm}
        editedForm={categoryForm}
        updateForm={editFormHandler}
        formSubmitHandler={categoryFormUpdateHandler}
        showEditedForm={showEditedForm}
        btnName="add category"
        btnColor="secondary"
      />
    );

  return <Box>{form}</Box>;
};

export default CategoryForm;
