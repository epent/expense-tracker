import React from "react";

import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

import Form from "./Form";
import Accounts from "../Accounts";

const AccountForm = (props) => {
  const updateFormHandler = (event, formKey) => {
    props.setAccountForm({
      ...props.accountForm,
      [formKey]: event.target.value,
    });
  };

  return (
    <Box>
      <Accounts />
      <Typography variant="h4" gutterBottom color="secondary">
        New Account
      </Typography>
      <Form
        form={props.accountForm}
        updateForm={updateFormHandler}
        formSubmitHandler={props.accountFormSubmitHandler}
        btnName="save account"
        btnColor="secondary"
      />
    </Box>
  );
};

export default AccountForm;
