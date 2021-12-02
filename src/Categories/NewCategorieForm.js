import React, { useState } from "react";

import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import AccountCategoryForm from "../components/Forms/AccountCategoryForm";

import {
  postNewTransactionToDB as postNewCategoryToDB,
  postEditedTransactionToDB as postEditedCategoryToDB,
} from "../modules/fetch";

import { checkCategoryFormValidity } from "../modules/validation";

const NewCategorieForm = (props) => {
  const useStyles = makeStyles((theme) => ({
    paper: {
      backgroundColor: "#fafafa",
      borderRadius: 10,
      height: props.paperHeight,
    },
  }));

  const classes = useStyles();

  const [categoryForm, setCategoryForm] = useState({
    Name: "",
    Balance: "",
  });

  const validityRules = {
    required: true,
  };

  const [formIsValid, setFormIsValid] = useState(true);

  const updateFormHandler = (event, formKey) => {
    setCategoryForm({
      ...categoryForm,
      [formKey]: event.target.value,
    });
  };

  const categoryFormSubmitHandler = (event) => {
    event.preventDefault();
    setFormIsValid(false);

    const triggerUpdates = async () => {
      setCategoryForm({
        Name: "",
        Balance: "",
      });

      // trigger the page to rerender with updated categoryLog
      await props.updateCategoriesHandler();
    };

    const formIsValid = checkCategoryFormValidity(categoryForm, validityRules);
    console.log(formIsValid);

    if (formIsValid) {
      setFormIsValid(true);
      postNewCategoryToDB(categoryForm, "categories");
      triggerUpdates();
    }
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

  return (
    <Box>
      <Paper elevation={3} className={classes.paper}>
        <Box p={3}>
          <Typography variant="h5" color="textSecondary">
            {props.pageTitle}
          </Typography>
        </Box>
        <Box mx={3}>
          <AccountCategoryForm
            form={categoryForm}
            updateForm={updateFormHandler}
            formSubmitHandler={categoryFormSubmitHandler}
            helperTextName={helperTextName}
            helperTextAmount={helperTextBalance}
            invalidInputName={invalidInputName}
            invalidInputAmount={invalidInputBalance}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default NewCategorieForm;
