import React, { useState } from "react";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import makeStyles from "@mui/styles/makeStyles";

import AccountCategoryForm from "../AccountCategoryForm";

import { postData as postCategory } from "../../modules/fetch";

import { checkAccounCategorytFormValidity as checkCategoryFormValidity } from "../../modules/validate";

const NewCategorieForm = (props) => {
  const useStyles = makeStyles((theme) => ({
    paper: {
      backgroundColor: "#fafafa",
      borderRadius: 10,
      [theme.breakpoints.up("md")]: {
        height: 400,
      },
    },
  }));

  const classes = useStyles();

  const [categoryForm, setCategoryForm] = useState({
    Name: "",
    Balance: "",
  });

  const validityRules = {
    required: true,
    greaterOrEqualToZero: true,
    numeric: true,
  };

  const [formIsValid, setFormIsValid] = useState(true);

  const updateFormHandler = (event, formKey) => {
    setCategoryForm({
      ...categoryForm,
      [formKey]: event.target.value,
    });
  };

  const categoryFormSubmitHandler = async (event) => {
    event.preventDefault();

    setFormIsValid(false);

    const isValid = checkCategoryFormValidity(categoryForm, validityRules);

    if (isValid) {
      setFormIsValid(true);

      const response = await postCategory("category", categoryForm);

      setCategoryForm({
        Name: "",
        Balance: "",
      });

      if (!response) {
        props.openErrorDialog("Failed to add new category.");
      }
    }

    // trigger the page to rerender with updated categoryLog
    await props.updateCategoriesHandler();
  };

  const validationErrors = {
    Name: false,
    Balance: false,
  };
  const helperText = {};

  if (formIsValid === false) {
    if (categoryForm.Name === "") {
      validationErrors.Name = true;
      helperText.Name = "Please fill in";
    }
    if (categoryForm.Balance === "") {
      validationErrors.Balance = true;
      helperText.Balance = "Please fill in";
    }
    if (categoryForm.Balance < 0 || isNaN(Number(categoryForm.Balance))) {
      validationErrors.Balance = true;
      helperText.Balance = "Invalid input";
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
            formColor="secondary"
            form={categoryForm}
            updateForm={updateFormHandler}
            formSubmitHandler={categoryFormSubmitHandler}
            validationErrors={validationErrors}
            helperText={helperText}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default NewCategorieForm;
