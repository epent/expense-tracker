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

  // add new transfer
  const transferFormSubmitHandler = (event) => {
    event.preventDefault();

    const postTransferToDB = () => {
      fetch(
        "https://expense-tracker-fd99a-default-rtdb.firebaseio.com/transfers.json",
        {
          method: "POST",
          body: JSON.stringify(transferForm),
        }
      );
    };
    postTransferToDB();

    const updateTransferForm = async () => {
      setTransferForm({
        From: "",
        To: "",
        Amount: 0,
        Date: new Date().toDateString(),
        Comment: "",
      });
      // trigger the page to rerender with updated expenseLog
      props.updateTransferLog();

      // trigger Home to rerender with updated accountLog/categoryLog
      props.updateHomeHandler();
    };

    const updateAccountBalance = async (fromOrTo) => {
      const fetchedAccountList = await fetchDataToList("accounts");

      const updateBalanceInDB = () => {
        let accountName;
        fromOrTo === "From"
          ? (accountName = transferForm.From)
          : (accountName = transferForm.To);

        const account = fetchedAccountList.filter(
          (account) => account.Name === accountName
        );

        let updatedAccount;
        fromOrTo === "From"
          ? (updatedAccount = {
              Balance: Number(account[0].Balance) - Number(transferForm.Amount),
            })
          : (updatedAccount = {
              Balance: Number(account[0].Balance) + Number(transferForm.Amount),
            });
        const accountId = account[0].id;

        postChangedBalance("accounts", accountId, updatedAccount);
      };
      updateBalanceInDB();
      await updateTransferForm();
    };
    updateAccountBalance("From");
    updateAccountBalance("To");
  };

  // edit selected transfer
  const transferFormUpdateHandler = (event) => {
    event.preventDefault();

    const postEditedExpenseToDB = () => {
      fetch(
        `https://expense-tracker-fd99a-default-rtdb.firebaseio.com/transfers/${props.editedTransferId}.json`,
        {
          method: "PATCH",
          body: JSON.stringify(transferForm),
        }
      );
    };
    postEditedExpenseToDB();

    const updateData = async () => {
      const updateAccountFrom = async () => {
        if (props.editedTransferForm.From !== transferForm.From) {
          const updateAccountBalance = async (PrevOrCurr) => {
            const fetchedAccountList = await fetchDataToList("accounts");

            const updateBalanceInDB = async () => {
              let accountName;
              PrevOrCurr === "Previous"
                ? (accountName = props.editedTransferForm.From)
                : (accountName = transferForm.From);

              const account = fetchedAccountList.filter(
                (account) => account.Name === accountName
              );
              let updatedAccount;

              PrevOrCurr === "Previous"
                ? (updatedAccount = {
                    Balance:
                      Number(account[0].Balance) +
                      Number(props.editedTransferForm.Amount),
                  })
                : (updatedAccount = {
                    Balance:
                      Number(account[0].Balance) -
                      Number(props.editedTransferForm.Amount),
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
      await updateAccountFrom();

      const updateAccountTo = async () => {
        if (props.editedTransferForm.To !== transferForm.To) {
          const updateAccountBalance = async (PrevOrCurr) => {
            const fetchedAccountList = await fetchDataToList("accounts");

            const updateBalanceInDB = async () => {
              let accountName;
              PrevOrCurr === "Previous"
                ? (accountName = props.editedTransferForm.To)
                : (accountName = transferForm.To);

              const account = fetchedAccountList.filter(
                (account) => account.Name === accountName
              );
              let updatedAccount;

              PrevOrCurr === "Previous"
                ? (updatedAccount = {
                    Balance:
                      Number(account[0].Balance) -
                      Number(props.editedTransferForm.Amount),
                  })
                : (updatedAccount = {
                    Balance:
                      Number(account[0].Balance) +
                      Number(props.editedTransferForm.Amount),
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
      await updateAccountTo();

      const updateAmount = async () => {
        if (props.editedTransferForm.Amount !== transferForm.Amount) {
          const updateAccountBalanceFrom = async () => {
            const fetchedAccountList = await fetchDataToList("accounts");

            const updateBalanceInDB = async () => {
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
              await postChangedBalance("accounts", accountId, updatedAccount);
            };
            await updateBalanceInDB();
          };
          await updateAccountBalanceFrom();

          const updateAccountBalanceTo = async () => {
            const fetchedAccountList = await fetchDataToList("accounts");

            const updateBalanceInDB = async () => {
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
              await postChangedBalance("accounts", accountId, updatedAccount);
            };
            await updateBalanceInDB();
          };
          await updateAccountBalanceTo();
        }
      };
      await updateAmount();

      const triggerUpdates = async () => {
        setTransferForm({
          From: "",
          To: "",
          Amount: 0,
          Date: new Date().toDateString(),
          Comment: "",
        });

        // trigger the page to rerender with updated expenseLog
        await props.updateTransferLog();
        // trigger Home to rerender with updated accountLog/categoryLog
        await props.updateHomeHandler();
      };
      await triggerUpdates();
    };
    updateData();

    // close the editable form automatically
    props.setShowTransferForm();
  };

  const commonProps = {
    updateForm: updateFormHandler,
    handleDateChange: updateFormHandler,
    selectedDate: transferForm.Date,
    transfers: true,
    accountList: props.accountList,
    categoryList: props.categoryList,
    accountsLabel: "From",
    accountsLabelTransferTo: "To",
    btnColor: "default",
  };

  let form = (
    <Form
      {...commonProps}
      form={transferForm}
      formSubmitHandler={transferFormSubmitHandler}
      btnName="add transfer"
    />
  );

  if (props.showEditedForm)
    form = (
      <Form
        {...commonProps}
        form={props.editedTransferForm}
        editedForm={transferForm}
        formSubmitHandler={transferFormUpdateHandler}
        showEditedForm={showEditedForm}
        btnName="edit transfer"
      />
    );

  return <Box>{form}</Box>;
};

export default TransferForm;
