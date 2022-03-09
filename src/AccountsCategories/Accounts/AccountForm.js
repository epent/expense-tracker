import React, { useState } from "react";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import makeStyles from "@mui/styles/makeStyles";

import AccountCategoryForm from "../AccountCategoryForm";

import { postData as postAccount } from "../../modules/fetch";

import { checkAccounCategorytFormValidity as checkAccountFormValidity } from "../../modules/validate";

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
    greaterOrEqualToZero: true,
    numeric: true,
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
  const accountFormSubmitHandler = async (event) => {
    event.preventDefault();

    setFormIsValid(false);

    const isValid = checkAccountFormValidity(accountForm, validityRules);

    if (isValid) {
      setFormIsValid(true);

      const response = await postAccount("account", accountForm);

      setAccountForm({
        Name: "",
        Category: "",
        Balance: "",
      });

      if (!response) {
        props.openErrorDialog("Failed to add new account.");
      }
    }

    // trigger the page to rerender with updated categoryLog
    await props.updateAccountsHandler();
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

  const validationErrors = {
    Name: false,
    Category: false,
    Balance: false,
  };
  const helperText = {};

  if (formIsValid === false) {
    if (accountForm.Name === "") {
      validationErrors.Name = true;
      helperText.Name = "Please fill in";
    }
    if (accountForm.Category === "") {
      validationErrors.Category = true;
      helperText.Category = "Please fill in";
    }
    if (accountForm.Balance === "") {
      validationErrors.Balance = true;
      helperText.Balance = "Please fill in";
    }
    if (accountForm.Balance < 0 || isNaN(Number(accountForm.Balance))) {
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
            formColor="primary"
            form={accountForm}
            updateForm={updateFormHandler}
            accountCategoriesList={accountCategoriesList}
            formSubmitHandler={accountFormSubmitHandler}
            validationErrors={validationErrors}
            helperText={helperText}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default NewAccountForm;
