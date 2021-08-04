import React from "react";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    width: 500,
  },
});

const History = (props) => {
  const classes = useStyles();

  let transactions = <p>Loading...</p>;

  if (props.transactions.length > 0)
    transactions = props.transactions.map((transaction) => {
      return (
        <Grid item key={transaction.id}>
          <Card className={classes.root}>
            <CardContent>
              <Box display="inline" pr={3}>
                <Typography
                  color="textSecondary"
                  variant="body1"
                  display="inline"
                >
                  {transaction.Date}
                </Typography>
              </Box>
              <Box display="inline" pr={3}>
                <Typography
                  color={props.transactionColor}
                  variant="h6"
                  display="inline"
                >{`${transaction.From} --> ${transaction.To}`}</Typography>
              </Box>
              <Box display="inline" pr={3}>
                <Typography
                  color={props.amountColor}
                  variant="h6"
                  display="inline"
                >{`${props.sign}${transaction.Amount} ILS`}</Typography>
              </Box>
              <Box>
                <Typography color="textSecondary" variant="body1">
                  {transaction.Comment}
                </Typography>
              </Box>
            </CardContent>
            <Button variant="contained">edit</Button>
            <Button variant="contained" onClick={() => props.deleteTransaction(transaction.id, transaction.Amount, transaction.From, transaction.To)}>delete</Button>
          </Card>
        </Grid>
      );
    });

  return (
    <Grid container spacing={2}>
      {transactions}
    </Grid>
  );
};

export default History;
