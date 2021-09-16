import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";

import Form from "../components/Forms/Form";
import {
  postNewTransactionToDB as postNewCategoryToDB,
  postEditedTransactionToDB as postEditedCategoryToDB,
} from "../modules/fetch";

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

  // update/edit the form
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

    setShowEditedForm(true);
  };

  // add new category
  const categoryFormSubmitHandler = (event) => {
    event.preventDefault();

    //  post new categoryForm to server
    postNewCategoryToDB(categoryForm, "categories");

    const triggerUpdates = async () => {
      setCategoryForm({
        Name: "",
        Balance: 0,
      });

      // trigger the page to rerender with updated categoryLog
      await props.updateCategoryLog();
    };
    triggerUpdates();
  };

  // edit selected category
  const categoryFormUpdateHandler = (event) => {
    event.preventDefault();

    const updateData = async () => {
      //  post edited categoryForm to server
      await postEditedCategoryToDB(
        categoryForm,
        "categories",
        props.editedCategoryId
      );

      const triggerUpdates = async () => {
        setCategoryForm({
          Name: "",
          Balance: 0,
        });

        // trigger the page to rerender with updated categoryLog
        await props.updateCategoryLog();
      };
      await triggerUpdates();
    };
    updateData();

    // close the editable form automatically
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
        updateForm={updateFormHandler}
        formSubmitHandler={categoryFormUpdateHandler}
        showEditedForm={showEditedForm}
        btnName="add category"
        btnColor="secondary"
      />
    );

  return <Box>{form}</Box>;
};

export default CategoryForm;
