import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";

import Form from "../components/Forms/Form";
import {
  postNewTransactionToDB as postNewAccountToDB,
  postEditedTransactionToDB as postEditedAccountToDB,
} from "../modules/fetch";

const AccountForm = (props) => {
  const [accountForm, setAccountForm] = useState({
    Name: "",
    Category: "",
    Balance: 0,
  });

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
    formKey === "Balance"
      ? setAccountForm({
          ...accountForm,
          [formKey]: Number(event.target.value),
        })
      : setAccountForm({
          ...accountForm,
          [formKey]: event.target.value,
        });

    setShowEditedForm(true);
  };

  // add new account
  const accountFormSubmitHandler = (event) => {
    event.preventDefault();

    postNewAccountToDB(accountForm, "accounts");

    const triggerUpdates = async () => {
      setAccountForm({
        Name: "",
        Category: "",
        Balance: 0,
      });

      // trigger the page to rerender with updated categoryLog
      await props.updateAccountLog();
    };
    triggerUpdates();
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
          Balance: 0,
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

  let form = (
    <Form
      form={accountForm}
      updateForm={updateFormHandler}
      formSubmitHandler={accountFormSubmitHandler}
      accountCategoriesList={accountCategoriesList}
      btnName="save account"
      btnColor="secondary"
    />
  );

  if (props.showEditedForm)
    form = (
      <Form
        form={props.editedAccountForm}
        editedForm={accountForm}
        updateForm={updateFormHandler}
        formSubmitHandler={accountFormUpdateHandler}
        showEditedForm={showEditedForm}
        accountCategoriesList={accountCategoriesList}
        btnName="edit account"
        btnColor="secondary"
      />
    );

  return <Box>{form}</Box>;
};

export default AccountForm;
