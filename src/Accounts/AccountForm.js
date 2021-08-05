import React, { useState } from "react";

import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

import Form from "../Forms/Form";

const AccountForm = (props) => {
  const [accountForm, setAccountForm] = useState({
    Name: "",
    Category: "",
    Balance: 0,
  });

  const updateFormHandler = (event, formKey) => {
    setAccountForm({
      ...accountForm,
      [formKey]: event.target.value,
    });
  };

  // add new account
  const accountFormSubmitHandler = (event) => {
    event.preventDefault();
    console.log("Expense form submitted: ");
    console.log(accountForm);

    fetch(
      "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/accounts.json",
      {
        method: "POST",
        body: JSON.stringify(accountForm),
      }
    ).then((response) => {
      setAccountForm({
        Name: "",
        Category: "",
        Balance: "",
      });
    });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom color="secondary">
        New Account
      </Typography>
      <Form
        form={accountForm}
        updateForm={updateFormHandler}
        formSubmitHandler={accountFormSubmitHandler}
        btnName="save account"
        btnColor="secondary"
      />
    </Box>
  );
};

export default AccountForm;
