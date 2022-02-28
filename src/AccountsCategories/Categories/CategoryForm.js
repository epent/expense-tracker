import React, { useState } from "react";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import makeStyles from '@mui/styles/makeStyles';

import AccountCategoryForm from "../AccountCategoryForm";

import { postNewTransactionToDB as postNewCategoryToDB } from "../../modules/fetch";

import { checkCategoryFormValidity } from "../../modules/validate";

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

    fetch("http://localhost:8080/category", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoryForm),
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Creating a category failed!");
        }
        return res.json();
      })
      .then((result) => {
        console.log(result);
      });

    // setFormIsValid(false);

    // const triggerUpdates = async () => {
    //   setCategoryForm({
    //     Name: "",
    //     Balance: "",
    //   });

    //   // trigger the page to rerender with updated categoryLog
    //   await props.updateCategoriesHandler();
    // };

    // const formIsValid = checkCategoryFormValidity(categoryForm, validityRules);
    // console.log(formIsValid);

    // if (formIsValid) {
    //   setFormIsValid(true);
    //   postNewCategoryToDB(categoryForm, "categories");
    //   triggerUpdates();
    // }
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
      categoryForm.Balance !== Number(categoryForm.Balance)
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
            formColor="secondary"
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
