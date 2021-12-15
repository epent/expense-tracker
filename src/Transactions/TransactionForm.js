import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";

import Form from "./Form";
import {
  getDataFromDBasList as getAccountsFromDB,
  getDataFromDBasList as getCategoriesFromDB,
  postNewTransactionToDB,
} from "../modules/fetch";
import {
  updateAccountBalance,
  updateCategoryBalance,
  updateTotalBalance,
} from "../modules/submit";
import { checkFormValidity } from "../modules/validate";

const TransactionForm = (props) => {
  const useStyles = makeStyles((theme) => ({
    paper: {
      backgroundColor: "#fafafa",
      borderRadius: 10,
      height: props.paperHeight,
    },
    buttonGroup: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  }));
  const classes = useStyles();

  const [accountList, setAccountList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  const [openForm, setOpenForm] = useState("expense");

  const [form, setForm] = useState({
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
      const fetchedAccountList = await getAccountsFromDB("accounts");
      const accountList = fetchedAccountList.map((account) => {
        return account.Name;
      });

      setAccountList(accountList);
      console.log(accountList);
    };
    fetchAccounts();

    // fetch categoryList from server when form is opened
    const fetchCategories = async () => {
      const fetchedCategoryList = await getCategoriesFromDB("categories");
      const categoryList = fetchedCategoryList.map((category) => {
        return category.Name;
      });

      setCategoryList(categoryList);
      console.log(categoryList);
    };
    fetchCategories();
  }, []);

  const openFormHandler = (type) => {
    setOpenForm(type);
  };

  // update the form
  const updateFormHandler = (event, formKey) => {
    formKey === "Date"
      ? setForm({
          ...form,
          Date: event.toDateString(),
        })
      : setForm({
          ...form,
          [formKey]: event.target.value,
        });
  };

  const expenseFormSubmitHandler = (event) => {
    event.preventDefault();
    setFormIsValid(false);

    const updateData = async () => {
      await updateAccountBalance(form, "expenses");
      await updateCategoryBalance(form);
      await updateTotalBalance(form, "expenses");
      const triggerPageUpdates = async () => {
        setForm({
          From: "",
          To: "",
          Amount: "",
          Date: new Date().toDateString(),
          Comment: "",
        });

        // trigger Home to rerender with updated accountLog/categoryLog
        if (props.updateHomeHandler) await props.updateHomeHandler();
        if (props.updateExpensesHandler) await props.updateExpensesHandler();
      };
      await triggerPageUpdates();
    };

    const formIsValid = checkFormValidity(form, validityRules);

    if (formIsValid) {
      setFormIsValid(true);
      postNewTransactionToDB(form, "expenses");
      updateData();
    }
  };

  const incomeFormSubmitHandler = (event) => {
    event.preventDefault();
    setFormIsValid(false);

    const updateData = async () => {
      await updateAccountBalance(form, "income");
      await updateTotalBalance(form, "income");
      const triggerPageUpdates = async () => {
        setForm({
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
        if (props.updateIncomeHandler) await props.updateIncomeHandler();
      };
      await triggerPageUpdates();
    };

    const formIsValid = checkFormValidity(form, validityRules);

    if (formIsValid) {
      setFormIsValid(true);
      postNewTransactionToDB(form, "income");
      updateData();
    }
  };

  const transferFormSubmitHandler = (event) => {
    event.preventDefault();
    setFormIsValid(false);

    const updateData = async () => {
      await updateAccountBalance(form, "transfer", "From");
      await updateAccountBalance(form, "transfer", "To");
      const triggerPageUpdates = async () => {
        setForm({
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
        if (props.updateTransfersHandler) await props.updateTransfersHandler();
      };
      await triggerPageUpdates();
    };

    const formIsValid = checkFormValidity(form, validityRules);

    if (formIsValid) {
      setFormIsValid(true);
      postNewTransactionToDB(form, "transfers");
      updateData();
    }
  };

  const formSubmitHandler = (event) => {
    openForm === "transfer" || props.transactionType === "transfer"
      ? transferFormSubmitHandler(event)
      : openForm === "income" || props.transactionType === "income"
      ? incomeFormSubmitHandler(event)
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
    if (form.From === "") {
      helperTextFrom = "Please fill in";
      invalidInputFrom = true;
    }
    if (form.To === "") {
      helperTextTo = "Please fill in";
      invalidInputTo = true;
    }
    if (form.Amount <= 0 || form.Amount != Number(form.Amount)) {
      helperTextAmount = "Invalid input";
      invalidInputAmount = true;
    }
    if (form.Amount === "") {
      helperTextAmount = "Please fill in";
      invalidInputAmount = true;
    }
  }

  let buttonGroup;
  props.showButtonGroup
    ? (buttonGroup = (
        <Box className={classes.buttonGroup} mx={3}>
          <ButtonGroup size="large" fullWidth>
            <Button
              color="secondary"
              variant={buttonExpense}
              onClick={() => {
                openFormHandler("expense");
              }}
            >
              Expense
            </Button>
            <Button
              color="primary"
              variant={buttonIncome}
              onClick={() => {
                openFormHandler("income");
              }}
            >
              Income
            </Button>
            <Button
              color="default"
              variant={buttonTransfer}
              onClick={() => {
                openFormHandler("transfer");
              }}
            >
              Transfer
            </Button>
          </ButtonGroup>
        </Box>
      ))
    : (buttonGroup = null);

  return (
    <Box>
      <Paper elevation={3} className={classes.paper}>
        <Box p={3}>
          <Typography variant="h5" color="textSecondary">
            {props.pageTitle}
          </Typography>
        </Box>
        {buttonGroup}
        <Box mx={3}>
          <Form
            accountList={accountList}
            categoryList={categoryList}
            transactionType={
              props.transactionType ? props.transactionType : openForm
            }
            formSubmitHandler={formSubmitHandler}
            updateForm={updateFormHandler}
            form={form}
            selectedDate={form.Date}
            helperTextFrom={helperTextFrom}
            helperTextTo={helperTextTo}
            helperTextAmount={helperTextAmount}
            invalidInputFrom={invalidInputFrom}
            invalidInputTo={invalidInputTo}
            invalidInputAmount={invalidInputAmount}
            addButtonColor={props.addButtonColor}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default TransactionForm;