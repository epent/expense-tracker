import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import AccountList from "./AccountList";
import AccountsDonut from "../../Charts/Donut/AccountsDonut";
import { getData as getAccounts } from "../../modules/fetch";

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: "#fafafa",
    borderRadius: 10,
    [theme.breakpoints.up("md")]: {
      height: 400,
    },
  },
}));

const AccountPaper = (props) => {
  const classes = useStyles();

  const [accountList, setAccountList] = useState([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      const accounts = await getAccounts("accounts");
      console.log(accounts);
      setAccountList(accounts);
    };
    fetchAccounts();
  }, [props.updateAccounts, props.updateHome]);

  return (
    <Paper elevation={3} className={classes.paper}>
      <Grid container alignItems="center">
        <Grid item xs={12}>
          <Box p={3}>
            <Typography variant="h5" color="textSecondary">
              {props.title}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} lg={5}>
          <AccountsDonut accountList={accountList} />
        </Grid>
        <Grid item xs={12} sm={6} lg={7}>
          <AccountList
            accountList={accountList}
            sliceLog={props.sliceLog}
            showEditBtn={props.showEditBtn}
            showDeleteBtn={props.showDeleteBtn}
            title={props.title}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AccountPaper;
