import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";

import Form from "../Forms/Form";

const IncomeForm = (props) => {
  const [incomeForm, setIncomeForm] = useState({
    From: "",
    To: "",
    Amount: 0,
    Date: new Date(),
    Comment: "",
  });

  // to show the changed form instead of the empty (after editFormHandler is triggered), we need to pass another form to <Form/>
  const [showEditedForm, setShowEditedForm] = useState(false);

  const fetchedAccountList = [];

  useEffect(() => {
    if (props.editedIncomeForm) {
      setIncomeForm({
        ...props.editedIncomeForm,
      });
    }
  }, []);

  // update empty form
  const updateFormHandler = (event, formKey) => {
    setIncomeForm({
      ...incomeForm,
      [formKey]: event.target.value,
    });
  };

  // edit pre-filled form
  const editFormHandler = (event, formKey) => {
    setIncomeForm({
      ...incomeForm,
      [formKey]: event.target.value,
    });

    setShowEditedForm(true);
  };

  const handleDateChange = (date) => {
    setIncomeForm({
      ...incomeForm,
      Date: date.toDateString(),
    });
  };

  // add new income
  const incomeFormSubmitHandler = (event) => {
    event.preventDefault();
    console.log("Income form submitted: ");
    console.log(incomeForm);

    // post new incomeForm to server
    fetch(
      "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/income.json",
      {
        method: "POST",
        body: JSON.stringify(incomeForm),
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

      // update accountBalance after new income
      .then((response) => {
        const account = fetchedAccountList.filter(
          (account) => account.Name === incomeForm.To
        );
        const updatedAccount = {
          Balance: Number(account[0].Balance) + Number(incomeForm.Amount),
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
          setIncomeForm({
            From: "",
            To: "",
            Amount: 0,
            Date: new Date(),
            Comment: "",
          });
        });
      });
  };

  const incomeFormUpdateHandler = (event) => {
    event.preventDefault();

    // post edited incomeForm to server
    fetch(
      "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/income/" +
        props.editedIncomeId +
        ".json",
      {
        method: "PATCH",
        body: JSON.stringify(incomeForm),
      }
    );

    if (props.editedIncomeForm.Amount !== incomeForm.Amount) {
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

        // update accountBalance after edited income
        .then((response) => {
          const account = fetchedAccountList.filter(
            (account) => account.Name === incomeForm.To
          );

          let updatedAccount;
          let accountId;

          if (props.editedIncomeForm.Amount > incomeForm.Amount) {
            updatedAccount = {
              Balance:
                Number(account[0].Balance) -
                (Number(props.editedIncomeForm.Amount) -
                  Number(incomeForm.Amount)),
            };
            accountId = account[0].id;
          }

          if (props.editedIncomeForm.Amount < incomeForm.Amount) {
            updatedAccount = {
              Balance:
                Number(account[0].Balance) +
                (Number(incomeForm.Amount) -
                  Number(props.editedIncomeForm.Amount)),
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
          ).then((response) => {
            setIncomeForm({
              From: "",
              To: "",
              Amount: 0,
              Date: new Date(),
              Comment: "",
            });
          });
        });
    }

    // close the editable form
    props.setShowIncomeForm();
  };

  let form = (
    <Form
      form={incomeForm}
      updateForm={updateFormHandler}
      selectedDate={incomeForm.Date}
      formSubmitHandler={incomeFormSubmitHandler}
      handleDateChange={handleDateChange}
      btnName="add income"
      btnColor="primary"
    />
  );

  // if we want to edit expense, the form is pre-filled
  if (props.showEditedForm)
    form = (
      <Form
        form={props.editedIncomeForm}
        editedForm={incomeForm}
        updateForm={editFormHandler}
        selectedDate={incomeForm.Date}
        formSubmitHandler={incomeFormUpdateHandler}
        handleDateChange={handleDateChange}
        showEditedForm={showEditedForm}
        btnName="edit income"
        btnColor="primary"
      />
    );

  return <Box>{form}</Box>;
};

export default IncomeForm;
