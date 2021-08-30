import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";

import Form from "../components/Forms/Form";

const IncomeForm = (props) => {
  const [incomeForm, setIncomeForm] = useState({
    From: "",
    To: "",
    Amount: 0,
    Date: new Date().toDateString(),
    Comment: "",
  });

  // to show the changed form instead of the empty (after editFormHandler is triggered), we need to pass another form to <Form/>
  const [showEditedForm, setShowEditedForm] = useState(false);

  // below are 2 lists that we fill with data fetched from db (to use after)
  const fetchedAccountList = [];

  const fetchedBalanceList = [];

  // if we trigger edit, prefilled form is shown by default
  useEffect(() => {
    if (props.editedIncomeForm) {
      setIncomeForm({
        ...props.editedIncomeForm,
      });
    }
  }, []);

  // update/edit the form
  const updateFormHandler = (event, formKey) => {
    formKey === "Date"
      ? setIncomeForm({
          ...incomeForm,
          Date: event.toDateString(),
        })
      : formKey === "Amount"
      ? setIncomeForm({
          ...incomeForm,
          [formKey]: Number(event.target.value),
        })
      : setIncomeForm({
          ...incomeForm,
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
      `https://expense-tracker-fd99a-default-rtdb.firebaseio.com/${type}/${id}.json`,
      {
        method: "PATCH",
        body: JSON.stringify(updated),
      }
    );
  };

  // add new income
  const incomeFormSubmitHandler = (event) => {
    event.preventDefault();

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
        fetchList(data, fetchedAccountList);
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
        postChangedAccountCategoryBalance(
          "accounts",
          accountId,
          updatedAccount
        );
      });

    // fetch totalBalances from server
    fetch(
      "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/total.json"
    )
      .then((response) => response.json())
      .then((data) => {
        for (let index in data) {
          fetchedBalanceList.push({
            [index]: data[index],
            id: index,
          });
        }
        console.log(fetchedBalanceList);
      })

      // update totalBalances after new income
      .then((response) => {
        const totalIncome = fetchedBalanceList.filter((total) => {
          return total.id === "income";
        });
        console.log(totalIncome);

        const updatedTotals = {
          income: Number(totalIncome[0].income) + Number(incomeForm.Amount),
        };

        // post changed totalBalances to server
        fetch(
          "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/total.json",
          {
            method: "PATCH",
            body: JSON.stringify(updatedTotals),
          }
        )
          // shown form is cleared
          .then((response) => {
            setIncomeForm({
              From: "",
              To: "",
              Amount: 0,
              Date: new Date().toDateString(),
              Comment: "",
            });
          })

          // trigger the page to rerender with updated incomeLog
          .then((response) => props.updateIncomeLog())
          // trigger Home to rerender with updated accountLog/categoryLog
          .then((response) => {
            if (props.updateHomeHandler) props.updateHomeHandler();
          });
      });
  };

  // edit selected income
  const incomeFormUpdateHandler = (event) => {
    event.preventDefault();

    // post edited incomeForm to server
    fetch(
      `https://expense-tracker-fd99a-default-rtdb.firebaseio.com/income/${props.editedIncomeId}.json`,
      {
        method: "PATCH",
        body: JSON.stringify(incomeForm),
      }
    );

    // if amount changed, we should change balance of account
    if (props.editedIncomeForm.Amount !== incomeForm.Amount) {
      // fetch accountList from server
      fetch(
        "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/accounts.json"
      )
        .then((response) => response.json())
        .then((data) => {
          fetchList(data, fetchedAccountList);
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
          postChangedAccountCategoryBalance(
            "accounts",
            accountId,
            updatedAccount
          );
        });

      // fetch totalBalances from server
      fetch(
        "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/total.json"
      )
        .then((response) => response.json())
        .then((data) => {
          for (let index in data) {
            fetchedBalanceList.push({
              [index]: data[index],
              id: index,
            });
          }
          console.log(fetchedBalanceList);
        })

        // update totalBalances after new income
        .then((response) => {
          const totalIncome = fetchedBalanceList.filter((total) => {
            return total.id === "income";
          });

          let updatedTotals;

          if (props.editedIncomeForm.Amount > incomeForm.Amount) {
            updatedTotals = {
              income:
                Number(totalIncome[0].income) -
                (Number(props.editedIncomeForm.Amount) -
                  Number(incomeForm.Amount)),
            };
          }

          if (props.editedIncomeForm.Amount < incomeForm.Amount) {
            updatedTotals = {
              income:
                Number(totalIncome[0].income) +
                (Number(incomeForm.Amount) -
                  Number(props.editedIncomeForm.Amount)),
            };
          }

          // post changed totalBalances to server
          fetch(
            "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/total.json",
            {
              method: "PATCH",
              body: JSON.stringify(updatedTotals),
            }
          )
            // shown form is cleared
            .then((response) => {
              setIncomeForm({
                From: "",
                To: "",
                Amount: 0,
                Date: new Date().toDateString(),
                Comment: "",
              });
            })

            // trigger the page to rerender with updated incomeLog
            .then((response) => props.updateIncomeLog())
            // trigger Home to rerender with updated accountLog/categoryLog
            .then((response) => {
              if (props.updateHomeHandler) props.updateHomeHandler();
            });
        });
    }

    // close the editable form automatically
    props.setShowIncomeForm();
  };

  let form = (
    <Form
      form={incomeForm}
      updateForm={updateFormHandler}
      selectedDate={incomeForm.Date}
      formSubmitHandler={incomeFormSubmitHandler}
      handleDateChange={updateFormHandler}
      income
      accountList={props.accountList}
      categoryList={props.categoryList}
      accountsLabel="To"
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
        updateForm={updateFormHandler}
        selectedDate={incomeForm.Date}
        formSubmitHandler={incomeFormUpdateHandler}
        handleDateChange={updateFormHandler}
        showEditedForm={showEditedForm}
        income
        accountList={props.accountList}
        categoryList={props.categoryList}
        accountsLabel="To"
        btnName="edit income"
        btnColor="primary"
      />
    );

  return <Box>{form}</Box>;
};

export default IncomeForm;
