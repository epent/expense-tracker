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
} from "../../modules/fetch";

const useStyles = makeStyles({
  root: {
    width: 650,
    backgroundColor: "#fafafa",
    borderRadius: 10,
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: 650,
  },
});

const NewTransactionForm = (props) => {
  const classes = useStyles();

  const [accountList, setAccountList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  const [openForm, setOpenForm] = useState("expense");

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

  let buttonExpense = "outlined";
  let buttonIncome = "outlined";
  let buttonTransfer = "outlined";
  openForm === "income"
    ? (buttonIncome = "contained")
    : openForm === "transfer"
    ? (buttonTransfer = "contained")
    : (buttonExpense = "contained");

  return (
    <Grid container>
      <Paper elevation={3} className={classes.root}>
        <Box mt={3} mx={3}>
          <Typography variant="h5" gutterBottom color="textSecondary">
            Add new transaction
          </Typography>
        </Box>
        <Box className={classes.root}>
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
          />
        </Box>
      </Paper>
    </Grid>
  );
};

export default NewTransactionForm;