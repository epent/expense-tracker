import React, { useState } from "react";

import Box from "@material-ui/core/Box";

import Form from "../Forms/Form";

const TransferForm = () => {
  const [transferForm, setTransferForm] = useState({
    From: "",
    To: "",
    Amount: 0,
    Date: "",
    Comment: "",
  });

  const fetchedAccountList = [];

  const updateFormHandler = (event, formKey) => {
    setTransferForm({
      ...transferForm,
      [formKey]: event.target.value,
    });
  };

  // add new transfer
  const transferFormSubmitHandler = (event) => {
    event.preventDefault();
    console.log("Transfer form submitted: ");
    console.log(transferForm);

    // post new transferForm to server
    fetch(
      "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/transfers.json",
      {
        method: "POST",
        body: JSON.stringify(transferForm),
      }
    );

    // fetch accountList from server
    fetch(
      "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/accounts.json"
    )
      .then((response) => response.json())
      .then((data) => {
        for (let key in data) {
          fetchedAccountList.push({
            ...data[key],
            id: key,
          });
        }

        console.log(fetchedAccountList);
      })

      // update accountBalanceFrom after new transfer
      .then((response) => {
        const account = fetchedAccountList.filter(
          (account) => account.Name === transferForm.From
        );
        const updatedAccount = {
          Balance: Number(account[0].Balance) - Number(transferForm.Amount),
        };
        const accountId = account[0].id;

        // post changed balance to server
        fetch(
          "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/accounts/" +
            accountId +
            ".json",
          {
            method: "PATCH",
            body: JSON.stringify(updatedAccount),
          }
        );
      })

      // update accountBalanceTo after new transfer
      .then((response) => {
        const account = fetchedAccountList.filter(
          (account) => account.Name === transferForm.To
        );
        const updatedAccount = {
          Balance: Number(account[0].Balance) + Number(transferForm.Amount),
        };
        const accountId = account[0].id;

        // post changed balance to server
        fetch(
          "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/accounts/" +
            accountId +
            ".json",
          {
            method: "PATCH",
            body: JSON.stringify(updatedAccount),
          }
        ).then((response) => {
          setTransferForm({
            From: "",
            To: "",
            Amount: 0,
            Date: "",
            Comment: "",
          });
        });
      });
  };

  return (
    <Box>
      <Form
        form={transferForm}
        updateForm={updateFormHandler}
        formSubmitHandler={transferFormSubmitHandler}
        btnName="add transfer"
        btnColor="default"
      />
    </Box>
  );
};

export default TransferForm;
