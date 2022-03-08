import React, { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import makeStyles from "@mui/styles/makeStyles";

import Form from "./Form";
import { getData, postData as postTransaction } from "../modules/fetch.js";

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
    // Comment: "",
  });

  const validityRules = {
    required: true,
    greaterThanZero: true,
  };

  const [formIsValid, setFormIsValid] = useState(true);

  useEffect(() => {
    // fetch accountList from server when form is opened
    const fetchAccounts = async () => {
      const accounts = await getData("accounts");

      setAccountList(accounts);
    };
    fetchAccounts();

    // fetch categoryList from server when form is opened
    const fetchCategories = async () => {
      const categories = await getData("categories");

      setCategoryList(categories);
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

  const expenseFormSubmitHandler = async (event) => {
    event.preventDefault();

    setFormIsValid(false);

    const isValid = checkFormValidity(form, validityRules);

    if (isValid) {
      setFormIsValid(true);

      const response = await postTransaction("expense", form);

      setForm({
        From: "",
        To: "",
        Amount: "",
        Date: new Date().toDateString(),
        // Comment: "",
      });

      if (!response) {
        props.openErrorDialog("Failed to add new expense.");
      }
    }

    // trigger Home to rerender with updated accountLog/categoryLog
    if (props.updateHomeHandler) await props.updateHomeHandler();
    if (props.updateExpensesHandler) await props.updateExpensesHandler();
  };

  const incomeFormSubmitHandler = async (event) => {
    event.preventDefault();

    setFormIsValid(false);

    const isValid = checkFormValidity(form, validityRules);

    if (isValid) {
      setFormIsValid(true);

      const response = await postTransaction("income", form);

      setForm({
        From: "",
        To: "",
        Amount: "",
        Date: new Date().toDateString(),
        // Comment: "",
      });

      if (!response) {
        props.openErrorDialog("Failed to add new income.");
      }
    }

    // trigger Home to rerender with updated accountLog/categoryLog
    if (props.updateHomeHandler) await props.updateHomeHandler();
    if (props.updateIncomeHandler) await props.updateIncomeHandler();
  };

  const transferFormSubmitHandler = async (event) => {
    event.preventDefault();

    setFormIsValid(false);

    const isValid = checkFormValidity(form, validityRules);

    if (isValid) {
      setFormIsValid(true);

      const response = await postTransaction("transfer", form);

      setForm({
        From: "",
        To: "",
        Amount: "",
        Date: new Date().toDateString(),
        // Comment: "",
      });

      if (!response) {
        props.openErrorDialog("Failed to add new transfer.");
      }
    }

    // trigger Home to rerender with updated accountLog/categoryLog
    if (props.updateHomeHandler) await props.updateHomeHandler();
    if (props.updateTransfersHandler) await props.updateTransfersHandler();
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
    if (form.Amount <= 0 || form.Amount !== Number(form.Amount)) {
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
              color="transfer"
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
