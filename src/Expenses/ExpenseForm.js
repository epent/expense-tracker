import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";

import Form from "../Forms/Form";

const ExpenseForm = (props) => {
  const [expenseForm, setExpenseForm] = useState({
    From: "",
    To: "",
    Amount: 0,
    Date: new Date().toDateString(),
    Comment: "",
  });

  // to show the changed form instead of the empty (after editFormHandler is triggered), we need to pass another form to <Form/>
  const [showEditedForm, setShowEditedForm] = useState(false);

  const fetchedAccountList = [];

  const fetchedCategoryList = [];

  const fetchedBalanceList = [];

  useEffect(() => {
    if (props.editedExpenseForm) {
      setExpenseForm({
        ...props.editedExpenseForm,
      });
    }
  }, []);

  // update empty form
  const updateFormHandler = (event, formKey) => {
    formKey === "Date"
      ? setExpenseForm({
          ...expenseForm,
          Date: event.toDateString(),
        })
      : formKey === "Amount"
      ? setExpenseForm({
          ...expenseForm,
          [formKey]: Number(event.target.value),
        })
      : setExpenseForm({
          ...expenseForm,
          [formKey]: event.target.value,
        });
  };

  // edit pre-filled form
  const editFormHandler = (event, formKey) => {
    formKey === "Date"
      ? setExpenseForm({
          ...expenseForm,
          Date: event.toDateString(),
        })
      : formKey === "Amount"
      ? setExpenseForm({
          ...expenseForm,
          [formKey]: Number(event.target.value),
        })
      : setExpenseForm({
          ...expenseForm,
          [formKey]: event.target.value,
        });

    setShowEditedForm(true);
  };

  // add new expense
  const expenseFormSubmitHandler = (event) => {
    event.preventDefault();
    console.log("Expense form submitted: ");
    console.log(expenseForm);

    // post new expenseForm to server
    fetch(
      "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/expenses.json",
      {
        method: "POST",
        body: JSON.stringify(expenseForm),
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

      // update accountBalance after new expense
      .then((response) => {
        const account = fetchedAccountList.filter(
          (account) => account.Name === expenseForm.From
        );
        const updatedAccount = {
          Balance: Number(account[0].Balance) - Number(expenseForm.Amount),
        };
        const accountId = account[0].id;

        // post changed accountBalance to server
        fetch(
          "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/accounts/" +
            accountId +
            ".json",
          {
            method: "PATCH",
            body: JSON.stringify(updatedAccount),
          }
        );
      });

    // fetch categoryList from server
    fetch(
      "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/categories.json"
    )
      .then((response) => response.json())
      .then((data) => {
        for (let key in data) {
          fetchedCategoryList.push({
            ...data[key],
            id: key,
          });
        }

        console.log(fetchedCategoryList);
      })

      // update categoryBalance after new expense
      .then((response) => {
        const category = fetchedCategoryList.filter(
          (category) => category.Name === expenseForm.To
        );
        const updatedCategory = {
          Balance: Number(category[0].Balance) + Number(expenseForm.Amount),
        };
        const categoryId = category[0].id;

        // post changed categoryBalance to server
        fetch(
          "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/categories/" +
            categoryId +
            ".json",
          {
            method: "PATCH",
            body: JSON.stringify(updatedCategory),
          }
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

      // update totalBalances after new expense
      .then((response) => {
        const totalExpenses = fetchedBalanceList.filter((total) => {
          return total.id === "expenses";
        });

        // const totalIncome = fetchedBalanceList.filter((total) => {
        //   return total.id === "income";
        // });

        // const totalBalance = fetchedBalanceList.filter((total) => {
        //   return total.id === "balance";
        // });

        const updatedTotals = {
          expenses:
            Number(totalExpenses[0].expenses) + Number(expenseForm.Amount),
        };

        // post changed totalBalances to server
        fetch(
          "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/total.json",
          {
            method: "PATCH",
            body: JSON.stringify(updatedTotals),
          }
        )
          .then((response) => {
            setExpenseForm({
              From: "",
              To: "",
              Amount: 0,
              Date: new Date().toDateString(),
              Comment: "",
            });
          })

          // trigger the page to rerender with updated expenseLog
          .then((response) => props.updateExpenseLog())
          // trigger Home to rerender with updated accountLog/categoryLog
          .then((response) => props.updateHomeHandler());
      });
  };

  // edit selected expense
  const expenseFormUpdateHandler = (event) => {
    event.preventDefault();

    // post edited expenseForm to server
    fetch(
      "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/expenses/" +
        props.editedExpenseId +
        ".json",
      {
        method: "PATCH",
        body: JSON.stringify(expenseForm),
      }
    );

    if (props.editedExpenseForm.Amount !== expenseForm.Amount) {
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

        // update accountBalance after edited expense
        .then((response) => {
          const account = fetchedAccountList.filter(
            (account) => account.Name === expenseForm.From
          );

          let updatedAccount;
          let accountId;

          if (props.editedExpenseForm.Amount > expenseForm.Amount) {
            updatedAccount = {
              Balance:
                Number(account[0].Balance) +
                (Number(props.editedExpenseForm.Amount) -
                  Number(expenseForm.Amount)),
            };
            accountId = account[0].id;
          }

          if (props.editedExpenseForm.Amount < expenseForm.Amount) {
            updatedAccount = {
              Balance:
                Number(account[0].Balance) -
                (Number(expenseForm.Amount) -
                  Number(props.editedExpenseForm.Amount)),
            };
            accountId = account[0].id;
          }

          // post changed accountBalance to server
          fetch(
            "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/accounts/" +
              accountId +
              ".json",
            {
              method: "PATCH",
              body: JSON.stringify(updatedAccount),
            }
          );
        });
    }

    if (props.editedExpenseForm.Amount !== expenseForm.Amount) {
      // fetch categoryList from server
      fetch(
        "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/categories.json"
      )
        .then((response) => response.json())
        .then((data) => {
          for (let key in data) {
            fetchedCategoryList.push({
              ...data[key],
              id: key,
            });
          }
        })

        // update categoryBalance after edited expense
        .then((response) => {
          const category = fetchedCategoryList.filter(
            (category) => category.Name === expenseForm.To
          );

          let updatedCategory;
          let categoryId;

          if (props.editedExpenseForm.Amount > expenseForm.Amount) {
            updatedCategory = {
              Balance:
                Number(category[0].Balance) -
                (Number(props.editedExpenseForm.Amount) -
                  Number(expenseForm.Amount)),
            };
            categoryId = category[0].id;
          }

          if (props.editedExpenseForm.Amount < expenseForm.Amount) {
            updatedCategory = {
              Balance:
                Number(category[0].Balance) +
                (Number(expenseForm.Amount) -
                  Number(props.editedExpenseForm.Amount)),
            };
            categoryId = category[0].id;
          }

          // post changed categoryBalance to server
          fetch(
            "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/categories/" +
              categoryId +
              ".json",
            {
              method: "PATCH",
              body: JSON.stringify(updatedCategory),
            }
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

        // update totalBalances after new expense
        .then((response) => {
          const totalExpenses = fetchedBalanceList.filter((total) => {
            return total.id === "expenses";
          });

          // const totalIncome = fetchedBalanceList.filter((total) => {
          //   return total.id === "income";
          // });

          // const totalBalance = fetchedBalanceList.filter((total) => {
          //   return total.id === "balance";
          // });

          let updatedTotals;

          if (props.editedExpenseForm.Amount > expenseForm.Amount) {
            updatedTotals = {
              expenses:
                Number(totalExpenses[0].expenses) -
                (Number(props.editedExpenseForm.Amount) -
                  Number(expenseForm.Amount)),
            };
          }

          if (props.editedExpenseForm.Amount < expenseForm.Amount) {
            updatedTotals = {
              expenses:
                Number(totalExpenses[0].expenses) +
                (Number(expenseForm.Amount) -
                  Number(props.editedExpenseForm.Amount)),
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
            .then((response) => {
              setExpenseForm({
                From: "",
                To: "",
                Amount: 0,
                Date: new Date().toDateString(),
                Comment: "",
              });
            })

            // trigger the page to rerender with updated expenseLog
            .then((response) => props.updateExpenseLog())
            // trigger Home to rerender with updated accountLog/categoryLog
            .then((response) => props.updateHomeHandler());
        });
    }
    // close the editable form
    props.setShowExpenseForm();
  };

  let form = (
    <Form
      form={expenseForm}
      updateForm={updateFormHandler}
      selectedDate={expenseForm.Date}
      formSubmitHandler={expenseFormSubmitHandler}
      handleDateChange={updateFormHandler}
      expenses
      accountsLabel="From"
      btnName="add expense"
      btnColor="secondary"
    />
  );

  // if we want to edit expense, the form is pre-filled
  if (props.showEditedForm)
    form = (
      <Form
        form={props.editedExpenseForm}
        editedForm={expenseForm}
        updateForm={editFormHandler}
        selectedDate={expenseForm.Date}
        formSubmitHandler={expenseFormUpdateHandler}
        handleDateChange={editFormHandler}
        showEditedForm={showEditedForm}
        expenses
        accountsLabel="From"
        btnName="edit expense"
        btnColor="secondary"
      />
    );

  return <Box>{form}</Box>;
};

export default ExpenseForm;
