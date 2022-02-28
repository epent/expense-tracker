import React, { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import makeStyles from '@mui/styles/makeStyles';

import Form from "./Form";
import {
  getDataFromDBasList as getAccountsFromDB,
  getDataFromDBasList as getCategoriesFromDB,
  getDataFromDBasList as getTotalsFromDB,
  postNewTransactionToDB,
  patchUpdatedDataToDB as pathUpdatedAccount,
  patchUpdatedDataToDB as patchUpdatedCategory,
  patchUpdatedTotal,
} from "../modules/fetch.js";
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

  const [accountNamesList, setAccountNamesList] = useState([]);
  const [categoryNamesList, setCategoryNamesList] = useState([]);

  const [accountListFull, setAccountListFull] = useState([]);
  const [categoryListFull, setCategoryListFull] = useState([]);

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
      const fetchedAccountList = await getAccountsFromDB("accounts");
      const accountListNames = fetchedAccountList.map((account) => {
        return account.Name;
      });

      setAccountNamesList(accountListNames);
      setAccountListFull(fetchedAccountList);
    };
    fetchAccounts();

    // fetch categoryList from server when form is opened
    const fetchCategories = async () => {
      const fetchedCategoryList = await getCategoriesFromDB("categories");
      const categoryListNames = fetchedCategoryList.map((category) => {
        return category.Name;
      });

      setCategoryNamesList(categoryListNames);
      setCategoryListFull(fetchedCategoryList);
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

    fetch("http://localhost:8080/expense", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Creating an expense failed!");
        }
        return res.json();
      })
      .then((result) => {
        console.log(result);
      });
    // setFormIsValid(false);

    // const updateData = async () => {
    //   const triggerPageUpdates = async () => {
    //     setForm({
    //       From: "",
    //       To: "",
    //       Amount: "",
    //       Date: new Date().toDateString(),
    //       Comment: "",
    //     });

    //     // trigger Home to rerender with updated accountLog/categoryLog
    //     if (props.updateHomeHandler) await props.updateHomeHandler();
    //     if (props.updateExpensesHandler) await props.updateExpensesHandler();
    //   };
    //   await triggerPageUpdates();
    // };

    // const formIsValid = checkFormValidity(form, validityRules);

    // if (formIsValid) {
    //   setFormIsValid(true);
    //   postNewTransactionToDB(form, "expenses");
    //   updateData();
    // }
  };

  const incomeFormSubmitHandler = (event) => {
    event.preventDefault();

    fetch("http://localhost:8080/income", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Creating an income failed!");
        }
        return res.json();
      })
      .then((result) => {
        console.log(result);
      });

    // setFormIsValid(false);

    // const updateData = async () => {

    //   const triggerPageUpdates = async () => {
    //     setForm({
    //       From: "",
    //       To: "",
    //       Amount: "",
    //       Date: new Date().toDateString(),
    //       Comment: "",
    //     });

    //     // trigger Home to rerender with updated accountLog/categoryLog
    //     if (props.updateHomeHandler) await props.updateHomeHandler();
    //     if (props.updateIncomeHandler) await props.updateIncomeHandler();
    //   };
    //   await triggerPageUpdates();
    // };

    // const formIsValid = checkFormValidity(form, validityRules);

    // if (formIsValid) {
    //   setFormIsValid(true);
    //   postNewTransactionToDB(form, "income");
    //   updateData();
    // }
  };

  const transferFormSubmitHandler = (event) => {
    event.preventDefault();

    fetch("http://localhost:8080/transfer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Creating a transfer failed!");
        }
        return res.json();
      })
      .then((result) => {
        console.log(result);
      });

    // setFormIsValid(false);

    // const updateData = async () => {

    //   const triggerPageUpdates = async () => {
    //     setForm({
    //       From: "",
    //       To: "",
    //       Amount: "",
    //       Date: new Date().toDateString(),
    //       Comment: "",
    //     });

    //     // trigger Home to rerender with updated accountLog/categoryLog
    //     if (props.updateHomeHandler) await props.updateHomeHandler();
    //     if (props.updateTransfersHandler) await props.updateTransfersHandler();
    //   };
    //   await triggerPageUpdates();
    // };

    // const formIsValid = checkFormValidity(form, validityRules);

    // if (formIsValid) {
    //   setFormIsValid(true);
    //   postNewTransactionToDB(form, "transfers");
    //   updateData();
    // }
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
              variant={buttonTransfer}
              onClick={() => {
                openFormHandler("transfer");
              }}>
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
            accountList={accountNamesList}
            categoryList={categoryNamesList}
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
