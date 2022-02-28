import React, { useState } from "react";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import makeStyles from '@mui/styles/makeStyles';

import AccountCategoryForm from "../AccountCategoryForm";

import {
  getDataFromDBasList,
  patchUpdatedTotal,
  postNewTransactionToDB as postNewAccountToDB,
} from "../../modules/fetch";

import { checkAccountFormValidity } from "../../modules/validate";

const NewAccountForm = (props) => {
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

  const [accountForm, setAccountForm] = useState({
    Name: "",
    Category: "",
    Balance: "",
  });

  const validityRules = {
    required: true,
  };

  const [formIsValid, setFormIsValid] = useState(true);

  const accountCategoriesList = ["Bank account", "Credit card", "Cash"];

  const updateFormHandler = (event, formKey) => {
    setAccountForm({
      ...accountForm,
      [formKey]: event.target.value,
    });
  };

  // add new account
  const accountFormSubmitHandler = (event) => {
    event.preventDefault();

    fetch("http://localhost:8080/account", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(accountForm),
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Creating an account failed!");
        }
        return res.json();
      })
      .then((result) => {
        console.log(result);
      });

    // setFormIsValid(false);

    // const updateData = async () => {

    //   const triggerUpdates = async () => {
    //     setAccountForm({
    //       Name: "",
    //       Category: "",
    //       Balance: "",
    //     });

    //     // trigger the page to rerender with updated categoryLog
    //     await props.updateAccountsHandler();
    //   };
    //   await triggerUpdates();
    // };

    // const formIsValid = checkAccountFormValidity(accountForm, validityRules);
    // console.log(formIsValid);

    // if (formIsValid) {
    //   setFormIsValid(true);
    //   postNewAccountToDB(accountForm, "accounts");
    //   updateData();
    // }
  };

  // const accountFormUpdateHandler = (event) => {
  //   event.preventDefault();

  //   const updateData = async () => {
  //     // post edited accountForm to server
  //     await postEditedAccountToDB(
  //       accountForm,
  //       "accounts",
  //       props.editedAccountId
  //     );

  //     const triggerUpdates = async () => {
  //       setAccountForm({
  //         Name: "",
  //         Category: "",
  //         Balance: "",
  //       });

  //       // trigger the page to rerender with updated accountLog
  //       await props.updateAccountLog();
  //     };
  //     await triggerUpdates();
  //   };
  //   updateData();

  //   // close the editable form automatically
  //   props.setShowAccountForm();
  // };

  let helperTextName, helperTextCategory, helperTextBalance;
  let invalidInputName, invalidInputCategory, invalidInputBalance;

  if (formIsValid === false) {
    if (accountForm.Name === "") {
      helperTextName = "Please fill in";
      invalidInputName = true;
    }
    if (accountForm.Category === "") {
      helperTextCategory = "Please fill in";
      invalidInputCategory = true;
    }
    if (
      accountForm.Balance < 0 ||
      accountForm.Balance !== Number(accountForm.Balance)
    ) {
      helperTextBalance = "Invalid input";
      invalidInputBalance = true;
    }
    if (accountForm.Balance === "") {
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
            formColor="primary"
            form={accountForm}
            updateForm={updateFormHandler}
            accountCategoriesList={accountCategoriesList}
            formSubmitHandler={accountFormSubmitHandler}
            helperTextName={helperTextName}
            helperTextCategory={helperTextCategory}
            helperTextAmount={helperTextBalance}
            invalidInputName={invalidInputName}
            invalidInputCategory={invalidInputCategory}
            invalidInputAmount={invalidInputBalance}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default NewAccountForm;
