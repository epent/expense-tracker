import React from "react";

import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    width: 300,
  },
});

const AccountHistory = (props) => {
  const classes = useStyles();

  let accountList = <p>Loading...</p>;

  if (props.accounts.length > 0)
    accountList = props.accounts.map((account) => {
      return (
        <Grid item key={account.id}>
          <Card className={classes.root} variant="outlined">
            <CardContent>
              <Typography
                color="textSecondary"
                variant="h6"
                align="left"
              >{`${account.Name}`}</Typography>
              <Typography
                color="textSecondary"
                variant="h6"
                align="right"
              >{`${account.Balance} ILS`}</Typography>
            </CardContent>
            <IconButton>
              <DeleteIcon onClick={() => props.deleteAccount(account.id)} />
            </IconButton>
          </Card>
        </Grid>
      );
    });

  return (
    <Grid container spacing={2}>
      {accountList}
    </Grid>
  );
};

export default AccountHistory;
