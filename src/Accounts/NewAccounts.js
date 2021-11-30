import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import AccountList from "./AccountList";
import Donut from "../Charts/Donut";
import NewAccountForm from "./NewAccountForm";
import { fetchAccountsFromDB } from "../modules/fetch";

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: "#fafafa",
    borderRadius: 10,
    [theme.breakpoints.up("md")]: {
      height: 345,
    },
  },
}));

const NewAccounts = (props) => {
  const classes = useStyles();

  const [accountList, setAccountList] = useState([]);

  const [updatedAccountLog, setUpdatedAccountLog] = useState(false);

  const [accountBalances, setAccountBalances] = useState([]);

  const [accountLabels, setAccountLabels] = useState([]);

  const [updateDonut, setUpdateDonut] = useState(false);

  const colors = [
    "#26a69a",
    "#b2dfdb",
    "#80cbc4",
    "#009688",
    "#00796b",
    "#004d40",
  ];

  useEffect(() => {
    const updateAccounts = async () => {
      const fetchAccounts = async () => {
        const accountList = await fetchAccountsFromDB();

        const updateState = async () => {
          const fetchedAccountBalances = accountList.map((account) => {
            return Number(account.Balance);
          });

          const fetchedAccountLabels = accountList.map((account) => {
            return account.Name;
          });

          setAccountBalances(fetchedAccountBalances);

          setAccountLabels(fetchedAccountLabels);

          setUpdateDonut((prevState) => !prevState);
        };
        await updateState();
      };
      await fetchAccounts();
    };
    updateAccounts();
  }, [updatedAccountLog, props.updateHome]);

  useEffect(() => {
    // fetch accountList from server when form is opened
    const fetchAccounts = async () => {
      const fetchedAccountList = await fetchAccountsFromDB();

      setAccountList(fetchedAccountList);
      console.log(fetchedAccountList);
    };
    fetchAccounts();
  }, [updatedAccountLog]);

  // update the list of accounts
  const updateAccountLogHandler = () => {
    setUpdatedAccountLog((prevState) => !prevState);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <NewAccountForm
          pageTitle="Add new account"
          updateAccountLog={updateAccountLogHandler}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper elevation={3} className={classes.paper}>
          <Grid container>
            <Grid item xs={12} sm={6}>
              <AccountList
                accountList={accountList}
                sliceLog={props.sliceLog}
                showEditBtn={props.showEditBtn}
                showDeleteBtn={props.showDeleteBtn}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box mt={2}>
                <Donut
                  labels={[]}
                  data={[]}
                  updatedLabels={accountLabels}
                  updatedData={accountBalances}
                  updateDonut={updateDonut}
                  colors={colors}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default NewAccounts;
