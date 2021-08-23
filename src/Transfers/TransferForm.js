import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";

import Form from "../components/Forms/Form";

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

  // below is the list that we fill with data fetched from db (to use after)
  const fetchedAccountList = [];

  // if we trigger edit, prefilled form is shown by default
  useEffect(() => {
    if (props.editedTransferForm) {
      setTransferForm({
        ...props.editedTransferForm,
      });
    }
  }, []);

  // update/edit the form
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

    setShowEditedForm(true);
  };

  // shared between both handlers - put fetched accounts to the list
  const fetchList = (data, listName) => {
    for (let key in data) {
      listName.push({
        ...data[key],
        id: key,
      });
    }
  };

  // shared between both handlers - post changes in accounts to db
  const postChangedAccountCategoryBalance = (type, id, updated) => {
    fetch(
      "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/" +
        type +
        "/" +
        id +
        ".json",
      {
        method: "PATCH",
        body: JSON.stringify(updated),
      }
    );
  };

  // add new transfer
  const transferFormSubmitHandler = (event) => {
    event.preventDefault();

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
        fetchList(data, fetchedAccountList);
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
        postChangedAccountCategoryBalance(
          "accounts",
          accountId,
          updatedAccount
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
          // shown form is cleared
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
          .then((response) => props.updateHomeHandler());
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

    // if amount changed, we should change balance of account
    if (props.editedTransferForm.Amount !== transferForm.Amount) {
      // fetch accountList from server
      fetch(
        "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/accounts.json"
      )
        .then((response) => response.json())
        .then((data) => {
          fetchList(data, fetchedAccountList);
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
          postChangedAccountCategoryBalance(
            "accounts",
            accountId,
            updatedAccount
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
          postChangedAccountCategoryBalance(
            "accounts",
            accountId,
            updatedAccount
          )
            // shown form is cleared
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
            .then((response) => props.updateHomeHandler());
        });
    }
    // close the editable form automatically
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
      accountList={props.accountList}
      categoryList={props.categoryList}
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
        updateForm={updateFormHandler}
        selectedDate={transferForm.Date}
        formSubmitHandler={transferFormUpdateHandler}
        handleDateChange={updateFormHandler}
        showEditedForm={showEditedForm}
        transfers
        accountList={props.accountList}
        categoryList={props.categoryList}
        accountsLabel="From"
        accountsLabelTransferTo="To"
        btnName="add transfer"
        btnColor="default"
      />
    );

  return <Box>{form}</Box>;
};

export default TransferForm;
