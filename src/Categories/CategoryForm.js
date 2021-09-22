import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";

import Form from "../components/Forms/Form";
import {
  postNewTransactionToDB as postNewCategoryToDB,
  postEditedTransactionToDB as postEditedCategoryToDB,
} from "../modules/fetch";

import { checkCategoryFormValidity } from "../modules/validation";

const CategoryForm = (props) => {
  const [categoryForm, setCategoryForm] = useState({
    Name: "",
    Balance: "",
  });

  const validityRules = {
    required: true,
    greaterThanZero: true,
  };

  const [formIsValid, setFormIsValid] = useState(true);

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
    setCategoryForm({
      ...categoryForm,
      [formKey]: event.target.value,
    });

    setShowEditedForm(true);
  };

  // add new category
  const categoryFormSubmitHandler = (event) => {
    event.preventDefault();
    setFormIsValid(false);

    const triggerUpdates = async () => {
      setCategoryForm({
        Name: "",
        Balance: "",
      });

      // trigger the page to rerender with updated categoryLog
      await props.updateCategoryLog();
    };

    const formIsValid = checkCategoryFormValidity(categoryForm, validityRules);
    console.log(formIsValid);

    if (formIsValid) {
      setFormIsValid(true);
      postNewCategoryToDB(categoryForm, "categories");
      triggerUpdates();
    }
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
          Balance: "",
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

  let helperTextName, helperTextBalance;
  let invalidInputName, invalidInputBalance;

  if (formIsValid === false) {
    if (categoryForm.Name === "") {
      helperTextName = "Please fill in";
      invalidInputName = true;
    }
    if (
      categoryForm.Balance <= 0 ||
      categoryForm.Balance != Number(categoryForm.Balance)
    ) {
      helperTextBalance = "Invalid input";
      invalidInputBalance = true;
    }
    if (categoryForm.Balance === "") {
      helperTextBalance = "Please fill in";
      invalidInputBalance = true;
    }
  }

  const commonProps = {
    updateForm: updateFormHandler,
    btnColor: "secondary",
    helperTextName: helperTextName,
    helperTextAmount: helperTextBalance,
    invalidInputName: invalidInputName,
    invalidInputAmount: invalidInputBalance,
  };

  let form = (
    <Form
      {...commonProps}
      form={categoryForm}
      formSubmitHandler={categoryFormSubmitHandler}
      btnName="add category"
    />
  );

  if (props.showEditedForm)
    form = (
      <Form
        {...commonProps}
        form={props.editedCategoryForm}
        editedForm={categoryForm}
        formSubmitHandler={categoryFormUpdateHandler}
        showEditedForm={showEditedForm}
        btnName="edit category"
      />
    );

  return <Box>{form}</Box>;
};

export default CategoryForm;
