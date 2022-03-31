import React, { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import makeStyles from "@mui/styles/makeStyles";

import Form from "../Form/Form.js";
import { getData, postData as postTransaction } from "../modules/fetch.js";
import { checkFormValidity } from "../modules/validate";
import { useAuth } from "../hooks/useAuth.js";

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

  const auth = useAuth();

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

  const [formIsValid, setFormIsValid] = useState(true);

  const validityRules = {
    required: true,
    greaterThanZero: true,
    numeric: true,
  };

  useEffect(() => {
    // fetch accountList from server when form is opened
    const fetchAccounts = async () => {
      const accounts = await getData("accounts", auth.token);

      setAccountList(accounts);
    };

    // fetch categoryList from server when form is opened
    const fetchCategories = async () => {
      const categories = await getData("categories", auth.token);

      setCategoryList(categories);
    };

    if (auth.token) {
      fetchAccounts();
      fetchCategories();
    }
  }, [auth.token]);

  // update the form
  const formUpdateHandler = (event, formKey) => {
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

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    setFormIsValid(false);

    const isValid = checkFormValidity(form, validityRules);

    if (isValid) {
      setFormIsValid(true);

      const transcationType = props.transactionType
        ? props.transactionType
        : openForm;

      const response = await postTransaction(transcationType, form, auth.token);

      setForm({
        From: "",
        To: "",
        Amount: "",
        Date: new Date().toDateString(),
        // Comment: "",
      });

      if (!response) {
        props.openErrorDialog(`Failed to add new ${transcationType}.`);
      }
    }

    // trigger Home to rerender with updated accountLog/categoryLog
    if (props.updateHomeHandler) await props.updateHomeHandler();

    if (props.updateExpensesHandler) await props.updateExpensesHandler();
    if (props.updateIncomeHandler) await props.updateIncomeHandler();
    if (props.updateTransfersHandler) await props.updateTransfersHandler();
  };

  const validationErrors = {
    From: false,
    To: false,
    Amount: false,
  };
  const helperText = {};

  if (formIsValid === false) {
    if (form.From === "") {
      validationErrors.From = true;
      helperText.From = "Please fill in";
    }
    if (form.To === "") {
      validationErrors.To = true;
      helperText.To = "Please fill in";
    }
    if (form.Amount <= 0 || isNaN(Number(form.Amount))) {
      validationErrors.Amount = true;
      helperText.Amount = "Invalid input";
    }
    if (form.Amount === "") {
      validationErrors.Amount = true;
      helperText.Amount = "Please fill in";
    }
  }

  let buttonGroup;
  props.showButtonGroup
    ? (buttonGroup = (
        <Box className={classes.buttonGroup} mx={3}>
          <ButtonGroup size="large" fullWidth>
            <Button
              color="secondary"
              variant={openForm === "expense" ? "contained" : "outlined"}
              onClick={() => setOpenForm("expense")}
            >
              Expense
            </Button>
            <Button
              color="primary"
              variant={openForm === "income" ? "contained" : "outlined"}
              onClick={() => setOpenForm("income")}
            >
              Income
            </Button>
            <Button
              color="transfer"
              variant={openForm === "transfer" ? "contained" : "outlined"}
              onClick={() => setOpenForm("transfer")}
            >
              Transfer
            </Button>
          </ButtonGroup>
        </Box>
      ))
    : (buttonGroup = null);

  const addButton = (
    <IconButton
      size="medium"
      type="submit"
      color={
        props.formColor
          ? props.formColor
          : openForm === "expense"
          ? "secondary"
          : openForm === "income"
          ? "primary"
          : "transfer"
      }
    >
      <AddCircleIcon style={{ fontSize: 50 }} />
    </IconButton>
  );

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
            updateForm={formUpdateHandler}
            form={form}
            selectedDate={form.Date}
            validationErrors={validationErrors}
            helperText={helperText}
            formColor={
              props.formColor
                ? props.formColor
                : openForm === "expense"
                ? "secondary"
                : openForm === "income"
                ? "primary"
                : "transfer"
            }
            addButton={addButton}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default TransactionForm;
