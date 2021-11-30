import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";

import AccountList from "./AccountList";
import AccountsDonut from "../Charts/AccountsDonut";
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

const AccountPaper = (props) => {
  const classes = useStyles();

  const [accountList, setAccountList] = useState([]);

  useEffect(() => {
    // fetch accountList from server when form is opened
    const fetchAccounts = async () => {
      const fetchedAccountList = await fetchAccountsFromDB();

      setAccountList(fetchedAccountList);
    };
    fetchAccounts();
  }, [props.updateAccounts, props.updateHome]);

  return (
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
          <AccountsDonut
            updateAccounts={props.updateAccounts}
            updateHome={props.updateHome}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AccountPaper;
