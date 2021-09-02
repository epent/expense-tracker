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

  // shared between both handlers - post changes in accounts to db
  const postChangedBalance = async (type, id, updated) => {
    await fetch(
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

    const postIncomeToDB = () => {
      fetch(
        "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/income.json",
        {
          method: "POST",
          body: JSON.stringify(incomeForm),
        }
      );
    };
    postIncomeToDB();

    const updateAccountBalance = async () => {
      const fetchedAccountList = await fetchDataToList("accounts");

      const updateBalanceInDB = () => {
        const account = fetchedAccountList.filter(
          (account) => account.Name === incomeForm.To
        );
        const updatedAccount = {
          Balance: Number(account[0].Balance) + Number(incomeForm.Amount),
        };
        const accountId = account[0].id;

        postChangedBalance("accounts", accountId, updatedAccount);
      };
      updateBalanceInDB();
    };
    updateAccountBalance();

    const updateTotalBalance = async () => {
      const fetchedTotalList = await fetchDataToList("total", true);

      const updateBalanceInDB = () => {
        const totalIncome = fetchedTotalList.filter((total) => {
          return total.id === "income";
        });

        const updatedTotals = {
          income: Number(totalIncome[0].income) + Number(incomeForm.Amount),
        };

        fetch(
          "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/total.json",
          {
            method: "PATCH",
            body: JSON.stringify(updatedTotals),
          }
        )
          .then((response) => {
            setIncomeForm({
              From: "",
              To: "",
              Amount: 0,
              Date: new Date().toDateString(),
              Comment: "",
            });
          })

          // trigger the page to rerender with updated expenseLog
          .then((response) => props.updateIncomeLog())
          // trigger Home to rerender with updated accountLog/categoryLog
          .then((response) => {
            if (props.updateHomeHandler) props.updateHomeHandler();
          });
      };
      updateBalanceInDB();
    };
    updateTotalBalance();
  };

  // edit selected income
  const incomeFormUpdateHandler = (event) => {
    event.preventDefault();

    const postEditedIncomeToDB = () => {
      fetch(
        `https://expense-tracker-fd99a-default-rtdb.firebaseio.com/income/${props.editedIncomeId}.json`,
        {
          method: "PATCH",
          body: JSON.stringify(incomeForm),
        }
      );
    };
    postEditedIncomeToDB();

    const updateData = async () => {
      const updateAmount = async () => {
        if (props.editedIncomeForm.Amount !== incomeForm.Amount) {
          const updateAccountBalance = async () => {
            const fetchedAccountList = await fetchDataToList("accounts");

            const updateBalanceInDB = () => {
              const account = fetchedAccountList.filter(
                (account) => account.Name === props.editedIncomeForm.To
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
              postChangedBalance("accounts", accountId, updatedAccount);
            };
            updateBalanceInDB();
          };
          await updateAccountBalance();

          const updateTotalBalance = async () => {
            const fetchedTotalList = await fetchDataToList("total", true);

            const updateBalanceInDB = async () => {
              const totalIncome = fetchedTotalList.filter((total) => {
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
        if (props.editedIncomeForm.To !== incomeForm.To) {
          const updateAccountBalance = async (PrevOrCurr) => {
            const fetchedAccountList = await fetchDataToList("accounts");

            const updateBalanceInDB = async () => {
              let accountName;
              PrevOrCurr === "Previous"
                ? (accountName = props.editedIncomeForm.To)
                : (accountName = incomeForm.To);

              const account = fetchedAccountList.filter(
                (account) => account.Name === accountName
              );
              let updatedAccount;

              PrevOrCurr === "Previous"
                ? (updatedAccount = {
                    Balance:
                      Number(account[0].Balance) - Number(incomeForm.Amount),
                  })
                : (updatedAccount = {
                    Balance:
                      Number(account[0].Balance) + Number(incomeForm.Amount),
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

      const triggerUpdates = async () => {
        setIncomeForm({
          From: "",
          To: "",
          Amount: 0,
          Date: new Date().toDateString(),
          Comment: "",
        });

        // trigger the page to rerender with updated expenseLog
        await props.updateIncomeLog();
        // trigger Home to rerender with updated accountLog/categoryLog
        await props.updateHomeHandler();
      };
      await triggerUpdates();
    };
    updateData();

    // close the editable form automatically
    props.setShowIncomeForm();
  };

  const commonProps = {
    updateForm: updateFormHandler,
    handleDateChange: updateFormHandler,
    selectedDate: incomeForm.Date,
    income: true,
    accountList: props.accountList,
    categoryList: props.categoryList,
    accountsLabel: "To",
    btnColor: "primary",
  };

  let form = (
    <Form
      {...commonProps}
      form={incomeForm}
      formSubmitHandler={incomeFormSubmitHandler}
      btnName="add income"
    />
  );

  // if we want to edit expense, the form is pre-filled
  if (props.showEditedForm)
    form = (
      <Form
        {...commonProps}
        form={props.editedIncomeForm}
        editedForm={incomeForm}
        formSubmitHandler={incomeFormUpdateHandler}
        showEditedForm={showEditedForm}
        btnName="edit income"
      />
    );

  return <Box>{form}</Box>;
};

export default IncomeForm;
