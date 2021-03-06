import React, { useState } from "react";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import makeStyles from "@mui/styles/makeStyles";

import Form from "../../Form/Form";

import { postData as postAccount } from "../../modules/fetch";

import { checkAccounCategorytFormValidity as checkAccountFormValidity } from "../../modules/validate";
import { useAuth } from "../../hooks/useAuth";

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

  const auth = useAuth();

  const [accountForm, setAccountForm] = useState({
    Name: "",
    Category: "",
    Balance: "",
  });

  const validityRules = {
    required: true,
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

      const response = await postAccount("account", accountForm, auth.token);

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
    if (isNaN(Number(accountForm.Balance))) {
      validationErrors.Balance = true;
      helperText.Balance = "Invalid input";
    }
  }

  const addButton = (
    <IconButton size="medium" type="submit" color="primary">
      <AddCircleIcon style={{ fontSize: 50 }} />
    </IconButton>
  );

  return (
    <Box>
      <Paper elevation={3} className={classes.paper}>
        <Box p={3}>
          <Typography variant="h5" color="textSecondary">
            {props.pageTitle}
          </Typography>
        </Box>
        <Box mx={3}>
          <Form
            formColor="primary"
            form={accountForm}
            updateForm={updateFormHandler}
            accountCategoriesList={accountCategoriesList}
            formSubmitHandler={accountFormSubmitHandler}
            validationErrors={validationErrors}
            helperText={helperText}
            addButton={addButton}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default NewAccountForm;
