import React from "react";

import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { makeStyles } from "@material-ui/core/styles";

import AccountForm from "./AccountForm";

const useStyles = makeStyles({
  root: {
    width: 150,
  },
});

const AccountHistory = (props) => {
  const classes = useStyles();

  let accountList = <p>You have no accounts yet...</p>;

  if (props.accounts.length > 0)
    accountList = props.accounts.map((account) => {
      return (
        <Box key={account.id}>
          <Grid item xs={12}>
            <ListItem>
              <Grid item className={classes.root} xs={6}>
                <Typography
                  color="textSecondary"
                  variant="body1"
                  align="left"
                >{`${account.Name}`}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  color="textSecondary"
                  variant="body2"
                  align="right"
                >{`${account.Balance} ILS`}</Typography>
              </Grid>
              {props.showEditBtn && (
                <IconButton
                  onClick={() =>
                    props.editAccount(
                      account.id,
                      account.Name,
                      account.Category,
                      account.Balance
                    )
                  }
                >
                  <EditIcon />
                </IconButton>
              )}
              {props.showDeleteBtn && (
                <IconButton onClick={() => props.deleteAccount(account.id)}>
                  <DeleteIcon />
                </IconButton>
              )}
            </ListItem>
          </Grid>
          <Grid item xs={12}>
            {props.showAccountForm && account.id === props.editedAccountId && (
              <AccountForm
                editedAccountForm={props.accountForm}
                showEditedForm={props.showAccountForm}
                editedAccountId={props.editedAccountId}
                setShowAccountForm={props.setShowAccountForm}
                updateAccountLog={props.updateAccountLog}
              />
            )}
          </Grid>
        </Box>
      );
    });

  return (
    <Box mt={2} mb={4}>
      <Grid container spacing={2}>
        <List>{accountList}</List>
      </Grid>
    </Box>
  );
};

export default AccountHistory;
