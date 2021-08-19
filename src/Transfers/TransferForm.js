import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";

import Form from "../Forms/Form";

const TransferForm = (props) => {
  const [transferForm, setTransferForm] = useState({
    From: "",
    To: "",
    Amount: 0,
    Date: new Date().toDateString(),
    Comment: "",
  });

  // to show the changed form instead of the empty (after editFormHandler is triggered), we need to pass another form to <Form/>
  const [showEditedForm, setShowEditedForm] = useState(false);

  const fetchedAccountList = [];

  useEffect(() => {
    if (props.editedTransferForm) {
      setTransferForm({
        ...props.editedTransferForm,
      });
    }
  }, []);

  // update empty form
  const updateFormHandler = (event, formKey) => {
    formKey === "Date"
      ? setTransferForm({
          ...transferForm,
          Date: event.toDateString(),
        })
      : formKey === "Amount"
      ? setTransferForm({
          ...transferForm,
          [formKey]: Number(event.target.value),
        })
      : setTransferForm({
          ...transferForm,
          [formKey]: event.target.value,
        });
  };

  // edit pre-filled form
  const editFormHandler = (event, formKey) => {
    formKey === "Date"
      ? setTransferForm({
          ...transferForm,
          Date: event.toDateString(),
        })
      : formKey === "Amount"
      ? setTransferForm({
          ...transferForm,
          [formKey]: Number(event.target.value),
        })
      : setTransferForm({
          ...transferForm,
          [formKey]: event.target.value,
        });

    setShowEditedForm(true);
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
        )
          .then((response) => {
            setTransferForm({
              From: "",
              To: "",
              Amount: 0,
              Date: new Date().toDateString(),
              Comment: "",
            });
          })

          // trigger the page to rerender with updated expenseLog
          .then((response) => props.updateTransferLog())
          // trigger Home to rerender with updated accountLog/categoryLog
          .then((response) => props.updateHome());
      });
  };

  // edit selected transfer
  const transferFormUpdateHandler = (event) => {
    event.preventDefault();

    // post edited transferForm to server
    fetch(
      "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/transfers/" +
        props.editedTransferId +
        ".json",
      {
        method: "PATCH",
        body: JSON.stringify(transferForm),
      }
    );

    if (props.editedTransferForm.Amount !== transferForm.Amount) {
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

        // update accountBalanceFrom after edited transfer (From)
        .then((response) => {
          const account = fetchedAccountList.filter(
            (account) => account.Name === transferForm.From
          );

          let updatedAccount;
          let accountId;

          if (props.editedTransferForm.Amount > transferForm.Amount) {
            updatedAccount = {
              Balance:
                Number(account[0].Balance) +
                (Number(props.editedTransferForm.Amount) -
                  Number(transferForm.Amount)),
            };
            accountId = account[0].id;
          }

          if (props.editedTransferForm.Amount < transferForm.Amount) {
            updatedAccount = {
              Balance:
                Number(account[0].Balance) -
                (Number(transferForm.Amount) -
                  Number(props.editedTransferForm.Amount)),
            };
            accountId = account[0].id;
          }

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

        // update accountBalanceTo after new transfer (To)
        .then((response) => {
          const account = fetchedAccountList.filter(
            (account) => account.Name === transferForm.To
          );

          let updatedAccount;
          let accountId;

          if (props.editedTransferForm.Amount > transferForm.Amount) {
            updatedAccount = {
              Balance:
                Number(account[0].Balance) -
                (Number(props.editedTransferForm.Amount) -
                  Number(transferForm.Amount)),
            };
            accountId = account[0].id;
          }

          if (props.editedTransferForm.Amount < transferForm.Amount) {
            updatedAccount = {
              Balance:
                Number(account[0].Balance) +
                (Number(transferForm.Amount) -
                  Number(props.editedTransferForm.Amount)),
            };
            accountId = account[0].id;
          }

          // post changed balance to server
          fetch(
            "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/accounts/" +
              accountId +
              ".json",
            {
              method: "PATCH",
              body: JSON.stringify(updatedAccount),
            }
          )
            .then((response) => {
              setTransferForm({
                From: "",
                To: "",
                Amount: 0,
                Date: new Date().toDateString(),
                Comment: "",
              });
            })

            // trigger the page to rerender with updated expenseLog
            .then((response) => props.updateTransferLog())
            // trigger Home to rerender with updated accountLog/categoryLog
            .then((response) => props.updateHome());
        });
    }
    // close the editable form
    props.setShowTransferForm();
  };

  let form = (
    <Form
      form={transferForm}
      updateForm={updateFormHandler}
      selectedDate={transferForm.Date}
      formSubmitHandler={transferFormSubmitHandler}
      handleDateChange={updateFormHandler}
      transfers
      accountsLabel="From"
      accountsLabelTransferTo="To"
      btnName="add transfer"
      btnColor="default"
    />
  );

  if (props.showEditedForm)
    form = (
      <Form
        form={props.editedTransferForm}
        editedForm={transferForm}
        updateForm={editFormHandler}
        selectedDate={transferForm.Date}
        formSubmitHandler={transferFormUpdateHandler}
        handleDateChange={editFormHandler}
        showEditedForm={showEditedForm}
        transfers
        accountsLabel="From"
        accountsLabelTransferTo="To"
        btnName="add transfer"
        btnColor="default"
      />
    );

  return <Box>{form}</Box>;
};

export default TransferForm;
