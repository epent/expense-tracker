import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import AccountList from "./AccountList";
import NewAccountForm from "./NewAccountForm";
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

const NewAccounts = (props) => {
  const classes = useStyles();

  const [accountList, setAccountList] = useState([]);

  const [updateAccounts, setUpdateAccounts] = useState(false);

  useEffect(() => {
    // fetch accountList from server when form is opened
    const fetchAccounts = async () => {
      const fetchedAccountList = await fetchAccountsFromDB();

      setAccountList(fetchedAccountList);
    };
    fetchAccounts();
  }, [updateAccounts]);

  // update the list of accounts
  const updateAccountsHandler = () => {
    setUpdateAccounts((prevState) => !prevState);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <NewAccountForm
          pageTitle="Add new account"
          updateAccounts={updateAccountsHandler}
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
              <AccountsDonut updateAccounts={updateAccounts} />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default NewAccounts;
