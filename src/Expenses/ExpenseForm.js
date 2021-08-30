import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";

import Form from "../components/Forms/Form";

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

  // below are 3 lists that we fill with data fetched from db (to use after)
  const fetchedAccountList = [];

  const fetchedCategoryList = [];

  const fetchedBalanceList = [];

  // if we trigger edit, prefilled form is shown by default
  useEffect(() => {
    if (props.editedExpenseForm) {
      setExpenseForm({
        ...props.editedExpenseForm,
      });
    }
  }, []);

  // update/edit the form
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

    setShowEditedForm(true);
  };

  // shared between both handlers - put fetched accounts/categories to the list
  const fetchedDataToTheList = (data, listName) => {
    Object.keys(data).map((key) => {
      listName.push({
        ...data[key],
        id: key,
      });
    });
  };

  // shared between both handlers - post changes in accounts/categories to db
  const postChangedAccountCategoryBalance = (type, id, updated) => {
    fetch(
      `https://expense-tracker-fd99a-default-rtdb.firebaseio.com/${type}/${id}.json`,
      {
        method: "PATCH",
        body: JSON.stringify(updated),
      }
    );
  };

  // add new expense
  const expenseFormSubmitHandler = (event) => {
    event.preventDefault();

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
        fetchedDataToTheList(data, fetchedAccountList);
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
        postChangedAccountCategoryBalance(
          "accounts",
          accountId,
          updatedAccount
        );
      });

    // fetch categoryList from server
    fetch(
      "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/categories.json"
    )
      .then((response) => response.json())
      .then((data) => {
        fetchedDataToTheList(data, fetchedCategoryList);
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
        postChangedAccountCategoryBalance(
          "categories",
          categoryId,
          updatedCategory
        );
      });

    // fetch totalBalances from server
    fetch(
      "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/total.json"
    )
      .then((response) => response.json())
      .then((data) => {
        Object.keys(data).map((key) => {
          fetchedBalanceList.push({
            [key]: data[key],
            id: key,
          });
        });
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
          // shown form is cleared
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
          .then((response) => {
            if (props.updateHomeHandler) props.updateHomeHandler();
          });
      });
  };

  // edit selected expense
  const expenseFormUpdateHandler = (event) => {
    event.preventDefault();

    // post edited expenseForm to server
    fetch(
      `https://expense-tracker-fd99a-default-rtdb.firebaseio.com/expenses/${props.editedExpenseId}.json`,
      {
        method: "PATCH",
        body: JSON.stringify(expenseForm),
      }
    );

    // if amount changed, we should change balances of category and account
    if (props.editedExpenseForm.Amount !== expenseForm.Amount) {
      // fetch accountList from server
      fetch(
        "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/accounts.json"
      )
        .then((response) => response.json())
        .then((data) => {
          fetchedDataToTheList(data, fetchedAccountList);
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
          postChangedAccountCategoryBalance(
            "accounts",
            accountId,
            updatedAccount
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
          fetchedDataToTheList(data, fetchedCategoryList);
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
          postChangedAccountCategoryBalance(
            "categories",
            categoryId,
            updatedCategory
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
            // shown form is cleared
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
            .then((response) => {
              if (props.updateHomeHandler) props.updateHomeHandler();
            });
        });
    }
    // close the editable form automatically
    props.setShowExpenseForm();
  };

  const commonProps = {
    updateForm: updateFormHandler,
    handleDateChange: updateFormHandler,
    selectedDate: expenseForm.Date,
    expenses: true,
    accountList: props.accountList,
    categoryList: props.categoryList,
    accountsLabel: "From",
    btnColor: "secondary",
  };

  let form = (
    <Form
      {...commonProps}
      form={expenseForm}
      formSubmitHandler={expenseFormSubmitHandler}
      btnName="add expense"
    />
  );

  // if we want to edit expense, the form is pre-filled
  if (props.showEditedForm)
    form = (
      <Form
        {...commonProps}
        form={props.editedExpenseForm}
        editedForm={expenseForm}
        formSubmitHandler={expenseFormUpdateHandler}
        showEditedForm={showEditedForm}
        btnName="edit expense"
      />
    );

  return <Box>{form}</Box>;
};

export default ExpenseForm;
