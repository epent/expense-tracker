import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";

import Form from "../components/Forms/Form";
import {
  postNewTransactionToDB as postNewAccountToDB,
  postEditedTransactionToDB as postEditedAccountToDB,
} from "../modules/fetch";

import { checkAccountFormValidity } from "../modules/validation";

const AccountForm = (props) => {
  const [accountForm, setAccountForm] = useState({
    Name: "",
    Category: "",
    Balance: "",
  });

  const validityRules = {
    required: true,
    greaterThanZero: true,
  };

  const [formIsValid, setFormIsValid] = useState(true);

  // to show the changed form instead of the empty (after editFormHandler is triggered), we need to pass another form to <Form/>
  const [showEditedForm, setShowEditedForm] = useState(false);

  const accountCategoriesList = ["Bank account", "Credit card", "Cash"];

  useEffect(() => {
    if (props.editedAccountForm) {
      setAccountForm({
        ...props.editedAccountForm,
      });
    }
  }, []);

  // update/edit the form
  const updateFormHandler = (event, formKey) => {
    setAccountForm({
      ...accountForm,
      [formKey]: event.target.value,
    });

    setShowEditedForm(true);
  };

  // add new account
  const accountFormSubmitHandler = (event) => {
    event.preventDefault();
    setFormIsValid(false);

    const triggerUpdates = async () => {
      setAccountForm({
        Name: "",
        Category: "",
        Balance: "",
      });

      // trigger the page to rerender with updated categoryLog
      await props.updateAccountLog();
    };

    const formIsValid = checkAccountFormValidity(accountForm, validityRules);
    console.log(formIsValid);

    if (formIsValid) {
      setFormIsValid(true);
      postNewAccountToDB(accountForm, "accounts");
      triggerUpdates();
    }
  };

  const accountFormUpdateHandler = (event) => {
    event.preventDefault();

    const updateData = async () => {
      // post edited accountForm to server
      await postEditedAccountToDB(
        accountForm,
        "accounts",
        props.editedAccountId
      );

      const triggerUpdates = async () => {
        setAccountForm({
          Name: "",
          Category: "",
          Balance: "",
        });

        // trigger the page to rerender with updated accountLog
        await props.updateAccountLog();
      };
      await triggerUpdates();
    };
    updateData();

    // close the editable form automatically
    props.setShowAccountForm();
  };

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
      accountForm.Balance <= 0 ||
      accountForm.Balance != Number(accountForm.Balance)
    ) {
      helperTextBalance = "Invalid input";
      invalidInputBalance = true;
    }
    if (accountForm.Balance === "") {
      helperTextBalance = "Please fill in";
      invalidInputBalance = true;
    }
  }

  const commonProps = {
    updateForm: updateFormHandler,
    accountCategoriesList: accountCategoriesList,
    btnColor: "secondary",
    helperTextName: helperTextName,
    helperTextCategory: helperTextCategory,
    helperTextAmount: helperTextBalance,
    invalidInputName: invalidInputName,
    invalidInputCategory: invalidInputCategory,
    invalidInputAmount: invalidInputBalance,
  };

  let form = (
    <Form
      {...commonProps}
      form={accountForm}
      formSubmitHandler={accountFormSubmitHandler}
      btnName="save account"
    />
  );

  if (props.showEditedForm)
    form = (
      <Form
        {...commonProps}
        form={props.editedAccountForm}
        editedForm={accountForm}
        formSubmitHandler={accountFormUpdateHandler}
        showEditedForm={showEditedForm}
        btnName="edit account"
      />
    );

  return <Box>{form}</Box>;
};

export default AccountForm;
