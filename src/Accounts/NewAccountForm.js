import React, { useState } from "react";

import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import AccountCategoryForm from "../components/Forms/AccountCategoryForm";

import {
  fetchDataToList,
  postUpdatedTotal,
  postNewTransactionToDB as postNewAccountToDB,
  postEditedTransactionToDB as postEditedAccountToDB,
} from "../modules/fetch";

import { checkAccountFormValidity } from "../modules/validation";

const NewAccountForm = (props) => {
  const useStyles = makeStyles((theme) => ({
    paper: {
      backgroundColor: "#fafafa",
      borderRadius: 10,
      height: props.paperHeight,
    },
  }));
  const classes = useStyles();

  const [accountForm, setAccountForm] = useState({
    Name: "",
    Category: "",
    Balance: "",
  });

  const validityRules = {
    required: true,
  };

  const [formIsValid, setFormIsValid] = useState(true);

  const accountCategoriesList = ["Bank account", "Credit card", "Cash"];

  const updateFormHandler = (event, formKey) => {
    setAccountForm({
      ...accountForm,
      [formKey]: event.target.value,
    });
  };

  // add new account
  const accountFormSubmitHandler = (event) => {
    event.preventDefault();
    setFormIsValid(false);

    const updateData = async () => {
      const updateTotalBalance = async () => {
        const fetchedTotalList = await fetchDataToList("total", true);

        const updateBalanceInDB = async () => {
          const totalBalance = fetchedTotalList.filter((total) => {
            return total.id === "balance";
          });

          const updatedTotals = {
            balance:
              Number(totalBalance[0].balance) + Number(accountForm.Balance),
          };

          await postUpdatedTotal(updatedTotals);
        };
        await updateBalanceInDB();
      };
      await updateTotalBalance();

      const triggerUpdates = async () => {
        setAccountForm({
          Name: "",
          Category: "",
          Balance: "",
        });

        // trigger the page to rerender with updated categoryLog
        await props.updateAccountsHandler();
      };
      await triggerUpdates();
    };

    const formIsValid = checkAccountFormValidity(accountForm, validityRules);
    console.log(formIsValid);

    if (formIsValid) {
      setFormIsValid(true);
      postNewAccountToDB(accountForm, "accounts");
      updateData();
    }
  };

  // const accountFormUpdateHandler = (event) => {
  //   event.preventDefault();

  //   const updateData = async () => {
  //     // post edited accountForm to server
  //     await postEditedAccountToDB(
  //       accountForm,
  //       "accounts",
  //       props.editedAccountId
  //     );

  //     const triggerUpdates = async () => {
  //       setAccountForm({
  //         Name: "",
  //         Category: "",
  //         Balance: "",
  //       });

  //       // trigger the page to rerender with updated accountLog
  //       await props.updateAccountLog();
  //     };
  //     await triggerUpdates();
  //   };
  //   updateData();

  //   // close the editable form automatically
  //   props.setShowAccountForm();
  // };

  let helperTextName, helperTextCategory, helperTextBalance;
  let invalidInputName, invalidInputCategory, invalidInputBalance;

  if (formIsValid === false) {
    if (accountForm.Name === "") {
      helperTextName = "Please fill in";
      invalidInputName = true;
    }
    if (accountForm.Category === "") {
      helperTextCategory = "Please fill in";
      invalidInputCategory = true;
    }
    if (
      accountForm.Balance < 0 ||
      accountForm.Balance != Number(accountForm.Balance)
    ) {
      helperTextBalance = "Invalid input";
      invalidInputBalance = true;
    }
    if (accountForm.Balance === "") {
      helperTextBalance = "Please fill in";
      invalidInputBalance = true;
    }
  }

  return (
    <Box>
      <Paper elevation={3} className={classes.paper}>
        <Box p={3}>
          <Typography variant="h5" color="textSecondary">
            {props.pageTitle}
          </Typography>
        </Box>
        <Box mx={3}>
          <AccountCategoryForm
            form={accountForm}
            updateForm={updateFormHandler}
            accountCategoriesList={accountCategoriesList}
            formSubmitHandler={accountFormSubmitHandler}
            helperTextName={helperTextName}
            helperTextCategory={helperTextCategory}
            helperTextAmount={helperTextBalance}
            invalidInputName={invalidInputName}
            invalidInputCategory={invalidInputCategory}
            invalidInputAmount={invalidInputBalance}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default NewAccountForm;
