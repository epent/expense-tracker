import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import AddBoxIcon from "@material-ui/icons/AddBox";
import { makeStyles } from "@material-ui/core/styles";

import AccountForm from "../Accounts/AccountForm";
import AccountLog from "../Accounts/AccountLog";
import Donut from "../Charts/Donut";
import { fetchAccountsFromDB } from "../modules/fetch";

const useStyles = makeStyles({
  paper: {
    backgroundColor: "#fafafa",
    borderRadius: 10,
  },
});

const Accounts = (props) => {
  const classes = useStyles();

  const [accountFormShow, setAccountFormShow] = useState(false);

  const [updatedAccountLog, setUpdatedAccountLog] = useState(false);

  const [accountBalances, setAccountBalances] = useState([]);

  const [accountLabels, setAccountLabels] = useState([]);

  const [updateDonut, setUpdateDonut] = useState(false);

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

  // show the form when toggle "+Accounts" button
  const showAccountFormHandler = () => {
    setAccountFormShow((prevState) => !prevState);
  };

  // update the list of accounts
  const updateAccountLogHandler = () => {
    setUpdatedAccountLog((prevState) => !prevState);
  };

  const accountForm = (
    <Box>
      <Grid item xs={12}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddBoxIcon />}
            onClick={showAccountFormHandler}
          >
            Accounts
          </Button>
        </Grid>
        <Grid item xs={12}>
          {accountFormShow && (
            <AccountForm updateAccountLog={updateAccountLogHandler} />
          )}
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Grid container>
      {props.showAccountForm && accountForm}
      <Box sx={{ height: "100%", width: "100%" }}>
        <Paper elevation={3} className={classes.paper}>
          <Grid container>
            <Grid item xs={12} sm={6}>
              <Box my={3} mx={3}>
                <Typography variant="h5" gutterBottom color="textSecondary">
                  Accounts
                </Typography>
              </Box>
              <Box px={3}>
                <AccountLog
                  sliceLog={props.sliceLog}
                  showEditBtn={props.showEditBtn}
                  showDeleteBtn={props.showDeleteBtn}
                  updatedAccountLog={updatedAccountLog}
                  updateAccountLog={updateAccountLogHandler}
                  updateHome={props.updateHome}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box mt={2}>
                <Donut
                  labels={[]}
                  data={[]}
                  updatedLabels={accountLabels}
                  updatedData={accountBalances}
                  updateDonut={updateDonut}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Grid>
  );
};

export default Accounts;
