import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";

import NewForm from "./NewForm";
import {
  fetchAccountsFromDB,
  fetchCategoriesFromDB,
  postNewTransactionToDB,
} from "../../modules/fetch";
import {
  updateAccountBalance,
  updateCategoryBalance,
  updateTotalBalance,
} from "../../modules/formsubmission";
import { checkFormValidity } from "../../modules/validation";

const useStyles = makeStyles({
  root: {
    width: 740,
    height: 415,
    backgroundColor: "#fafafa",
    borderRadius: 10,
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: 680,
  },
});

const NewTransactionForm = (props) => {
  const classes = useStyles();

  const [accountList, setAccountList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  const [openForm, setOpenForm] = useState("expense");

  const [expenseForm, setExpenseForm] = useState({
    From: "",
    To: "",
    Amount: "",
    Date: new Date().toDateString(),
    Comment: "",
  });

  const validityRules = {
    required: true,
    greaterThanZero: true,
  };

  const [formIsValid, setFormIsValid] = useState(true);

  useEffect(() => {
    // fetch accountList from server when form is opened
    const fetchAccounts = async () => {
      const fetchedAccountList = await fetchAccountsFromDB();
      const accountList = fetchedAccountList.map((account) => {
        return account.Name;
      });

      setAccountList(accountList);
      console.log(accountList);
    };
    fetchAccounts();

    // fetch categoryList from server when form is opened
    const fetchCategories = async () => {
      const fetchedCategoryList = await fetchCategoriesFromDB();
      const categoryList = fetchedCategoryList.map((category) => {
        return category.Name;
      });

      setCategoryList(categoryList);
      console.log(categoryList);
    };
    fetchCategories();
  }, []);

  const openExpenseFormHandler = () => {
    setOpenForm("expense");
  };
  const openIncomeFormHandler = () => {
    setOpenForm("income");
  };
  const openTransferFormHandler = () => {
    setOpenForm("transfer");
  };

  // update the form
  const updateFormHandler = (event, formKey) => {
    formKey === "Date"
      ? setExpenseForm({
          ...expenseForm,
          Date: event.toDateString(),
        })
      : setExpenseForm({
          ...expenseForm,
          [formKey]: event.target.value,
        });
  };

  const expenseFormSubmitHandler = (event) => {
    event.preventDefault();
    setFormIsValid(false);

    const updateData = async () => {
      await updateAccountBalance(expenseForm);
      await updateCategoryBalance(expenseForm);
      await updateTotalBalance(expenseForm);
      const triggerPageUpdates = async () => {
        setExpenseForm({
          From: "",
          To: "",
          Amount: "",
          Date: new Date().toDateString(),
          Comment: "",
        });

        // trigger the page to rerender with updated expenseLog
        // await props.updateExpenseLog();
        // trigger Home to rerender with updated accountLog/categoryLog
        if (props.updateHomeHandler) await props.updateHomeHandler();
      };
      await triggerPageUpdates();
    };

    const formIsValid = checkFormValidity(expenseForm, validityRules);

    if (formIsValid) {
      setFormIsValid(true);
      postNewTransactionToDB(expenseForm, "expenses");
      updateData();
    }
  };

  const formSubmitHandler = (event) => {
    openForm === "expense"
      ? expenseFormSubmitHandler(event)
      : expenseFormSubmitHandler(event);
  };

  let buttonExpense = "outlined";
  let buttonIncome = "outlined";
  let buttonTransfer = "outlined";
  openForm === "income"
    ? (buttonIncome = "contained")
    : openForm === "transfer"
    ? (buttonTransfer = "contained")
    : (buttonExpense = "contained");

  let helperTextFrom, helperTextTo, helperTextAmount;
  let invalidInputFrom, invalidInputTo, invalidInputAmount;

  if (formIsValid === false) {
    if (expenseForm.From === "") {
      helperTextFrom = "Please fill in";
      invalidInputFrom = true;
    }
    if (expenseForm.To === "") {
      helperTextTo = "Please fill in";
      invalidInputTo = true;
    }
    if (
      expenseForm.Amount <= 0 ||
      expenseForm.Amount != Number(expenseForm.Amount)
    ) {
      helperTextAmount = "Invalid input";
      invalidInputAmount = true;
    }
    if (expenseForm.Amount === "") {
      helperTextAmount = "Please fill in";
      invalidInputAmount = true;
    }
  }

  return (
    <Grid container>
      <Paper elevation={3} className={classes.root}>
        <Box my={3} mx={3}>
          <Typography variant="h5" gutterBottom color="textSecondary">
            Add new transaction
          </Typography>
        </Box>
        <Box className={classes.buttonGroup} mx={3} mb={2}>
          <ButtonGroup size="large" fullWidth>
            <Button
              color="secondary"
              variant={buttonExpense}
              onClick={openExpenseFormHandler}
            >
              Expense
            </Button>
            <Button
              color="primary"
              variant={buttonIncome}
              onClick={openIncomeFormHandler}
            >
              Income
            </Button>
            <Button
              color="default"
              variant={buttonTransfer}
              onClick={openTransferFormHandler}
            >
              Transfer
            </Button>
          </ButtonGroup>
        </Box>
        <Box mx={3}>
          <NewForm
            accountList={accountList}
            categoryList={categoryList}
            transactionType={openForm}
            formSubmitHandler={(e) => formSubmitHandler(e)}
            updateForm={updateFormHandler}
            form={expenseForm}
            selectedDate={expenseForm.Date}
            helperTextFrom={helperTextFrom}
            helperTextTo={helperTextTo}
            helperTextAmount={helperTextAmount}
            invalidInputFrom={invalidInputFrom}
            invalidInputTo={invalidInputTo}
            invalidInputAmount={invalidInputAmount}
          />
        </Box>
      </Paper>
    </Grid>
  );
};

export default NewTransactionForm;
