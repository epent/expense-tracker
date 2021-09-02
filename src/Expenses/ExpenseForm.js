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

  const fetchDataToList = async (urlName, isTotal) => {
    const pushFetchedDataToList = (data) => {
      const list = [];
      isTotal
        ? Object.keys(data).map((key) => {
            list.push({
              [key]: data[key],
              id: key,
            });
          })
        : Object.keys(data).map((key) => {
            list.push({
              ...data[key],
              id: key,
            });
          });
      return list;
    };

    const response = await fetch(
      `https://expense-tracker-fd99a-default-rtdb.firebaseio.com/${urlName}.json`
    );
    const fetchedData = await response.json();
    const fetchedDataList = pushFetchedDataToList(fetchedData);
    return fetchedDataList;
  };

  // shared between both handlers - post changes in accounts/categories to db
  const postChangedBalance = async (type, id, updated) => {
    await fetch(
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

    const postExpenseToDB = () => {
      fetch(
        "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/expenses.json",
        {
          method: "POST",
          body: JSON.stringify(expenseForm),
        }
      );
    };
    postExpenseToDB();

    const updateAccountBalance = async () => {
      const fetchedAccountList = await fetchDataToList("accounts");

      const updateBalanceInDB = () => {
        const account = fetchedAccountList.filter(
          (account) => account.Name === expenseForm.From
        );
        const updatedAccount = {
          Balance: Number(account[0].Balance) - Number(expenseForm.Amount),
        };
        const accountId = account[0].id;

        postChangedBalance("accounts", accountId, updatedAccount);
      };
      updateBalanceInDB();
    };
    updateAccountBalance();

    const updateCategoryBalance = async () => {
      const fetchedCategoryList = await fetchDataToList("categories");

      const updateBalanceInDB = () => {
        const category = fetchedCategoryList.filter(
          (category) => category.Name === expenseForm.To
        );
        const updatedCategory = {
          Balance: Number(category[0].Balance) + Number(expenseForm.Amount),
        };
        const categoryId = category[0].id;

        postChangedBalance("categories", categoryId, updatedCategory);
      };
      updateBalanceInDB();
    };
    updateCategoryBalance();

    const updateTotalBalance = async () => {
      const fetchedTotalList = await fetchDataToList("total", true);

      const updateBalanceInDB = () => {
        const totalExpenses = fetchedTotalList.filter((total) => {
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
            Number(totalExpenses[0].expenses) - Number(expenseForm.Amount),
        };

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
          .then((response) => {
            if (props.updateHomeHandler) props.updateHomeHandler();
          });
      };
      updateBalanceInDB();
    };
    updateTotalBalance();
  };

  // edit selected expense
  const expenseFormUpdateHandler = (event) => {
    event.preventDefault();

    const postEditedExpenseToDB = () => {
      fetch(
        `https://expense-tracker-fd99a-default-rtdb.firebaseio.com/expenses/${props.editedExpenseId}.json`,
        {
          method: "PATCH",
          body: JSON.stringify(expenseForm),
        }
      );
    };
    postEditedExpenseToDB();

    const updateData = async () => {
      const updateAmount = async () => {
        if (props.editedExpenseForm.Amount !== expenseForm.Amount) {
          const updateAccountBalance = async () => {
            const fetchedAccountList = await fetchDataToList("accounts");

            const updateBalanceInDB = () => {
              const account = fetchedAccountList.filter(
                (account) => account.Name === props.editedExpenseForm.From
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
              postChangedBalance("accounts", accountId, updatedAccount);
            };
            updateBalanceInDB();
          };
          await updateAccountBalance();

          const updateCategoryBalance = async () => {
            const fetchedCategoryList = await fetchDataToList("categories");

            const updateBalanceInDB = () => {
              const category = fetchedCategoryList.filter(
                (category) => category.Name === props.editedExpenseForm.To
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
              postChangedBalance("categories", categoryId, updatedCategory);
            };
            updateBalanceInDB();
          };
          await updateCategoryBalance();

          const updateTotalBalance = async () => {
            const fetchedTotalList = await fetchDataToList("total", true);

            const updateBalanceInDB = async () => {
              const totalExpenses = fetchedTotalList.filter((total) => {
                return total.id === "expenses";
              });

              // const totalBalance = fetchedBalanceList.filter((total) => {
              //   return total.id === "balance";
              // });

              let updatedTotals;

              if (props.editedExpenseForm.Amount < expenseForm.Amount) {
                updatedTotals = {
                  expenses:
                    Number(totalExpenses[0].expenses) -
                    (Number(expenseForm.Amount) -
                      Number(props.editedExpenseForm.Amount)),
                };
              }

              if (props.editedExpenseForm.Amount > expenseForm.Amount) {
                updatedTotals = {
                  expenses:
                    Number(totalExpenses[0].expenses) +
                    (Number(props.editedExpenseForm.Amount) -
                      Number(expenseForm.Amount)),
                };
              }

              await fetch(
                "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/total.json",
                {
                  method: "PATCH",
                  body: JSON.stringify(updatedTotals),
                }
              );
            };
            await updateBalanceInDB();
          };
          await updateTotalBalance();
        }
      };
      await updateAmount();

      const updateAccount = async () => {
        if (props.editedExpenseForm.From !== expenseForm.From) {
          const updateAccountBalance = async (PrevOrCurr) => {
            const fetchedAccountList = await fetchDataToList("accounts");

            const updateBalanceInDB = async () => {
              let accountName;
              PrevOrCurr === "Previous"
                ? (accountName = props.editedExpenseForm.From)
                : (accountName = expenseForm.From);

              const account = fetchedAccountList.filter(
                (account) => account.Name === accountName
              );
              let updatedAccount;

              PrevOrCurr === "Previous"
                ? (updatedAccount = {
                    Balance:
                      Number(account[0].Balance) + Number(expenseForm.Amount),
                  })
                : (updatedAccount = {
                    Balance:
                      Number(account[0].Balance) - Number(expenseForm.Amount),
                  });

              const accountId = account[0].id;
              await postChangedBalance("accounts", accountId, updatedAccount);
            };
            await updateBalanceInDB();
          };
          await updateAccountBalance("Previous");
          await updateAccountBalance("Current");
        }
      };
      await updateAccount();

      const updateCategory = async () => {
        if (props.editedExpenseForm.To !== expenseForm.To) {
          const updateCategoryBalance = async (PrevOrCurr) => {
            const fetchedCategoryList = await fetchDataToList("categories");

            const updateBalanceInDB = async () => {
              let categoryName;
              PrevOrCurr === "Previous"
                ? (categoryName = props.editedExpenseForm.To)
                : (categoryName = expenseForm.To);

              const category = fetchedCategoryList.filter(
                (category) => category.Name === categoryName
              );
              let updatedCategory;

              PrevOrCurr === "Previous"
                ? (updatedCategory = {
                    Balance:
                      Number(category[0].Balance) - Number(expenseForm.Amount),
                  })
                : (updatedCategory = {
                    Balance:
                      Number(category[0].Balance) + Number(expenseForm.Amount),
                  });

              const categoryId = category[0].id;

              await postChangedBalance(
                "categories",
                categoryId,
                updatedCategory
              );
            };
            await updateBalanceInDB();
          };
          await updateCategoryBalance("Previous");
          await updateCategoryBalance("Current");
        }
      };
      await updateCategory();

      const triggerUpdates = async () => {
        setExpenseForm({
          From: "",
          To: "",
          Amount: 0,
          Date: new Date().toDateString(),
          Comment: "",
        });

        // trigger the page to rerender with updated expenseLog
        await props.updateExpenseLog();
        // trigger Home to rerender with updated accountLog/categoryLog
        await props.updateHomeHandler();
      };
      await triggerUpdates();
    };
    updateData();

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
